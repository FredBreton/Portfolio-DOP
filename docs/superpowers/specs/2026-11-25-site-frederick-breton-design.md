# Nouveau site de Frédérick Breton

Plan du site, approuvé par Alexis le 25 novembre 2026.

## 1. But

Remplacer https://frederickbreton.com par un site moderne et sérieux, que Frédérick modifie seul.

Le site parle à deux publics :

| Public | Ce qu'il achète | Où il le trouve |
|---|---|---|
| Réalisateurs et producteurs | Direction photo, en fiction et en documentaire | Accueil et pages de projet |
| Entreprises | Vidéo clé en main : idée, tournage, montage | Création vidéo |

Aucun projet d'entreprise n'apparaît sur l'accueil.

**Réussi si :**
- on comprend en quelques secondes ce que fait Frédérick;
- chaque public atteint le bon contenu en un clic;
- Frédérick ajoute un projet, change la vidéo d'accueil et modifie une page sans aide;
- un message du formulaire n'est jamais perdu, même si le courriel échoue.

## 2. Style

- Fond noir, peu de texte, images et vidéos en premier.
- Contenu encadré de marges. Jamais sur toute la largeur de l'écran.
- Les images de films gardent leur cadrage d'origine dans la page du projet.
- Références : Philippe Goulet (simplicité, carrousels), Adolpho Veloso (images encadrées), Y-US (argument « cinéma » pour les entreprises).
- Maquette retenue : `.superpowers/brainstorm/1421-1795640767/content/accueil-video-rangees.html`, option A1.

## 3. Pages

**Menu :** Projets · Création vidéo (quand elle est visible) · À propos · Contact · FR/EN

### Accueil
1. Nom, métier et menu.
2. Vidéo muette en boucle, encadrée, avec bouton Pause et bouton « Voir le démo ».
3. Un carrousel de cartes par catégorie. Au départ : Fiction, puis Documentaire.
4. Bouton « Me contacter » et réseaux sociaux.

« Projets », dans le menu, mène aux carrousels. Pas de page Projets séparée au départ : avec 7 projets, elle répéterait l'accueil. Approuvé le 25 novembre 2026.

### Page d'un projet
Vidéo ou bande-annonce s'il y en a une, carrousel d'images, réalisation, production, année, rôle de Frédérick, prix et festivals, lien externe, projet suivant. Une information vide ne s'affiche pas.

### Création vidéo
Accroche, démo, services, mandats, témoignages, logos de clients, bouton « Parler de votre projet ». Cachée au lancement tant qu'il n'y a pas au moins deux vidéos d'entreprise. Une fois la case cochée, le lien apparaît dans le menu.

### À propos
Portrait, courte bio, festivals et prix.

### Contact
Formulaire : nom, courriel, type de projet (fiction/documentaire ou création vidéo), message. Courriel et réseaux sociaux à côté. Le bouton de Création vidéo choisit d'avance le bon type.

### Confidentialité
Page courte, puisque le formulaire recueille des renseignements personnels. Texte à faire valider par Frédérick.

## 4. Ce que Frédérick gère dans Payload

- **Projets :** textes, images, vidéo, crédits, catégorie, ordre, présence sur l'accueil, brouillon ou publié.
- **Catégories :** ajouter, renommer, réordonner. Un carrousel vide ne s'affiche pas.
- **Pages :** accueil, Création vidéo, À propos et pages libres.
- **Blocs :** texte, image et texte, vidéo, carrousel d'images, grille de projets, services, témoignages, logos, bouton de contact.
- **Réglages :** menu, réseaux sociaux, courriel, vidéo d'accueil, titre et description pour Google.
- **Messages :** liste des messages reçus, lus ou non lus.
- **Aperçu** avant de publier.

Les blocs sont communs aux deux langues; seuls leurs textes se traduisent. Un texte non traduit s'affiche en français. Un nouveau type de bloc demande un programmeur.

## 5. Technique

