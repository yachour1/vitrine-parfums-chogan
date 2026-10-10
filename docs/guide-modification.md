# Guide de modification — Sélection Parfums

## Produits

Modifier `artifacts/parfums/src/data/products.json`. Une référence correspond à une seule entrée. Conserver les codes entre guillemets, notamment `"001"`, `"148W"` et `"155U"`.

Champs : `reference`, `referenceName` (nom d’inspiration), `referenceBrand`, `categories`, `families` (rubriques de la brochure), `collection`, `image`, `sourcePages` et `verificationStatus`.

Seules les entrées `"verificationStatus": "verified"` apparaissent. Les 14 références en attente sont dans `docs/references-a-confirmer.json`. Valider leurs informations avant de les ajouter au catalogue. Ne pas remplacer les données manuellement éditées en relançant le script de transcription sans mettre à jour sa source.

Catégories disponibles : Pour elle, Pour lui, Mixte. Une fiche peut en avoir plusieurs. Collection Luxe : écrire exactement `"Luxe / Luxury"`, sinon `null`.

Les listes de filtres se trouvent dans `src/lib/catalog.ts`. Les images doivent être placées dans `public/images`. `image: null` signifie qu’aucune photo individuelle vérifiée n’est disponible ; les cartes et fiches utilisent alors uniquement la référence typographique, sans flacon générique de substitution.

Les nouveaux visuels approuvés sont `hero-ambiance.webp` (accueil), `transition-florale.webp` (avant le catalogue), `luxe-collection-doree.webp` (illustration de collection Luxe) et `logo-chogan.webp` (près du bouton boutique final). Aucun n’est associé à une référence produit. Les autres fichiers reçus restent inutilisés.

## Titre, lien et informations légales

Modifier `artifacts/parfums/src/config/site.ts` :

- `title` : titre provisoire du site.
- `referralUrl` : destination centralisée de tous les liens boutique.
- `legalText` : vraies informations de l’éditeur, à compléter avant publication.

Le QR original correspond au lien actuel. Si le lien change, remplacer aussi `public/images/referral-qr.png` par un QR réellement généré depuis la nouvelle URL et vérifier sa destination au scan. Ne pas conserver l’ancien QR.

Le titre et les métadonnées de partage se modifient également dans `artifacts/parfums/index.html`. Avant publication, renseigner l’adresse publique réelle pour l’aperçu social ; ne pas utiliser une adresse de développement comme adresse définitive.

## Couleurs et typographies

Les styles sont dans `artifacts/parfums/src/index.css`. Les variables du bloc `:root` contrôlent les couleurs principales : `--background` pour l’ivoire, `--foreground` pour le noir doux, `--primary` et `--accent` pour les accents. Les couleurs sont exprimées en HSL. Les styles éditoriaux figurent plus bas dans le même fichier.

Les polices actuelles sont Cormorant Garamond et Jost, chargées depuis Google Fonts. Aucune mesure d’audience ni aucun cookie marketing n’est ajouté.

## Animations et sections

Animations : `src/lib/motion.ts` et règles de mouvement réduit dans `src/index.css`. Le contenu principal est dans `src/pages/home.tsx` ; catalogue, fiches, navigation et liens boutique sont séparés dans `src/components/site`.

Préserver les contrôles clavier, les zones tactiles, les contrastes et le respect de `prefers-reduced-motion` lors des modifications.

## Vérifications réalisées

- 24 pages de brochure examinées visuellement et 116 références distinctes retenues.
- QR original décodé, extrait puis redécodé : destination exacte confirmée.
- Compilation de production réussie et contrôle TypeScript réussi.
- Aperçus d’accueil observés sur ordinateur (1280 × 720) et mobile (390 × 844).
- Aucun message d’erreur dans la console de ces aperçus.

Après correction des images, un contrôle au navigateur a confirmé : recherche `007`, filtres combinés Pour elle + Floraux (30 résultats), réinitialisation (116 références), chargement de 12 à 24 cartes, ouverture des fiches 093 et 007 sans flacon générique, fermeture par Échap et bouton, navigation mobile à 390 × 844, absence de débordement horizontal sur mobile et ordinateur, chargement des 15 images, et URL/attributs des liens boutique. La préférence de mouvement réduit a également été vérifiée.

Le catalogue, la configuration du parrainage et le fichier QR ont conservé leurs empreintes de contrôle avant/après modification. La compilation et le contrôle TypeScript réussissent.

La boutique externe n’a pas été ouverte et aucun achat n’a été effectué. Ce contrôle ciblé ne couvre pas chaque référence, tous les navigateurs, la récupération après erreur d’image ni un audit exhaustif du focus clavier.

## Avant mise en ligne

Compléter les informations légales, vérifier les droits d’usage des visuels et valider les références en attente si vous souhaitez les inclure. Le site n’est pas publié. Toute publication ou activation d’un service payant nécessite votre accord préalable.

## Classification prioritaire et validation

Le tableau WhatsApp du 2 octobre 2026 est désormais prioritaire pour les familles et catégories des codes exactement correspondants. Il ne valide ni noms, ni marques, ni photos, ni prix. Les cinq filtres sont Floraux, Fruités, Hespéridés, Boisés et Orientaux / Ambrés.

La validation reçue autorise uniquement les classifications, sans ajout public : 116 fiches restent visibles et 14 restent en attente. Les codes 79/079 et ceux avec/sans suffixe ne sont pas fusionnés. Le champ `classificationSource` indique la nouvelle source ; son absence signale les références conservées depuis la brochure.

La recherche numérique accepte 7 et 007 comme équivalents, mais ne transforme pas 155 en 155U. Les références affichées ne changent pas.

## Mentions légales — informations à réunir, non affichées sur le site

La présentation est personnelle, sans société revendiquée ni qualité de représentant officiel. La phrase provisoire « Informations légales de l’éditeur à compléter avant publication » est conservée ici comme rappel, et non publiée comme contenu légal.

Le pays indiqué est la France. Ne pas déduire du fait de ne pas avoir de société que le site ou l’activité est nécessairement non professionnel. Cette note est une liste de préparation, pas une validation juridique.

À préciser avant de rédiger les mentions réelles :

- Nature de l’activité et du lien avec Chogan : simple recommandation personnelle, rémunération/commissions, contrat de vendeur indépendant ou autre situation réelle. Ne pas supposer de statut.
- Identité de l’éditeur et responsable de publication, ainsi qu’un moyen de contact public validé.
- Selon la situation réelle : coordonnées et mentions d’identification applicables, à vérifier avant de demander ou publier une adresse privée. Aucun numéro d’immatriculation ne doit être inventé.
- Identité et coordonnées légales de l’hébergeur à vérifier dans les documents officiels lors de la préparation de la publication.
- Informations de confidentialité adaptées aux traitements réels, dont hébergement et chargement de polices externes ; absence de formulaire ne signifie pas nécessairement absence de traitement technique.

Référence consultée : https://entreprendre.service-public.gouv.fr/vosdroits/F31228 (mentions d’un entrepreneur individuel, à utiliser uniquement si cette situation est applicable). Les obligations exactes doivent être déterminées à partir de la situation réelle, au besoin avec un professionnel compétent.

Le guide est un fichier de travail hors du site public ; il reste accessible aux personnes ayant accès au projet Replit. Ne pas y stocker de renseignements privés inutiles.
