
# QuestLoop — Social × Game (Full‑Stack)

An innovative, addictive social network fused with a game layer: post, like, comment and **level up**. Form streaks, earn XP, unlock cosmetic badges, and climb the leaderboard.

## One‑command local run (Docker)
```bash
# 1) Copy .env.example to .env in /api and /web (optional for custom values)
# 2) Start everything:
docker compose up --build
```
Services:
- **web** — Next.js 14 UI on http://localhost:3000
- **api** — Express/TypeScript REST + WebSocket on http://localhost:4000
- **db** — Postgres 16
- **redis** — Redis 7 for sessions/rate limit/queues
- **mailpit** — Dev SMTP inbox: http://localhost:8025 (emails appear here)

> Production: set real SMTP creds in `/api/.env` and a real JWT secret. Switch Prisma to managed Postgres if you want.

## Core features implemented
- Create account with email **verification code**
- Login with JWT (HTTP‑only cookie)
- Create/read posts, like/unlike, comment
- Real‑time like count via WebSocket
- XP system: actions grant XP, auto **leveling**
- Profile page with avatar, banner, bio, XP/Level, badges
- Leaderboard (top XP in last 30 days)
- Beautiful UI with Tailwind + shadcn/ui
- Input validation (zod), rate limiting, basic security headers

## Default dev credentials
Check **Mailpit** at http://localhost:8025 for the verification code after sign‑up.

## Scripts (inside containers)
```bash
# API
npm run prisma:push   # updates schema to DB
npm run seed         # seeds demo data

# Web
npm run dev          # local dev (outside docker)
```

## Tech
- Next.js 14 (App Router) + React + Tailwind + shadcn/ui
- Express + TypeScript + Prisma (Postgres) + zod
- Nodemailer (SMTP) + Mailpit (dev)
- Socket.IO (real‑time)
- Redis (rate limiting, sessions)


## New Pro features
- **Guilds/Teams**: create & join teams.
- **Seasons**: create seasons, track seasonal XP.
- **Achievements/Badges**: automatic unlock at XP milestones (100/500/1000).
- **Uploads (S3/R2)**: presigned upload for avatar & banner, apply instantly.
- **2FA (TOTP)**: enable authenticator apps (QR/otpauth).
- **Moderation**: basic heuristic toxicity filter for posts.
- **Push Notifications**: Web Push with VAPID; subscribe from /notifications and send test.
- **UI+Motion**: Framer Motion animations & theme switcher (pastel, midnight, ocean).

### Configure S3/R2 & VAPID
- Set `S3_*` env vars in `api/.env` for your bucket.
- Generate VAPID keys (one-time):
```bash
node -e "console.log(require('web-push').generateVAPIDKeys())"
```
Put `publicKey`/`privateKey` into `.env` as `VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY`.

### Prisma migrate
The docker command already deploys migrations. If you run locally:
```bash
npm run prisma:push
npm run seed
```


## One‑Click VPS Deployment
1. **Achetez un VPS Ubuntu** (ex: Hetzner, OVH, Scaleway) et notez son IP.
2. **Pointez votre domaine** : créez 2 enregistrements A → IP du VPS : `@` et `api`.
3. Sur le VPS, placez ce dossier et exportez 2 variables :
```bash
export DOMAIN=mondomaine.com
export ACME_EMAIL=vous@exemple.com
```
4. Lancez le script :
```bash
./infra/deploy.sh
```
- **Caddy** génère automatiquement les certificats HTTPS pour `https://mondomaine.com` et `https://api.mondomaine.com`.
- L’**admin est auto-créé** si `ADMIN_*` est dans `api/.env` (voir `api/.env.example`).

### Compte Admin par défaut
- **Username**: AdminMaster
- **Email**: admin@YOUR_DOMAIN
- **Mot de passe**: SetAReallyStrongPassword123!  (à changer immédiatement dans .env avant déploiement)

### Uploads R2
Renseignez `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET` dans `api/.env`.
Pour Cloudflare R2, l’endpoint ressemble à: `https://<accountid>.r2.cloudflarestorage.com`.