- Nouveau projet séparé : Next.js, Payload 3 et PostgreSQL. Versions compatibles à vérifier au moment de l'installation.
- Français à la racine (`/a-propos`), anglais sous `/en`.
- **Repris de Propulse-toi, en version simplifiée :** langues, formulaire et sa protection, messages et suivi d'envoi, médias, pages libres, blocs texte, image et texte, vidéo, galerie, logos, témoignages et contact.
- **Pas repris :** assistant IA, transfert d'environnement, tarifs, équipe, jeux et effets 3D.
- **Utilisé tel quel dans Payload :** brouillons, aperçu et ordre par glisser-déposer.
- **Images et vidéo d'accueil :** stockage compatible S3, indépendant de Vercel. Cloudflare R2 d'abord (10 Go gratuits, pas de frais de sortie). Les fichiers partent directement du navigateur, car un envoi par Vercel est limité à 4,5 Mo. À vérifier : R2 exige-t-il une carte de paiement?
- **Base de données :** Neon gratuit (1 Go, se met en veille après 5 minutes).
- **Démos et bandes-annonces :** Vimeo ou YouTube, chargés au clic seulement.
- **Vidéo d'accueil :** MP4 H.264, 10 à 20 s, sans son, 5 Mo ou moins, avec image de remplacement. Elle ne démarre pas seule si la personne a réduit les animations.

## 6. Sécurité et pannes

| Situation | Comportement |
|---|---|
| Courriel non envoyé | Le message reste dans Payload, avec l'erreur notée |
| Pourriel | Champ piège, limite d'envois et Turnstile |
| Vidéo Vimeo retirée ou privée | Image du projet et lien externe |
| Vidéo d'accueil en panne | Image de remplacement |
| Page ou projet en brouillon | Invisible au public et dans Google |
| Accès à Payload | Comptes seulement, pas d'inscription publique |

## 7. Contenu

**Repris du site actuel :** 7 projets avec leurs réalisateurs et leurs images, démo 2023 en attendant, courriel et Instagram.

| Projet | Réalisation | Catégorie |
|---|---|---|
| Herby | Antoine Bergevin-Richer | Documentaire |
| Au pied du mur | Alexandra Elkin | Documentaire |
| Dans mes élans de grande obsédée | Alicia Lemieux | Fiction |
| Nucléaire | Philippe Goulet | Fiction |
| Mes visions de chat | Philippe Goulet | Fiction |
| Gro$ lot | Sharbel El-Showairy | Fiction |
| Shattered | Philippe Boissier | Fiction |

**À fournir par Frédérick :**
- nouveau démo (60 à 90 s) et boucle d'accueil;
- 5 à 10 images par projet, en pleine qualité, avec le droit de les montrer;
- crédits, années, prix et festivals;
- portrait et bio;
- vidéos d'entreprise, clients et témoignages, quand il les aura;
- textes anglais, ou relecture d'une traduction proposée;
- courriel qui reçoit les messages.

## 8. Hébergement et lancement

1. Construire et tester sur le compte Vercel de Frédérick, sans annoncer le site ni brancher le domaine. Les moteurs de recherche sont bloqués pendant ce temps.
2. Avant le lancement, choisir entre Vercel payant, Netlify gratuit (à tester) et Sicay (si l'hébergeur accepte Node.js et PostgreSQL). Le forfait gratuit de Vercel est réservé à un usage personnel ou non commercial.
3. Rediriger `/fiction/` et `/portfolio/` vers les carrousels. Garder `/contact`.
4. Brancher le domaine en conservant les réglages de courriel chez Sicay.
5. Garder une copie de l'ancien site et un retour arrière possible.
6. Former Frédérick et lui laisser un petit guide.

Tous les comptes sont au nom de Frédérick. Frédérick crée les mots de passe et entre les paiements.

## 9. Vérifications avant le lancement

- Formulaire : envoi réussi, courriel en panne, pourriel, champs vides. Tests automatiques.
- Brouillons invisibles et accès protégés. Tests automatiques.
- Les deux langues, y compris un texte non traduit.
- Téléphone, tablette et ordinateur; Chrome, Safari et Firefox.
- Navigation au clavier, textes alternatifs et lisibilité.
- Envoi d'une image de plus de 4,5 Mo.
- Frédérick ajoute seul un projet, change la vidéo et modifie une page.

## 10. Laissé de côté

Boutique, blogue, espace client, assistant IA, page Projets séparée et deuxième site pour les entreprises.
