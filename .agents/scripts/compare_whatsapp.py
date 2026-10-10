"""Manually visually transcribed WhatsApp classification; proposal only, no app edits."""
from pathlib import Path
from collections import defaultdict
import json, csv, html

groups = {
    "Floraux": {
        "Pour elle": "007 014 019 024 025 026 027 039 042 049 051 053 057 064 067 071 080 082 085 089 093 096 097 098 109 115 120 121 122 123 132 133 145 148W 151W 153W 154W 156W 158W 159W 161",
        "Pour lui": "060 079 152M",
        "Mixte": "144",
    },
    "Fruités": {
        "Pour elle": "019 089 116 120 159W",
        "Mixte": "110 111 129 134",
    },
    "Hespéridés": {
        "Pour elle": "019",
        "Pour lui": "021 060 011 013",
        "Mixte": "044 076 099 119",
    },
    "Boisés": {
        "Pour lui": "003 006 010 015 030 031 040 046 048 055 058 065 072 090 094 107 152M",
        "Mixte": "114 124 126 128 135 138 141 146 147 149 150 157 160",
    },
    "Orientaux / Ambrés": {
        "Pour lui": "001 002 004 005 008 009 012 016 017 018 022 028 029 032 033 034 035 036 037 038 041 043 048 050 052 054 056 059 061 062 063 066 068 069 070 073 074 075 077 078 083 086 087 088 092 095 100 101 102 103 104 105 106 108 152M",
        "Mixte": "112 113 117 118 125 127 130 131 136 137 139 140 142 143 155 162",
    },
}
current = {p["reference"]: p for p in json.loads(Path("artifacts/parfums/src/data/products.json").read_text())}
pending = {p["reference"]: p for p in json.loads(Path("docs/references-a-confirmer.json").read_text())}
table = defaultdict(lambda: {"families": [], "categories": []})
for family, cats in groups.items():
    for cat, codes in cats.items():
        for code in codes.split():
            table[code]["families"].append(family)
            if cat not in table[code]["categories"]:
                table[code]["categories"].append(cat)

resolved_category_only = {"006", "010", "028", "113", "136", "140"}
possible_pairs = {"079": "79", "146": "146U", "147": "147M", "150": "150M", "155": "155U", "157": "157M", "160": "160M"}
issues = {
    "012": "Nom « Eau Sauvage L » : signification du L non résolue.",
    "060": "Marque absente de la brochure : reste à fournir.",
    "128": "Association « Vanille Fatale – Dior » non résolue.",
    "152M": "Catégorie masculine cohérente dans 3 familles ; version de Guilty encore à confirmer.",
    "161": "Variante Born in Roma Intense et correspondance avec 162 à confirmer.",
    "162": "Mixte dans cette source ; variante Born in Roma Intense et correspondance avec 161 à confirmer.",
}
rows=[]
stats=defaultdict(int)
for code in sorted(set(current) | set(pending) | set(table)):
    old=current.get(code) or pending.get(code)
    new=table.get(code)
    uncertainty="Aucune ambiguïté de lecture relevée ; noms, marques et images non revalidés."
    if new:
        families=" ; ".join(new["families"])
        categories=" ; ".join(new["categories"])
        if len(new["categories"]) > 1:
            uncertainty="CONFLIT DE COULEURS : validation nécessaire."
        if code in current:
            oldfamilies=[f.replace("Orientaux ambrés","Orientaux / Ambrés") for f in old["families"]]
            changed=set(oldfamilies)!=set(new["families"]) or set(old["categories"])!=set(new["categories"])
            status="Modification proposée" if changed else "Classement inchangé"
            action=f"{status}. Ancien : {', '.join(old['families'])} / {', '.join(old['categories'])}."
            stats["public_changed" if changed else "public_same"]+=1
        elif code in pending:
            stats["pending_present"]+=1
            if code in resolved_category_only:
                action="Ancien blocage de catégorie résolu par la source prioritaire ; ajout public proposé après votre accord, nom/marque déjà transcrits de la brochure."
            else:
                action="Mettre à jour famille(s)/catégorie dans les entrées en attente ; maintenir hors catalogue public."
                uncertainty=issues.get(code,uncertainty)
        else:
            stats["new"]+=1
            action="Référence à ajouter ou compléter ; aucune fiche publique sans identité confirmée."
            uncertainty="Nom et marque à fournir ou vérifier."
            if code in possible_pairs:
                uncertainty=f"Le tableau écrit {code} ; la brochure contient {possible_pairs[code]}. Confirmer l’identité avant renommage/fusion ; aucune catégorie ou famille transférée automatiquement."
    else:
        stats["public_absent" if code in current else "pending_absent"]+=1
        families=" ; ".join(old["families"])
        categories=" ; ".join(old["categories"])
        action="Absent du tableau : conserver les données actuelles" + (" et maintenir hors catalogue." if code in pending else ".")
        uncertainty="Non confirmé par la nouvelle source."
        for candidate, existing in possible_pairs.items():
            if code==existing:
                uncertainty=f"Possiblement {candidate} dans le tableau : fusion et transfert de classement non autorisés sans confirmation."
    rows.append({"Référence":code,"Famille(s)":families,"Catégorie":categories,"Changement proposé":action,"Incertitude":uncertainty})

