"""Transcription contrôlée visuellement, page par page, et dédoublonnage."""
from pathlib import Path
import json
import fitz
from PIL import Image
import zxingcpp

pages = {
2: ("Pour elle","Floraux","007|J’Adore|Dior;042|La Vie Est Belle|Lancôme;051|Coco Mademoiselle|Chanel;055|Black Opium|Yves Saint Laurent;019|Lady Million|Paco Rabanne"),
3: ("Pour elle","Floraux","089|Mon Paris|Yves Saint Laurent;093|Aventus for Her|Creed;097|Amo|Ferragamo;098|Joy|Dior;109|J’Adore L’Or|Dior"),
4: ("Pour elle","Floraux","115|Idôle|Lancôme;120|La Petite Robe Noire|Guerlain;121|L’Interdit|Givenchy;122|Libre|Yves Saint Laurent;123|Good Girl Gone Bad|Kilian"),
5: ("Pour elle","Floraux","024|N°5|Chanel;026|Flower|Kenzo;067|Olympéa|Paco Rabanne;096|Gabrielle|Chanel;085|Chance|Chanel"),
6: ("Pour elle","Floraux","057|Omnia Amethyst|Bvlgari;064|Omnia Indian Garnet|Bvlgari;071|Allure|Chanel;080|Sì|Giorgio Armani;082|Signorina|Ferragamo"),
7: ("Pour elle","Floraux","132|My Way|Giorgio Armani;133|Prada Paradoxe|Prada;145|Devotion|Dolce & Gabbana;148W|Goddess|Burberry;151W|Guilty|Gucci"),
8: ("Pour elle","Parfums d’été","011|Light Blue (Femme)|Dolce & Gabbana;049|Dolce|Dolce & Gabbana;076|Acqua di Gioia|Giorgio Armani;029|L’Eau d’Issey|Issey Miyake;155U|CK One|Calvin Klein"),
9: ("Pour elle","Parfums d’été","014|Manifesto|Yves Saint Laurent;025|For Her|Narciso Rodriguez;027|Trésor|Lancôme;039|Miss Dior Chérie|Dior;053|Narciso|Narciso Rodriguez"),
10: ("Pour elle","Parfums d’été","153W|Chloé|Chloé;154W|Love Chloé|Chloé;156W|Hugo|Hugo Boss;158W|Flora|Gucci;159W|Burberry Women|Burberry;161|Born in Roma Intense|Valentino"),
11: ("Pour elle","Hespéridés","019|Lady Million|Paco Rabanne;089|Mon Paris|Yves Saint Laurent;076|Acqua di Gioia|Giorgio Armani;116|Yes I Am|Cacharel;120|La Petite Robe Noire|Guerlain;159W|Burberry Women|Burberry;119|Scandal|Jean Paul Gaultier"),
12: ("Pour lui","Floraux","001|One Million|Paco Rabanne;002|Acqua di Giò|Giorgio Armani;038|Bleu de Chanel|Chanel;061|Invictus|Paco Rabanne;020|La Nuit de l’Homme|Yves Saint Laurent;003|Fahrenheit|Dior;015|Roma Uomo|Laura Biagiotti;030|Black XS|Paco Rabanne;031|BLV|Bvlgari;048|Allure Homme|Chanel"),
13: ("Pour lui","Floraux","094|Sauvage|Dior;147M|Bottled Absolu|Hugo Boss;150M|Hugo|Hugo Boss;152M|Guilty|Gucci;157M|The Scent|Hugo Boss;060|Millésime Impérial|"),
14: ("Mixte","Boisés","054|Black Orchid|Tom Ford;100|White Aoud|Montale;105|Intense Café|Montale;072|Patchouli|Réminiscence;155U|CK One|Calvin Klein;044|Silver Mountain|Creed;072|Patchouli|Réminiscence;144|Bianco Latte|Giardini Di Toscana;110|Kirké|Tiziana Terenzi;111|Lost Cherry|Tom Ford;129|Erba Pura|Xerjoff;134|Bitter Peach|Tom Ford;099|Mandarino Di Amalfi|Tom Ford"),
15: ("Mixte","Boisés","114|Ombre Nomade|Louis Vuitton;124|Zeta|Morph;126|Soleil Blanc|Tom Ford;128|Vanille Fatale|Dior;135|Bois d’Argent|Dior;138|Wood Whisper|Ojar;141|Turath|The Spirit of Dubai;146U|Rouge|Pierre Balmain"),
16: ("Pour elle","Boisés","006|Opium|Yves Saint Laurent;010|Alien|Thierry Mugler;040|Hypnose|Lancôme;055|Black Opium|Yves Saint Laurent;090|Poison Girl|Dior"),
17: ("Pour lui","Boisés","147M|Bottled Absolu|Hugo Boss;150M|Hugo|Hugo Boss;152M|Guilty|Gucci;157M|The Scent|Hugo Boss;160M|Burberry for Men|Burberry"),
18: ("Pour lui","","006|Opium|Yves Saint Laurent;028|Angel|Thierry Mugler;010|Alien|Thierry Mugler;032|Spicebomb|Viktor & Rolf;023|Hypnotic Poison|Dior"),
19: ("Pour lui","Orientaux ambrés","001|One Million|Paco Rabanne;002|Acqua di Giò|Giorgio Armani;004|The One|Dolce & Gabbana;012|Eau Sauvage L|Dior;016|Le Mâle|Jean Paul Gaultier;018|Déclaration|Cartier;022|Terre d’Hermès|Hermès;032|Spicebomb|Viktor & Rolf;033|Black Code|Giorgio Armani;037|Man|Bvlgari;038|Bleu de Chanel|Chanel;048|Allure Homme|Chanel;052|Pasha|Cartier"),
20: ("Pour lui","Orientaux ambrés","061|Invictus|Paco Rabanne;062|Intenso|Dolce & Gabbana;066|Scent Intense|Costume National;068|Aventus|Creed;069|Acqua di Sale|Profumum Roma;074|Black Afgano|Nasomatto;075|X for Men|Clive Christian;086|Legend|Montblanc;087|Wanted|Azzaro;088|Man in Black|Bvlgari"),
21: ("Mixte","Orientaux ambrés","054|Black Orchid|Tom Ford;073|Himalaya|Creed;073|Himalaya|Creed;100|White Aoud|Montale;101|Velvet Amber Skin|Dolce & Gabbana;102|Velvet Amber Sun|Dolce & Gabbana;105|Intense Café|Montale;106|Fucking Fabulous|Tom Ford;112|Néroli Portofino|Tom Ford;117|Tobacco Vanille|Tom Ford;118|Baccarat Rouge 540|Maison Francis Kurkdjian;125|Sole di Positano|Tom Ford;127|Oud Wood|Tom Ford;130|Megamare|Orto Parisi;137|XJ 1861 Naxos|Xerjoff;139|Les Sables Roses|Louis Vuitton;142|Ombré Leather|Tom Ford;143|Vanille Powder|Matière Première;155U|CK One|Calvin Klein"),
22: ("Pour elle","Orientaux ambrés","028|Angel|Thierry Mugler;029|L’Eau d’Issey|Issey Miyake;056|Ange ou Démon|Givenchy;070|The One|Dolce & Gabbana;131|Good Girl|Carolina Herrera;113|Sur la Route|Louis Vuitton;136|Dior Homme Intense|Dior;140|Éros|Versace;152M|Guilty|Gucci;162|Born in Roma Intense|Valentino"),
23: ("","","118|Baccarat Rouge 540|Maison Francis Kurkdjian;111|Lost Cherry|Tom Ford;117|Tobacco Vanille|Tom Ford;127|Oud Wood|Tom Ford;79|MYSLF|Yves Saint Laurent;152M|Guilty|Gucci;129|Erba Pura|Xerjoff"),
}
luxury=set("093 109 122 123 132 133 094 060 044 144 110 111 129 134 099 114 124 126 128 135 138 141 146U 068 074 075 131 113 136 118 117 127 79 152M".split())
pending=set("006 010 028 023 113 136 140 152M 161 162 128 79 060 012".split())
products={}
for page,(category,family,rows) in pages.items():
    for row in rows.split(";"):
        code,name,brand=row.split("|")
        if code not in products:
            products[code]={"reference":code,"referenceName":name,"referenceBrand":brand,"categories":[],"families":[],"collection":"Luxe / Luxury" if code in luxury else None,"image":None,"sourcePages":[],"verificationStatus":"pending" if code in pending else "verified"}
        p=products[code]
        assert p["referenceName"]==name and p["referenceBrand"]==brand
        for key,val in [("categories",category),("families",family),("sourcePages",page)]:
            if val and val not in p[key]: p[key].append(val)
