# CesiZen

Application web de santé mentale développée dans le cadre d'un projet pédagogique CESI.  
Elle propose des contenus bien-être (articles, documents) et des exercices de cohérence cardiaque guidés.

**Stack :** Next.js 15 · TypeScript · PostgreSQL · Prisma · Better Auth · tRPC · Tailwind CSS · DaisyUI

---

## Prérequis

| Outil | Version |
|-------|---------|
| Node.js | 20.x LTS |
| npm | 10.x |
| PostgreSQL | 15+ (ou service cloud : Neon, Supabase…) |

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/<organisation>/cesi-zen.git
cd cesi-zen
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Renseigner `.env` :

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET=""                    # openssl rand -base64 32
BETTER_AUTH_GITHUB_CLIENT_ID=""          # github.com/settings/developers
BETTER_AUTH_GITHUB_CLIENT_SECRET=""
```

> **GitHub OAuth** : créer une application sur [github.com/settings/developers](https://github.com/settings/developers) avec le callback `http://localhost:3000/api/auth/callback/github`.

### 4. Initialiser la base de données

```bash
npm run db:migrate   # Appliquer les migrations
npm run db:seed      # Charger les données initiales (presets + contenus)
```

> Le seed requiert qu'un compte `ADMIN` existe en base. Créer un compte via l'interface, puis le passer en ADMIN avec `npm run db:studio`.

### 5. Lancer l'application

```bash
npm run dev
```

Disponible sur [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run check` | Lint + vérification TypeScript |
| `npm run db:migrate` | Appliquer les migrations Prisma |
| `npm run db:seed` | Charger les données initiales |
| `npm run db:studio` | Interface Prisma Studio |
| `npm run test:run` | Tests unitaires (Vitest) |
| `npm run test:e2e` | Tests fonctionnels (Playwright) |
| `npm run test:coverage` | Rapport de couverture |

---

## Tests

```bash
# Unitaires et composants
npm run test:run

# E2E (Playwright) — installer les navigateurs au premier lancement
npm run test:e2e:install
npm run test:e2e
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [GUIDE_INSTALLATION.md](./GUIDE_INSTALLATION.md) | Guide d'installation complet |
| [MLD.md](./MLD.md) | Modèle Logique de Données |
| [CAHIER_DE_TESTS.md](./CAHIER_DE_TESTS.md) | Cahier de tests (40 scénarios) |
| [PV_RECETTE.md](./PV_RECETTE.md) | Modèle de PV de recette |
| [COMPARATIF_TECHNIQUE.md](./COMPARATIF_TECHNIQUE.md) | Comparatif des 3 solutions techniques (T3 Stack vs MERN vs Laravel+Vue3) |

---

## Déploiement (Vercel)

1. Importer le dépôt sur [vercel.com](https://vercel.com)
2. Définir les variables d'environnement dans les paramètres Vercel
3. Mettre à jour `BETTER_AUTH_URL` et le callback GitHub avec le domaine de production
4. Le déploiement est automatique à chaque push sur `main`
