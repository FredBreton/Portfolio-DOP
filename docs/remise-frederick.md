# Ton site : où se trouve chaque morceau

Frédérick, ce document te dit où vit ton site, à qui appartient chaque partie et quoi faire en premier. Tous les comptes sont à ton nom : tu es le propriétaire. Aucun mot de passe n'est écrit ici, et ne mets jamais de mot de passe dans ce document.

Pour modifier le contenu au quotidien (projets, textes, vidéos), voir le [guide d'utilisation](guide-frederick.md).

## Les adresses

| Quoi | Adresse |
| --- | --- |
| Le site (test, caché de Google) | https://frederick-breton.vercel.app |
| L'administration (Payload) | https://frederick-breton.vercel.app/admin |
| Le site final, au lancement | https://frederickbreton.com |

## Les morceaux du site

| Morceau | Rôle | Service | Compte | Coût actuel |
| --- | --- | --- | --- | --- |
| Le code | Les pages, le design, les fonctions | GitHub : https://github.com/FredBreton/Portfolio-DOP | Toi (FredBreton). Alexis y collabore. | Gratuit |
| L'hébergement | Fait tourner le site | Vercel : https://vercel.com/frederick-breton/frederick-breton | Toi (fredbreton1354) | Gratuit (forfait Hobby) |
| La base de données | Les textes, projets, messages reçus | Neon, ouvert depuis Vercel : projet, puis Storage, puis Open in Neon | Toi, par Vercel | Gratuit |
| Les images et vidéos | Les fichiers envoyés dans l'admin | Cloudflare R2, espace `frederick-breton-media` : https://dash.cloudflare.com | Toi | Gratuit jusqu'à 10 Go, puis environ 0,015 $ US par Go par mois |
| Le nom de domaine | frederickbreton.com et tes courriels du domaine | Sicay (sicay.net), ton fournisseur actuel | Toi | Ton abonnement actuel |

Le dépôt GitHub est public : tout le monde peut lire le code, mais pas tes données ni tes clés, qui restent dans Vercel.

## À faire la première fois

1. **Activer la double vérification** (code par téléphone) sur GitHub, Vercel et Cloudflare. C'est la meilleure protection de ton site.
2. **Ton compte Payload :** quand l'envoi de courriels du site sera branché, Alexis te crée un compte et tu choisis ton mot de passe avec « Mot de passe oublié ». Sinon, il te donne un mot de passe temporaire, à changer dans ton profil (en bas à gauche de l'admin) dès ta première connexion.
3. **Vérifier qui a accès :**
   - Payload : menu Utilisateurs. Chaque personne a son propre compte.
   - GitHub : dépôt, puis Settings, puis Collaborators.
   - Vercel : l'ordinateur d'Alexis peut mettre le site en ligne avec ton compte. Pour retirer cet accès un jour : Vercel, Account Settings, puis Tokens, puis supprimer le jeton de l'outil Vercel CLI.

## Comment le site se met à jour

- **Tes modifications dans Payload** apparaissent sur le site tout de suite, sans rien d'autre à faire.
- **Les changements de code** (design, nouvelles fonctions) passent par GitHub. Chaque envoi sur la branche `main` met le site en ligne automatiquement dans Vercel. La branche `construction` sert aux travaux en cours.
- **Si une mise en ligne casse quelque chose :** Vercel, projet, onglet Deployments. Sur une version précédente qui marchait, clique sur **⋯** puis **Promote to Production** pour revenir en arrière en une minute.

## Réglages secrets (dans Vercel)

Ils se trouvent dans Vercel, projet, Settings, Environment Variables. Ce sont des clés : on ne les copie nulle part ailleurs.

| Nom | Sert à |
| --- | --- |
| `DATABASE_URL` | Relier le site à la base Neon (créé par Neon) |
| `PAYLOAD_SECRET` | Protéger les connexions à l'admin |
| `SITE_URL`, `SITE_INDEXABLE` | L'adresse du site; `false` cache le site de Google jusqu'au lancement |
| `S3_…` | Relier le site au stockage des images (R2). Les deux clés viennent d'un jeton Cloudflare nommé `site-frederick-breton`, limité à l'espace `frederick-breton-media` |
| `SMTP_…` | Envoyer les messages du formulaire dans ta boîte courriel, par Brevo. `SMTP_PASSWORD` est une clé Brevo nommée `site-frederick-breton` |

## Le stockage des images (Cloudflare R2)

- Les images et vidéos envoyées dans l'admin vont dans l'espace `frederick-breton-media`. Elles sont servies par une adresse publique en `.r2.dev`.
- Dans l'espace, onglet Settings, la règle **CORS** autorise seulement l'adresse du site, écrite sans `/` à la fin. Au lancement, ajoute `https://frederickbreton.com` à cette règle, sinon les envois d'images échoueront.
- Si une clé fuit : Cloudflare, R2, Manage API tokens, supprime le jeton, crée-en un nouveau avec les mêmes réglages, puis remplace les deux clés `S3_ACCESS_KEY_ID` et `S3_SECRET_ACCESS_KEY` dans Vercel et refais une mise en ligne.

## Les courriels du formulaire (Brevo)

- Les messages du formulaire partent par Brevo (https://app.brevo.com, gratuit jusqu'à 300 courriels par jour), depuis ton Gmail, vers l'adresse choisie dans Réglages de l'admin.
- Chaque message est aussi gardé dans l'admin, menu **Messages**, même si le courriel n'est pas parti.
- **La clé expire** à sa date de fin, ou après 90 jours sans aucun envoi. Si les courriels n'arrivent plus : Brevo, Settings, SMTP & API, onglet SMTP, **Generate a new SMTP key**, puis remplace `SMTP_PASSWORD` dans Vercel et refais une mise en ligne (Deployments, ⋯, Redeploy).
- Au lancement, authentifie le domaine dans Brevo (4 lignes à ajouter chez Sicay) et passe à une adresse du domaine, pour éviter les indésirables.

## Avant le lancement

- Choisir l'hébergement final. Le forfait gratuit de Vercel est réservé à un usage non commercial; un site qui vend des services devrait passer à Vercel Pro (environ 20 $ US par mois) ou aller ailleurs.
- Brancher la protection anti-robots du formulaire.
- Relier frederickbreton.com au nouveau site chez Sicay. Attention : tes courriels du domaine dépendent du même réglage, à vérifier avec Sicay avant.
- Mettre `SITE_INDEXABLE` à `true` pour que Google trouve le site.
