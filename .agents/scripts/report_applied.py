from pathlib import Path
import json, html

rows=json.loads(Path('docs/classification-applied.json').read_text())
source=json.loads(Path('generated-artifacts/classification-whatsapp-transcription.json').read_text())
known={x['reference'] for x in rows}
new=sorted(set(source)-known)
esc=html.escape
body="""<h1>Mise à jour des classifications — rapport</h1>
<p>Validation appliquée : classifications uniquement, sans ajout au catalogue public.</p>
<ul><li>116 fiches publiques conservées ; aucune ajoutée ni supprimée.</li>
<li>50 classifications publiques modifiées ; 27 harmonisations de libellé ou d’ordre ; 32 classements strictement inchangés ; 7 références absentes du tableau intégralement conservées.</li>
<li>14 références restent en attente : 11 classements mis à jour (dont une harmonisation de libellé), 1 déjà identique, 2 absentes de la source.</li>
<li>Aucun nom, marque, photo, statut de vérification ou code n’a été changé. Une information de provenance a été ajoutée aux correspondances exactes.</li>
<li>Les cinq filtres sont Floraux, Fruités, Hespéridés, Boisés, Orientaux / Ambrés. Les classements anciens des références absentes sont conservés sur leurs fiches ; Parfums d’été n’est pas un sixième filtre olfactif.</li></ul>
<h2>Codes à compléter et différences d’écriture</h2><p>Les 34 codes suivants n’ont aucune fiche sous cette écriture exacte : """
body+=esc(', '.join(new))+""". Aucun ajout effectué.</p>
<p>Correspondances non confirmées : 079/79, 146/146U, 147/147M, 150/150M, 155/155U, 157/157M, 160/160M. Le chemin PDF reçu est local à l’ordinateur de l’utilisateur et ne constitue pas un fichier accessible ni une validation de ces paires.</p>
<p>Les 14 références en attente restent toutes hors catalogue : 006, 010, 012, 023, 028, 060, 79, 113, 128, 136, 140, 152M, 161, 162. Les réserves nom/marque/variante décrites dans le rapport de vérification initial restent ouvertes. Les blocages de catégorie seuls ont été résolus pour 006, 010, 028, 113, 136, 140, mais leur ajout n’est pas autorisé.</p>
<h2>Détail de toutes les références existantes</h2>
<div class="scroll"><table><tr><th>Code</th><th>Situation</th><th>Avant</th><th>Après</th><th>Action</th></tr>"""
for r in sorted(rows,key=lambda x:x['reference']):
 def describe(x): return ', '.join(x['families'])+' / '+', '.join(x['categories'])
 body+='<tr>'+''.join('<td>'+esc(v)+'</td>' for v in [r['reference'],'Public' if r['public'] else 'En attente',describe(r['before']),describe(r['after']),r['state']])+'</tr>'
body+='</table></div>'
body+='<h2>Présentation et mentions légales</h2><p>La présentation personnelle fournie et la mention de parrainage indépendante sont intégrées. Les éléments légaux à compléter sont conservés dans le guide de travail, hors du site public. Aucune identité, adresse, société, certification ni immatriculation fictive n’a été publiée. Le site n’est pas publié.</p>'
body+='<h2>Contrôles réalisés après application</h2><ul><li>TypeScript : aucun échec.</li><li>Contrôle automatisé des données : 116 codes uniques, correspondances exactes avec la transcription, autres champs inchangés, 7 références publiques absentes intégralement conservées, 14 références en attente exclues, QR identique octet par octet.</li><li>Navigateur : 7 et 007 trouvent uniquement 007 ; 155U reste distinct de 155 ; référence 019 visible avec chacune de ses trois familles et Pour elle ; détail cohérent ; Pour lui + Fruités donne un résultat vide ; réinitialisation à 116.</li><li>Cinq filtres de familles et trois catégories exercés. Sur mobile 390 × 844 : ouverture des filtres et d’une fiche, aucun débordement horizontal de page ; rangées de filtres défilables.</li><li>Présentation personnelle et mention indépendante visibles, destinations boutique exactes contrôlées.</li></ul><p>Limites : aucun achat ni contrôle du site externe, pas d’audit juridique ni de validation exhaustive de tous les navigateurs. Les noms et marques n’ont pas été revalidés à partir de WhatsApp.</p>'
out=Path('generated-artifacts/classifications-appliquees.html')
out.write_text('<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rapport des classifications appliquées</title><style>body{font:16px/1.6 system-ui;max-width:1400px;margin:40px auto;padding:0 24px;background:#f8f5ee;color:#27221d}h1,h2{font-family:Georgia}table{border-collapse:collapse;width:100%;background:white}th,td{border:1px solid #d9cdbb;padding:12px;text-align:left;vertical-align:top}th{background:#eadfcb}.scroll{overflow:auto}</style>'+body+'</html>')
print(out)