out=Path("artifacts/parfums/src/data")
out.mkdir(parents=True,exist_ok=True)
verified=[p for p in products.values() if p["verificationStatus"]=="verified"]
(out/"products.json").write_text(json.dumps(verified,ensure_ascii=False,indent=2)+"\n")
review=Path("docs")
review.mkdir(exist_ok=True)
(review/"references-a-confirmer.json").write_text(json.dumps([p for p in products.values() if p["verificationStatus"]=="pending"],ensure_ascii=False,indent=2)+"\n")
# Preserve the actual brochure QR, including a white quiet zone.
im=Image.open("generated-artifacts/brochure/page-01.png")
result=zxingcpp.read_barcodes(im)[0]
assert result.text=="https://www.chogangroupspa.com/referral/ALY318F64/FR"
pts=[result.position.top_left,result.position.top_right,result.position.bottom_left,result.position.bottom_right]
bounds=(min(p.x for p in pts)-16,min(p.y for p in pts)-16,max(p.x for p in pts)+16,max(p.y for p in pts)+16)
qr=im.crop(bounds)
qr.save("artifacts/parfums/public/images/referral-qr.png")
assert zxingcpp.read_barcodes(qr)[0].text==result.text
print(f"{len(verified)} références vérifiées, {len(pending)} en attente, QR original extrait et décodé.")
