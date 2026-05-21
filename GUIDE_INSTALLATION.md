# Guide d'installation — CesiZen

**Version :** 1.0  
**Date :** 2026-05-21  
**Stack :** Next.js 15 · TypeScript · PostgreSQL · Prisma · Better Auth · tRPC  

---

## Prérequis

| Outil | Version minimale | Vérification |
|-------|-----------------|-------------|
| **Node.js** | 20.x LTS | `node --version` |
| **npm** | 10.x | `npm --version` |
| **Git** | 2.x | `git --version` |
| **PostgreSQL** | 15+ | `psql --version` |

> **Alternative à PostgreSQL local :** un service cloud PostgreSQL (Neon, Supabase, Railway) suffit — seule une `DATABASE_URL` valide est requise.

---

## 1. Récupérer le code source

```bash
git clone https://github.com/<organisation>/cesi-zen.git
cd cesi-zen
```

---

## 2. Installer les dépendances

```bash
npm install
```

Cette commande installe les dépendances Node.js et exécute automatiquement `prisma generate` (génération du client Prisma).

---

## 3. Configurer les variables d'environnement

Copier le fichier d'exemple et le remplir :

```bash
cp .env.example .env
```

Ouvrir `.env` et renseigner chaque variable :

```env
# ── Base de données ──────────────────────────────────────────────────────────
# URL de connexion PostgreSQL (avec pooler si Neon/Supabase)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

# URL directe (sans pooler) — utilisée par Prisma pour les migrations
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

# ── Better Auth ──────────────────────────────────────────────────────────────
# URL publique de l'application
BETTER_AUTH_URL="http://localhost:3000"

# Clé secrète (générer avec : openssl rand -base64 32)
BETTER_AUTH_SECRET="GENERER_UNE_VALEUR_ALEATOIRE_ICI"

# OAuth GitHub (voir section 3.1)
BETTER_AUTH_GITHUB_CLIENT_ID="VOTRE_GITHUB_CLIENT_ID"
BETTER_AUTH_GITHUB_CLIENT_SECRET="VOTRE_GITHUB_CLIENT_SECRET"
```

### 3.1 Créer une application GitHub OAuth