out=Path("generated-artifacts")
out.mkdir(exist_ok=True)
(out/"classification-whatsapp-transcription.json").write_text(json.dumps(dict(table),ensure_ascii=False,indent=2))
with (out/"classification-whatsapp-proposition.csv").open("w",encoding="utf-8-sig",newline="") as f:
    writer=csv.DictWriter(f,fieldnames=list(rows[0]),delimiter=";"); writer.writeheader(); writer.writerows(rows)
header="""<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Classification WhatsApp — proposition à valider</title><style>body{font:16px/1.5 system-ui;background:#f8f5ee;color:#24221e;margin:32px auto;max-width:1500px;padding:0 20px}h1,h2{font-family:Georgia}table{width:100%;border-collapse:collapse;background:white}td,th{border:1px solid #d9d0c2;padding:12px;text-align:left;vertical-align:top}th{background:#e9dfcf;position:sticky;top:0}td:first-child{font-weight:bold;white-space:nowrap}.scroll{overflow:auto}strong{color:#76462b}</style><h1>Classification WhatsApp — proposition à valider</h1><p>Aucune donnée du catalogue ni aucun texte du site n’a été modifié. Transcription visuelle de chaque code et de sa couleur dans le tableau central, avec agrandissement. Rose = Pour elle ; bleu = Pour lui ; orange = Mixte. Cette source ne valide ni noms, ni marques, ni images, ni prix.</p>"""
summary=f"<h2>Bilan</h2><p>{len(table)} codes distincts dans le tableau, {sum(len(v['families']) for v in table.values())} apparitions. Aucun conflit de couleur entre apparitions exactes d’un même code n’a été relevé.</p><p>Catalogue actuel : {stats['public_changed']} classements à modifier, {stats['public_same']} inchangés, {stats['public_absent']} références absentes de cette source à conserver. En attente : {stats['pending_present']} présentes et {stats['pending_absent']} absentes. {stats['new']} codes du tableau absents des deux listes exactes.</p><p>Les familles affichées pour les références absentes sont leurs données actuelles, pas une lecture de WhatsApp. Pour les références présentes, les nouvelles familles remplaceraient les anciennes. « Parfums d’été » reste conservé dans les données des références absentes, mais ne serait pas l’un des cinq nouveaux filtres olfactifs.</p><p>006, 010, 028, 113, 136 et 140 : le blocage précédent concernait seulement la catégorie ; leur ajout public est proposé à validation. Les autres entrées en attente restent exclues tant que leur identité n’est pas confirmée.</p><h2>Présentation proposée</h2><p>Je vous propose une sélection de parfums Chogan et vous accompagne dans le choix de votre référence. Pour commander en ligne, mon lien de parrainage vous redirige vers le site Chogan, où vous pouvez consulter les produits et effectuer votre achat.</p><p>Site de présentation indépendant. Les commandes en ligne s’effectuent sur le site Chogan via mon lien de parrainage.</p><p>Aucun statut, numéro, adresse ou certification ne sera inventé. Les éléments légaux à compléter resteront dans le guide de travail, pas sous forme de renseignements fictifs publiés.</p><h2>Tableau complet : {len(rows)} références</h2>"
tablehtml='<div class="scroll"><table><thead><tr>'+''.join('<th>'+html.escape(k)+'</th>' for k in rows[0])+'</tr></thead><tbody>'
for row in rows:
    tablehtml+='<tr>'+''.join('<td>'+html.escape(v)+'</td>' for v in row.values())+'</tr>'
tablehtml+='</tbody></table></div></html>'
(out/"classification-whatsapp-proposition.html").write_text(header+summary+tablehtml)
print(json.dumps({"distinct":len(table),"appearances":sum(len(v["families"]) for v in table.values()),"stats":stats,"public_absent":sorted(set(current)-set(table)),"pending_absent":sorted(set(pending)-set(table)),"new":sorted(set(table)-set(current)-set(pending))},ensure_ascii=False,indent=2))
