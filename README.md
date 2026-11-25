# Site de Frédérick Breton

Next.js 16, Payload 3 et PostgreSQL. Plan : `docs/superpowers/specs/`. Guide d'utilisation : `docs/guide-frederick.md`.

## Sur ce poste

1. Ouvrir Docker Desktop.
2. Copier `.env.example` vers `.env` et remplir `PAYLOAD_SECRET`.
3. Lancer :

```powershell
npm install
npm run db
npm run migrate
npm run seed
npm run dev
```

Site : http://localhost:3010. Administration : http://localhost:3010/admin. Le compte de test local est dans `.env`.

`npm run seed` a besoin de `seed-media/`, gardé hors de GitHub, et ne touche pas une base qui contient déjà des projets.

Tests : `npm test` (base séparée `fred_test`, à créer une fois avec `docker compose exec db createdb -U fred fred_test`).

Après un changement de champ dans Payload : `npm run generate`, puis `npm run migrate:create nom`.

## Mise en ligne de test (Vercel)

Frédérick crée les comptes et entre lui-même les mots de passe et les clés.

1. **Neon :** créer une base et copier son adresse dans `DATABASE_URL`.
2. **Cloudflare R2 :** créer un bucket, activer son adresse publique, créer une clé limitée à ce bucket. Autoriser dans les règles CORS l'adresse du site, la méthode `PUT` et les en-têtes `Content-Type` et `If-None-Match`.
3. **Vercel :** importer le dépôt, choisir la branche, commande de build `npm run ci`, Node 24, puis entrer les variables de `.env.example`. `PAYLOAD_SECRET` doit être nouveau et `SITE_INDEXABLE` rester à `false`.
4. Ouvrir `/admin` **tout de suite** et créer le compte de Frédérick : tant qu'aucun compte n'existe, le premier visiteur pourrait le faire.
5. Importer le contenu de départ depuis ce poste, avec un fichier `.env` temporaire qui pointe vers Neon et R2, et les deux lignes `SEED_ADMIN_` vides. Remettre ensuite le `.env` local.
6. Vérifier le formulaire, une image de plus de 4,5 Mo et l'aperçu.

Deux points à surveiller : le forfait gratuit de Vercel est réservé à un usage personnel ou non commercial, et il peut refuser les mises en ligne faites par une autre personne que Frédérick sur un dépôt privé.

## Lancement

1. Choisir l'hébergement final.
2. Mettre `SITE_URL` à l'adresse finale et `SITE_INDEXABLE` à `true`.
3. Configurer `SMTP_*` et Turnstile, puis envoyer un message d'essai.
4. Sauvegarder l'ancien WordPress.
5. Changer seulement les adresses web du domaine chez Sicay (A et `www`). Ne pas toucher aux enregistrements de courriel (MX, SPF, DKIM). Attention : le MX pointe vers `frederickbreton.com` lui-même. Changer l'adresse A déplacerait donc aussi le courriel du domaine; s'il sert, demander à Sicay de pointer le MX vers un autre nom d'abord.
6. Vérifier `/fiction/`, `/portfolio/` et `/contact/`.