1. Aller sur [github.com/settings/developers](https://github.com/settings/developers)
2. Cliquer sur **New OAuth App**
3. Renseigner :
   - **Application name** : `CesiZen (dev)` 
   - **Homepage URL** : `http://localhost:3000`
   - **Authorization callback URL** : `http://localhost:3000/api/auth/callback/github`
4. Cliquer sur **Register application**
5. Copier le **Client ID** → `BETTER_AUTH_GITHUB_CLIENT_ID`
6. Générer un **Client Secret** → `BETTER_AUTH_GITHUB_CLIENT_SECRET`

> En production, remplacer `localhost:3000` par le domaine de production dans les URLs.

### 3.2 Générer la clé secrète Better Auth

```bash
openssl rand -base64 32
```

Copier la valeur obtenue dans `BETTER_AUTH_SECRET`.

---

## 4. Initialiser la base de données

### 4.1 Appliquer les migrations

```bash
npm run db:migrate
```

Cette commande applique toutes les migrations Prisma existantes et crée le schéma complet en base.

> En développement, utiliser `npm run db:generate` pour créer une nouvelle migration après modification du schéma.

### 4.2 Charger les données initiales (seed)

Le seed crée les exercices presets et des contenus d'exemple. **Un compte ADMIN doit exister en base avant d'exécuter le seed.**

**Étape 1 — Créer un compte admin :**

Démarrer l'application (`npm run dev`) puis créer un compte via le formulaire d'inscription. Ensuite, passer ce compte en ADMIN directement en base :

```bash
# Ouvrir Prisma Studio pour modifier le rôle manuellement
npm run db:studio
```

Dans Prisma Studio : table `user` → trouver le compte → changer `role` de `USER` à `ADMIN`.

**Étape 2 — Exécuter le seed :**

```bash
npm run db:seed
```

Le seed insère :
- 3 exercices presets (5-0-5, 7-4-8, 4-0-6)
- Des contenus d'exemple liés au compte ADMIN

---

## 5. Lancer l'application

### Mode développement

```bash
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

> Le mode développement active Turbopack (--turbo) et désactive le service worker PWA.

### Vérification de l'installation

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Page d'accueil |
| `http://localhost:3000/login` | Page de connexion |
| `http://localhost:3000/exercice` | Exercices (presets visibles si seed effectué) |
| `http://localhost:3000/admin` | Back-office (ADMIN requis) |

---

## 6. Lancer les tests

```bash
# Tests unitaires et composants (Vitest)
npm run test:run

# Tests fonctionnels E2E (Playwright) — première utilisation
npm run test:e2e:install
npm run test:e2e

# Interface visuelle Playwright
npm run test:e2e:ui

# Rapport de couverture
npm run test:coverage
```

> Les tests E2E nécessitent que l'application tourne sur `http://localhost:3000` ou démarrent automatiquement le serveur de développement.

Pour les tests E2E de l'espace admin, définir les variables d'environnement :

```bash
ADMIN_EMAIL="admin@test.com" ADMIN_PASSWORD="motdepasse" npm run test:e2e
```

---

## 7. Build de production

```bash
# Construire l'application
npm run build

# Démarrer le serveur de production
npm run start
```

> En production, s'assurer que `BETTER_AUTH_URL` pointe vers le domaine public et que `NODE_ENV=production` est défini.

### Vérifications avant déploiement

```bash
# Vérification TypeScript et ESLint
npm run check

# Tests de non-régression
npm run test:run
```

---

## 8. Structure des variables d'environnement

Créer le fichier `.env.example` à la racine (ne pas versionner `.env`) :

```env
# Base de données
DATABASE_URL=""
DIRECT_URL=""

# Better Auth
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET=""
BETTER_AUTH_GITHUB_CLIENT_ID=""
BETTER_AUTH_GITHUB_CLIENT_SECRET=""
```

> **Ne jamais commiter `.env`**. Il est listé dans `.gitignore` par défaut.

---

## 9. Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement (Turbopack) |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run check` | Lint + vérification TypeScript |
| `npm run db:generate` | Créer une migration Prisma |
| `npm run db:migrate` | Appliquer les migrations |
| `npm run db:push` | Pousser le schéma sans migration (dev rapide) |
| `npm run db:seed` | Charger les données initiales |
| `npm run db:studio` | Interface graphique Prisma Studio |
| `npm run test` | Tests unitaires en mode watch |
| `npm run test:run` | Tests unitaires (CI) |
| `npm run test:coverage` | Rapport de couverture |
| `npm run test:e2e` | Tests E2E Playwright |
| `npm run test:e2e:ui` | Interface visuelle Playwright |
| `npm run format:write` | Formatter le code (Prettier) |

---

## 10. Résolution des problèmes courants

### `DATABASE_URL` invalide au démarrage

```
Error: Environment variable not found: DATABASE_URL
```
→ Vérifier que le fichier `.env` existe à la racine et que la variable est renseignée.

---

### Erreur de connexion PostgreSQL

```
Error: P1001: Can't reach database server
```
→ Vérifier que le serveur PostgreSQL est démarré et accessible. Tester avec `psql $DATABASE_URL`.

---

### `BETTER_AUTH_GITHUB_CLIENT_ID` manquant

```
ZodError: BETTER_AUTH_GITHUB_CLIENT_ID: Required
```
→ Créer une application GitHub OAuth (section 3.1) et renseigner les variables.

---

### Prisma : client non généré

```
Error: @prisma/client did not initialize yet
```
→ Exécuter `npm install` ou `npx prisma generate`.

---

### Port 3000 déjà occupé

```bash
# Trouver et arrêter le processus
lsof -ti:3000 | xargs kill -9

# Ou lancer sur un autre port
PORT=3001 npm run dev
```

---

### Cache Next.js corrompu (erreurs d'hydratation inattendues)

```bash
rm -rf .next
npm run dev
```

---

## 11. Déploiement (exemple Vercel)

1. Pousser le code sur GitHub
2. Importer le dépôt sur [vercel.com](https://vercel.com)
3. Définir les variables d'environnement dans les paramètres Vercel (identiques à `.env`, avec l'URL de production)
4. Mettre à jour `BETTER_AUTH_URL` avec le domaine Vercel
5. Mettre à jour le callback GitHub OAuth avec le domaine Vercel
6. Le build et le déploiement sont automatiques à chaque push sur `main`

> Vercel exécute automatiquement `npm run build` qui inclut `prisma generate` via le script `postinstall`.
