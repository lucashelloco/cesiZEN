# Cahier Technique — CesiZen

| | |
|---|---|
| **Projet** | CesiZen — Application de bien-être et de santé mentale |
| **Référence** | CT-CESIZEN-v1.0 |
| **Version** | 1.0 |
| **Date** | 2026-06-03 |
| **Rédacteur** | Lucas Helloco — Responsable technique |
| **Destinataire** | Équipe pédagogique CESI |
| **Statut** | Livré |

---

## Table des matières

1. [Contexte et présentation du projet](#1-contexte-et-présentation-du-projet)
2. [Objectifs fonctionnels et périmètre](#2-objectifs-fonctionnels-et-périmètre)
3. [Architecture technique globale](#3-architecture-technique-globale)
4. [Choix de la stack technique](#4-choix-de-la-stack-technique)
5. [Structure du projet](#5-structure-du-projet)
6. [Modèle de données](#6-modèle-de-données)
7. [Architecture API](#7-architecture-api)
8. [Authentification et sécurité](#8-authentification-et-sécurité)
9. [Interface utilisateur et accessibilité](#9-interface-utilisateur-et-accessibilité)
10. [Progressive Web App (PWA)](#10-progressive-web-app-pwa)
11. [Stratégie de tests](#11-stratégie-de-tests)
12. [Déploiement et intégration continue](#12-déploiement-et-intégration-continue)
13. [Variables d'environnement](#13-variables-denvironnement)
14. [Dépendances et licences](#14-dépendances-et-licences)
15. [Glossaire](#15-glossaire)

---

## 1. Contexte et présentation du projet

### 1.1 Contexte général

CesiZen est une application web développée dans le cadre d'une commande destinée à aider les utilisateurs à gérer leur bien-être mental au quotidien. Face à la montée du stress professionnel et de l'anxiété, le projet vise à proposer un outil numérique accessible, simple d'utilisation et respectueux des données personnelles des utilisateurs.

L'application s'adresse à un public large, sans prérequis techniques particuliers. Elle doit être utilisable aussi bien sur ordinateur que sur mobile, y compris en mode hors-ligne limité (PWA).

### 1.2 Présentation de la solution

CesiZen est une application web full-stack dont les fonctionnalités principales sont :

- La consultation d'**articles et documents** relatifs à la santé mentale, au stress et à la pleine conscience
- La pratique d'**exercices de respiration cardiaque** guidés, avec minuterie intégrée et guidage vocal
- La gestion d'un **espace personnel** (profil, configuration d'exercice personnalisée)
- Un **back-office d'administration** permettant la gestion des utilisateurs, des contenus et des exercices

### 1.3 Acteurs du projet

| Acteur | Rôle |
|--------|------|
| **Lucas Helloco** | Développeur full-stack, responsable technique |
| **Utilisateur (USER)** | Personne utilisant l'application publiquement ou après inscription |
| **Administrateur (ADMIN)** | Personne gérant les contenus, les exercices et les comptes utilisateurs |

### 1.4 Contraintes identifiées

| Contrainte | Description |
|-----------|-------------|
| **Données sensibles** | Les données de santé mentale des utilisateurs sont à caractère personnel et doivent être protégées |
| **Accessibilité** | L'application doit être utilisable par des personnes en situation de handicap (RGAA) |
| **Délai** | Projet pédagogique avec un calendrier contraint |
| **Équipe réduite** | Développement assuré par un seul développeur |
| **Déploiement simplifié** | L'hébergement doit être rapide à mettre en place et peu coûteux |

---

## 2. Objectifs fonctionnels et périmètre

### 2.1 Fonctionnalités livrées

#### Module Comptes Utilisateurs

| Fonctionnalité | Description |
|---------------|-------------|
| Inscription | Création de compte via email/mot de passe |
| Connexion | Authentification par email/mot de passe ou via GitHub OAuth |
| Profil | Consultation et modification du nom, email ; suppression du compte |
| Gestion admin | Changement de rôle (USER ↔ ADMIN), activation / désactivation d'un compte |

#### Module Informations

| Fonctionnalité | Description |
|---------------|-------------|
| Consultation | Liste paginée des articles et documents publiés, avec recherche textuelle et tri par date |
| Détail | Affichage du corps du contenu, de l'auteur, de la date et d'une vidéo YouTube optionnelle |
| Lecture vocale | Lecture à voix haute du contenu via Web Speech API |
| Administration | CRUD complet des contenus (créer, modifier, supprimer, publier/dépublier) depuis le back-office |

#### Module Exercice Cardiaque

| Fonctionnalité | Description |
|---------------|-------------|
| Exercices presets | Sélection parmi des exercices de respiration prédéfinis (7-4-8, 5-0-5, 4-0-6) |
| Timer guidé | Animation circulaire avec phases Inspiration / Apnée / Expiration et compteur de cycles |
| Guidage vocal | Annonces vocales des phases via Web Speech API |
| Configuration personnelle | Sauvegarde d'une configuration personnalisée (cycles, durées) pour les utilisateurs connectés |
| Administration | CRUD des exercices presets depuis le back-office |

### 2.2 Fonctionnalités hors périmètre

Les fonctionnalités suivantes ont été délibérément exclues du périmètre de cette version :

- Notifications push (alertes rappel d'exercice)
- Historique des sessions d'exercice
- Forums ou commentaires communautaires
- Export des données personnelles (RGPD, fonctionnellement hors scope)
- Mode hors-ligne complet (PWA partielle, assets mis en cache uniquement)

---

## 3. Architecture technique globale

### 3.1 Vue d'ensemble

CesiZen suit une architecture **full-stack monolithique** hébergée sur Vercel, avec une base de données PostgreSQL hébergée sur Neon.

```
┌────────────────────────────────────────────────────────────┐
│                       CLIENT (Navigateur)                  │
│  React 19 · Next.js 15 App Router · Tailwind CSS · DaisyUI │
│  tRPC Client · React Query (cache client)                   │
└──────────────────────────┬─────────────────────────────────┘
                           │ HTTPS / tRPC (JSON-RPC)
┌──────────────────────────▼─────────────────────────────────┐
│                    SERVEUR (Next.js / Vercel)               │
│  App Router (SSR · RSC) · API Routes · tRPC Server          │
│  Better Auth (sessions) · Prisma ORM                        │
└──────────────────────────┬─────────────────────────────────┘
                           │ TCP / SSL
┌──────────────────────────▼─────────────────────────────────┐
│                  BASE DE DONNÉES (Neon / PostgreSQL 15)     │
│  7 tables · 2 enums · Prisma Migrations                     │
└────────────────────────────────────────────────────────────┘
```

### 3.2 Flux de données typique

1. **Rendu initial (SSR)** : Le navigateur demande une page → Next.js exécute le composant serveur → les données initiales sont chargées depuis PostgreSQL via tRPC server-side caller → le HTML est envoyé hydraté
2. **Interactions client** : React Query déclenche un appel tRPC → l'API route `/api/trpc` traite la procédure → Prisma exécute la requête SQL → la réponse est mise en cache côté client par React Query
3. **Authentification** : Better Auth gère le cycle de vie des sessions (création, validation, expiration) via des cookies HTTP-only

### 3.3 Principes d'architecture

| Principe | Application dans CesiZen |
|----------|--------------------------|
| **Type safety end-to-end** | Les types Prisma alimentent tRPC qui génère les types clients React — aucun contrat d'API à maintenir manuellement |
| **Single source of truth** | Le schéma `prisma/schema.prisma` est la seule définition du modèle de données |
| **Séparation des responsabilités** | Procédures tRPC distinctes selon le niveau d'accès (public / protected / admin) |
| **Monorepo** | Code client, serveur et tests dans un seul dépôt — un seul pipeline CI/CD |

---

## 4. Choix de la stack technique

### 4.1 Résumé de l'étude comparative

Trois solutions ont été évaluées sur 10 critères pondérés (voir `COMPARATIF_TECHNIQUE.md` pour l'analyse complète) :

| Stack | Score pondéré | Résultat |
|-------|:------------:|---------|
| **T3 Stack** (Next.js · tRPC · Prisma) | **126 / 140** | ✅ Retenu |
| Laravel + Vue 3 | 103 / 140 | ❌ Non retenu |
| MERN Stack | 81 / 140 | ❌ Non retenu |

### 4.2 Stack retenue — T3 Stack

| Couche | Technologie | Version | Justification |
|--------|-------------|---------|---------------|
| **Framework full-stack** | Next.js | 15.2.3 | SSR natif, App Router, déploiement Vercel trivial |
| **Langage** | TypeScript | 5.8.2 | Type safety end-to-end, détection d'erreurs à la compilation |
| **Communication client/serveur** | tRPC | 11.0.0 | API type-safe sans génération de code, zéro schema OpenAPI |
| **ORM** | Prisma | 6.6.0 | Migrations versionnées, types générés automatiquement |
| **Base de données** | PostgreSQL | 15+ | Fiabilité, contraintes relationnelles, support Neon |
| **Authentification** | Better Auth | 1.3 | Sessions sécurisées, OAuth2, hachage bcrypt intégré |
| **Validation** | Zod | 3.24.2 | Schémas de validation TypeScript-first, intégration tRPC |
| **Style** | Tailwind CSS | 4.0.15 | Utility-first, responsive design sans CSS custom |
| **Composants UI** | DaisyUI | 5.5.19 | Thèmes (dark/light) prêts à l'emploi, compatibilité Tailwind |
| **Cache client** | React Query | (via tRPC) | Cache automatique des requêtes, invalidation ciblée |
| **PWA** | next-pwa | — | Service worker généré automatiquement en production |
| **Tests unitaires** | Vitest | 4.1.7 | Compatibilité native avec l'écosystème Vite/TypeScript |
| **Tests E2E** | Playwright | 1.60.0 | Multi-navigateurs, mobile, sessions persistées |

### 4.3 Facteur discriminant : la type safety

Dans le contexte d'une application manipulant des données de santé mentale, la cohérence des types entre la base de données et l'interface utilisateur est critique. Avec la T3 Stack :

- Toute modification du schéma Prisma propage les types jusqu'aux composants React
- Une incohérence de type (champ manquant, mauvais format) est signalée **à la compilation**, avant tout test ou déploiement
- Aucune couche de génération de code intermédiaire (pas de Swagger, pas de schéma OpenAPI à synchroniser)

---

## 5. Structure du projet

### 5.1 Arborescence principale

```
cesi_zen/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Groupe de routes : login, register
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (front)/                  # Groupe de routes publiques
│   │   │   ├── contenus/
│   │   │   │   ├── page.tsx          # Liste des contenus (SSR)
│   │   │   │   └── [id]/page.tsx     # Détail d'un contenu
│   │   │   ├── exercice/page.tsx     # Interface exercice cardiaque
│   │   │   ├── profil/page.tsx       # Profil utilisateur (protégé)
│   │   │   └── [pages légales]/      # Mentions légales, plan du site, etc.
│   │   ├── admin/                    # Groupe de routes admin (protégé rôle ADMIN)
│   │   │   ├── page.tsx              # Dashboard admin
│   │   │   ├── users/page.tsx        # Gestion des utilisateurs
│   │   │   ├── contenus/page.tsx     # Gestion des contenus
│   │   │   └── exercices/page.tsx    # Gestion des exercices
│   │   ├── _components/              # Composants de layout global
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   └── cookie-banner.tsx
│   │   ├── api/
│   │   │   ├── auth/[...all]/        # Endpoint Better Auth
│   │   │   └── trpc/[trpc]/          # Endpoint tRPC (batching)
│   │   └── layout.tsx                # Layout racine (Providers)
│   │
│   ├── server/                       # Logique serveur
│   │   ├── api/
│   │   │   ├── routers/              # Procédures tRPC publiques et protégées
│   │   │   │   ├── contenus.ts
│   │   │   │   ├── exercices.ts
│   │   │   │   ├── profil.ts
│   │   │   │   └── admin/            # Procédures admin
│   │   │   │       ├── users.ts
│   │   │   │       ├── contenus.ts
│   │   │   │       └── exercices.ts
│   │   │   ├── root.ts               # Composition de tous les routers
│   │   │   └── trpc.ts               # Contexte tRPC + définition des procédures
│   │   ├── better-auth/
│   │   │   └── config.ts             # Configuration de l'authentification
│   │   └── db.ts                     # Instance Prisma Client (singleton)
│   │
│   ├── components/
│   │   ├── ui/                       # Composants shadcn/ui (button, dialog, etc.)
│   │   ├── read-aloud.tsx            # Lecture à voix haute (Web Speech API)
│   │   └── announcer-provider.tsx    # Région aria-live pour les annonces
│   │
│   ├── trpc/                         # Configuration du client tRPC
│   │   ├── react.tsx                 # Provider React Query + tRPC
│   │   ├── server.ts                 # Caller server-side (SSR)
│   │   └── query-client.ts
│   │
│   ├── lib/
│   │   ├── utils.ts                  # Utilitaire classnames (cn)
│   │   └── youtube.ts                # Conversion URL YouTube → embed
│   │
│   ├── env.js                        # Validation des variables d'environnement (Zod)
│   └── middleware.ts                 # Protection des routes (redirections)
│
├── prisma/
│   ├── schema.prisma                 # Schéma de base de données
│   ├── seed.ts                       # Données initiales (presets + contenus)
│   └── migrations/                   # Historique des migrations SQL
│
├── tests/e2e/                        # Tests Playwright
├── src/__tests__/                    # Tests Vitest
├── public/                           # Assets statiques (logo, manifest PWA)
├── .github/workflows/                # Pipelines CI/CD GitHub Actions
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── playwright.config.ts
```

### 5.2 Conventions de nommage

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Fichiers composants React | kebab-case | `read-aloud.tsx` |
| Fichiers routers tRPC | kebab-case | `contenus.ts` |
| Routes Next.js | Dossiers kebab-case | `admin/contenus/` |
| Variables et fonctions | camelCase | `getUserConfig` |
| Types et interfaces | PascalCase | `TypeContenu` |
| Constantes globales | UPPER_SNAKE_CASE | `DATABASE_URL` |

---

## 6. Modèle de données

### 6.1 Modèle Logique de Données (MLD)

La base de données PostgreSQL comporte **7 tables** et **2 enums**, gérés par Prisma Migrate.

**Notation :** <u>attribut</u> = clé primaire · `#attribut` = clé étrangère

```
user(id, name, email, emailVerified, image, role, isActive, createdAt, updatedAt)

session(id, expiresAt, token, ipAddress, userAgent, createdAt, updatedAt, #userId)

account(id, accountId, providerId, accessToken, refreshToken, idToken,
        password, scope, createdAt, updatedAt, #userId)

verification(id, identifier, value, expiresAt, createdAt, updatedAt)

contenu(id, titre, corps, videoUrl, type, isPublished, createdAt, updatedAt, #auteurId)

exercice_cardiaque(id, nom, nombreCycles, tempsInspiration, tempsApnee,
                   tempsExpiration, isPreset, createdAt, updatedAt, #userId)
```

> `session.#userId` → `user.id` (CASCADE DELETE)  
> `account.#userId` → `user.id` (CASCADE DELETE)  
> `contenu.#auteurId` → `user.id` (RESTRICT — suppression utilisateur bloquée si contenu existant)  
> `exercice_cardiaque.#userId` → `user.id` (CASCADE DELETE, nullable — NULL si preset global)

### 6.2 Schéma relationnel

Le diagramme entité-association ci-dessous représente les relations entre les tables et leurs cardinalités.

```mermaid
erDiagram
    user ||--o{ session : "possède"
    user ||--o{ account : "possède"
    user ||--o{ contenu : "rédige"
    user ||--o{ exercice_cardiaque : "personnalise"

    user {
        varchar id PK
        varchar name
        varchar email UK
        Role role
        boolean isActive
    }
    session {
        varchar id PK
        varchar userId FK
        varchar token UK
        timestamp expiresAt
    }
    account {
        varchar id PK
        varchar userId FK
        varchar providerId
        varchar password
    }
    contenu {
        varchar id PK
        varchar auteurId FK
        varchar titre
        TypeContenu type
        boolean isPublished
    }
    exercice_cardiaque {
        varchar id PK
        varchar userId FK "nullable"
        varchar nom
        boolean isPreset
    }
```

- Un **utilisateur** peut avoir plusieurs sessions, comptes OAuth, contenus et configurations d'exercice.
- Un **preset** d'exercice (`isPreset = true`) n'est rattaché à aucun utilisateur (`userId = NULL`).
- La suppression d'un utilisateur est **bloquée** s'il est auteur de contenus (RESTRICT), mais **propage** la suppression de ses sessions, comptes et exercices personnalisés (CASCADE).

### 6.3 Tables métier

#### `user` — Utilisateurs

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | VARCHAR | PK | CUID généré par Better Auth |
| `name` | VARCHAR | NOT NULL | Nom affiché |
| `email` | VARCHAR | NOT NULL, UNIQUE | Adresse email (identifiant de connexion) |
| `emailVerified` | BOOLEAN | DEFAULT false | Email vérifié |
| `image` | VARCHAR | NULL | Avatar (OAuth uniquement) |
| `role` | Role | DEFAULT 'USER' | Rôle applicatif : `USER` ou `ADMIN` |
| `isActive` | BOOLEAN | DEFAULT true | Compte actif / désactivé |
| `createdAt` | TIMESTAMP | DEFAULT now() | Date de création |
| `updatedAt` | TIMESTAMP | AUTO UPDATE | Date de modification |

#### `contenu` — Articles et documents

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | VARCHAR | PK (CUID) | Identifiant unique |
| `titre` | VARCHAR | NOT NULL | Titre affiché |
| `corps` | TEXT | NOT NULL | Corps du contenu (HTML ou texte brut) |
| `videoUrl` | VARCHAR | NULL | URL YouTube optionnelle |
| `type` | TypeContenu | NOT NULL | `ARTICLE` ou `DOCUMENT` |
| `isPublished` | BOOLEAN | DEFAULT false | Visibilité publique |
| `auteurId` | VARCHAR | FK → user (RESTRICT) | Auteur du contenu |
| `createdAt` | TIMESTAMP | DEFAULT now() | Date de création |
| `updatedAt` | TIMESTAMP | AUTO UPDATE | Date de modification |

> **Index :** `(type)`, `(isPublished)` — optimisation des filtrages fréquents

#### `exercice_cardiaque` — Exercices de respiration

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | VARCHAR | PK | Identifiant unique |
| `nom` | VARCHAR | NOT NULL | Nom de l'exercice (ex : "7-4-8") |
| `nombreCycles` | INT | NOT NULL, ≥ 1 | Nombre de cycles à effectuer |
| `tempsInspiration` | INT | NOT NULL, ≥ 1 | Durée d'inspiration (secondes) |
| `tempsApnee` | INT | NOT NULL, ≥ 0 | Durée d'apnée (secondes, peut être nul) |
| `tempsExpiration` | INT | NOT NULL, ≥ 1 | Durée d'expiration (secondes) |
| `isPreset` | BOOLEAN | NOT NULL | `true` = preset global, `false` = config utilisateur |
| `userId` | VARCHAR | FK → user (CASCADE), NULL | NULL si preset global |
| `createdAt` | TIMESTAMP | DEFAULT now() | Date de création |
| `updatedAt` | TIMESTAMP | AUTO UPDATE | Date de modification |

> **Contrainte unique :** `(nom, isPreset)` — un seul preset par nom  
> **Index :** `(userId)`, `(isPreset)` — requêtes fréquentes

### 6.4 Tables d'infrastructure (Better Auth)

| Table | Rôle |
|-------|------|
| `session` | Gestion des sessions actives (token, expiration, IP, User-Agent) |
| `account` | Données des fournisseurs OAuth (GitHub) et hash du mot de passe |
| `verification` | Tokens de vérification d'email |

### 6.5 Enums

```sql
-- Rôle applicatif d'un utilisateur
enum Role {
  USER   -- Utilisateur standard
  ADMIN  -- Administrateur de l'application
}

-- Type de contenu publié
enum TypeContenu {
  ARTICLE   -- Article de blog, ressource textuelle
  DOCUMENT  -- Document téléchargeable ou de référence
}
```

### 6.6 Données initiales (seed)

La commande `npm run db:seed` insère les données initiales :

**Exercices presets :**

| Nom | Cycles | Inspiration | Apnée | Expiration | Technique |
|-----|:------:|:-----------:|:-----:|:----------:|-----------|
| 7-4-8 | 4 | 7s | 4s | 8s | Technique de relaxation profonde (Andrew Weil) |
| 5-0-5 | 5 | 5s | 0s | 5s | Respiration équilibrée |
| 4-0-6 | 6 | 4s | 0s | 6s | Respiration apaisante |

**Contenus :** 5 articles et 3 documents sur des thèmes de santé mentale, gestion du stress et pleine conscience.

---

## 7. Architecture API

### 7.1 Principes tRPC

tRPC (TypeScript Remote Procedure Call) remplace une API REST classique. Chaque procédure est une fonction TypeScript typée, accessible depuis le client comme un appel de fonction normal. Les avantages :

- **Aucun schema OpenAPI** à maintenir
- **Types inférés automatiquement** du serveur vers le client
- **Validation Zod intégrée** dans chaque procédure
- **Batching** : plusieurs appels regroupés en une seule requête HTTP

### 7.2 Niveaux d'accès

```typescript
// Procédure publique — aucune authentification requise
publicProcedure

// Procédure protégée — utilisateur connecté requis
// Lève UNAUTHORIZED si pas de session valide
protectedProcedure

// Procédure admin — rôle ADMIN requis
// Lève FORBIDDEN si rôle USER
adminProcedure
```

### 7.3 Inventaire des procédures

#### Procédures publiques

| Procédure | Type | Entrée | Description |
|-----------|------|--------|-------------|
| `contenus.list` | Query | `{ search?, offset, limit, sortBy }` | Liste paginée des contenus publiés |
| `contenus.byId` | Query | `{ id: string }` | Détail d'un contenu publié |
| `exercices.getPresets` | Query | — | Liste des exercices presets |

#### Procédures protégées (utilisateur connecté)

| Procédure | Type | Entrée | Description |
|-----------|------|--------|-------------|
| `exercices.getUserConfig` | Query | — | Configuration personnelle de l'utilisateur |
| `exercices.saveUserConfig` | Mutation | `{ nom, nombreCycles, tempsInspiration, tempsApnee, tempsExpiration }` | Créer ou mettre à jour la configuration personnelle |
| `profil.get` | Query | — | Données du profil connecté |
| `profil.update` | Mutation | `{ name, email }` | Modifier nom et email |
| `profil.deleteAccount` | Mutation | — | Supprimer définitivement le compte |

#### Procédures admin

| Procédure | Type | Description |
|-----------|------|-------------|
| `adminUsers.list` | Query | Liste de tous les utilisateurs avec leurs statistiques |
| `adminUsers.setRole` | Mutation | Changer le rôle d'un utilisateur |
| `adminUsers.toggleActive` | Mutation | Activer / désactiver un compte |
| `adminContenus.list` | Query | Liste de tous les contenus (publiés et brouillons) |
| `adminContenus.create` | Mutation | Créer un contenu |
| `adminContenus.update` | Mutation | Modifier un contenu |
| `adminContenus.delete` | Mutation | Supprimer un contenu |
| `adminContenus.togglePublish` | Mutation | Publier / dépublier un contenu |
| `adminExercices.listPresets` | Query | Liste de tous les presets |
| `adminExercices.create` | Mutation | Créer un preset |
| `adminExercices.update` | Mutation | Modifier un preset |
| `adminExercices.delete` | Mutation | Supprimer un preset |

### 7.4 Endpoint HTTP

Toutes les procédures tRPC transitent par une seule route HTTP :

```
POST /api/trpc/[procédure]
```

Better Auth expose ses propres endpoints sur :

```
POST /api/auth/sign-in
POST /api/auth/sign-up
POST /api/auth/sign-out
GET  /api/auth/callback/github    (OAuth GitHub)
```

---

## 8. Authentification et sécurité

### 8.1 Bibliothèque d'authentification : Better Auth

Better Auth 1.3 est une bibliothèque d'authentification open-source moderne pour Node.js. Elle gère nativement :

- Le hachage des mots de passe (bcrypt)
- Les sessions sécurisées stockées en base de données
- Les flux OAuth2 (GitHub dans ce projet)
- La vérification d'email (optionnelle)

### 8.2 Méthodes d'authentification disponibles

| Méthode | Description |
|---------|-------------|
| **Email / mot de passe** | Inscription et connexion via formulaire — validation Zod, hachage bcrypt |
| **GitHub OAuth** | Connexion via compte GitHub — flux OAuth2 standard |

### 8.3 Gestion des sessions

Les sessions sont stockées en base de données PostgreSQL (table `session`). Un cookie HTTP-only contenant le token de session est positionné sur le navigateur :

- **Nom du cookie (dev) :** `better-auth.session_token`
- **Nom du cookie (prod) :** `__Secure-better-auth.session_token` (flag `Secure`)
- **Durée de vie :** configurable (défaut Better Auth : 7 jours)

### 8.4 Protection des routes (middleware Next.js)

Le middleware `src/middleware.ts` intercepte toutes les requêtes et applique les règles suivantes :

| Route | Règle | Redirection |
|-------|-------|-------------|
| `/admin/**` | Session requise | → `/login` si absent |
| `/profil` | Session requise | → `/login` si absent |
| `/login`, `/register` | Pas déjà connecté | → `/` si session active |

### 8.5 Contrôle d'accès au niveau API

Trois niveaux de procédures tRPC garantissent que les données admin ne sont jamais accessibles sans les droits requis :

```
publicProcedure     → aucune vérification
protectedProcedure  → vérifie ctx.session (lève UNAUTHORIZED)
adminProcedure      → vérifie ctx.session.user.role === "ADMIN" (lève FORBIDDEN)
```

Ce contrôle est **centralisé** dans `src/server/api/trpc.ts` — il n'est pas possible d'oublier de l'appliquer sur une procédure admin.

### 8.6 Validation des entrées

Chaque procédure tRPC définit un schéma Zod pour ses paramètres. Une requête avec des données invalides est rejetée avant d'atteindre la logique métier :

```typescript
// Exemple : validation de la configuration exercice
const saveUserConfigSchema = z.object({
  nom: z.string().min(1).max(100),
  nombreCycles: z.number().int().min(1),
  tempsInspiration: z.number().int().min(1),
  tempsApnee: z.number().int().min(0),
  tempsExpiration: z.number().int().min(1),
});
```

### 8.7 Protection contre les vulnérabilités OWASP

| Vulnérabilité | Mitigation appliquée |
|--------------|----------------------|
| Injection SQL | Prisma utilise des requêtes paramétrées — les inputs utilisateur ne sont jamais concaténés dans du SQL |
| XSS | React échappe automatiquement les valeurs dans le JSX ; Next.js désactive l'exécution de scripts non autorisés |
| CSRF | Better Auth génère des tokens CSRF pour les mutations ; les cookies `SameSite=Lax` réduisent l'exposition |
| Accès non autorisé | Middleware + procédures tRPC à double validation (route + API) |
| Mots de passe en clair | Better Auth utilise bcrypt (coût 10+) pour le hachage |
| Énumération de comptes | Les messages d'erreur de connexion sont génériques |

---

## 9. Interface utilisateur et accessibilité

### 9.1 Framework de style

L'interface est construite avec **Tailwind CSS 4** (utility-first) et **DaisyUI 5** (composants UI avec système de thèmes). Cette combinaison permet :

- Un mode sombre / clair nativement géré via `next-themes`
- Une cohérence visuelle entre le front-office et le back-office d'administration
- Des composants accessibles (boutons, formulaires, dialogs) conformes aux standards ARIA

### 9.2 Accessibilité (RGAA)

CesiZen intègre les fonctionnalités d'accessibilité suivantes :

| Fonctionnalité | Implémentation |
|---------------|----------------|
| **Lien d'évitement** | `<a href="#main-content">Aller au contenu principal</a>` visible au focus clavier |
| **Hiérarchie des titres** | Un seul `<h1>` par page, structure `h2`/`h3` cohérente |
| **Étiquettes ARIA** | Tous les boutons d'action ont un `aria-label` explicite |
| **Annonces dynamiques** | `AnnouncerProvider` : région `aria-live="polite"` annonçant les changements d'état (publication, suppression, etc.) |
| **Lecture vocale** | Composant `ReadAloud` : lit le titre et le corps d'un article via Web Speech API (`lang="fr-FR"`) |
| **Guidage vocal exercice** | Annonces "Inspirez", "Retenez", "Expirez", "Exercice terminé" lors de la pratique |
| **Focus visible** | Tailwind `focus-visible:ring` sur tous les éléments interactifs |
| **Responsive** | Layout adaptatif Tailwind — testé à 375 px (iPhone SE) et 1440 px (desktop) |

### 9.3 Thème sombre / clair

Le toggle de thème est disponible dans le header (front-office) et dans la sidebar de l'administration. Le thème s'applique uniformément à toute l'application, y compris le back-office, via les classes CSS Tailwind `bg-background`, `bg-card`, `border-border` (variables CSS DaisyUI).

---

## 10. Progressive Web App (PWA)

CesiZen est configurée comme Progressive Web App grâce à `next-pwa`. Cette configuration est active **uniquement en production** (incompatibilité avec Turbopack en développement).

### 10.1 Fonctionnalités PWA

| Fonctionnalité | Statut | Description |
|---------------|--------|-------------|
| Manifeste Web App | ✅ | Nom, icône, couleurs, `display: standalone` |
| Installation sur écran d'accueil | ✅ | Prompt d'installation sur mobile et desktop |
| Service Worker | ✅ généré automatiquement | Mise en cache des assets statiques |
| Mode hors-ligne | ⚠️ Partiel | Pages statiques mises en cache ; les données dynamiques (contenus, exercices) requièrent une connexion |

### 10.2 Configuration

```javascript
// next.config.js (extrait)
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});
```

---

## 11. Stratégie de tests

### 11.1 Pyramide de tests

```
          ┌─────────┐
          │  E2E    │  Playwright — 52 tests (8 spec files)
         /│ (haut)  │\  Scénarios complets navigateur réel
        / └─────────┘ \
       /┌─────────────┐\
      / │ Composants  │ \  Vitest + Testing Library
     /  │  (milieu)   │  \  Rendu, comportement UI
    /   └─────────────┘   \
   /┌───────────────────────┐\
  / │      Unitaires        │ \  Vitest — logique pure
 /  │       (base)          │  \  Routers tRPC, fonctions utilitaires
└───┴───────────────────────┴───┘
```

### 11.2 Tests unitaires (Vitest)

| Fichier de test | Module testé | Tests |
|----------------|-------------|:-----:|
| `contenus.test.ts` | Router `contenus` (tRPC) | 9 |
| `exercices.test.ts` | Router `exercices` (tRPC) | 9 |
| `youtube.test.ts` | Fonction `getYoutubeEmbedUrl` | 6 |
| `read-aloud.test.tsx` | Composant `ReadAloud` | 6 |
| `announcer-provider.test.tsx` | Composant `AnnouncerProvider` | 4 |
| **TOTAL** | | **34** |

### 11.3 Tests E2E (Playwright)

| Fichier de test | Scénarios | Navigateurs |
|----------------|:---------:|-------------|
| `home.spec.ts` | 5 | Chromium + Mobile Chrome |
| `auth.spec.ts` | 6 | Chromium + Mobile Chrome |
| `contenus.spec.ts` | 5 | Chromium + Mobile Chrome |
| `exercice.spec.ts` | 4 | Chromium + Mobile Chrome |
| `admin.spec.ts` | 4 | Chromium + Mobile Chrome |
| `admin-auth.spec.ts` | 3 | admin-authenticated |
| `auth.setup.ts` | 1 (setup) | — |
| **TOTAL** | **26 scénarios × 2 navigateurs = 52 tests** | |

### 11.4 Configuration de l'environnement de test

- **Vitest** : environnement jsdom, globals activés, alias de chemin `@/*`
- **Playwright** : démarrage automatique du serveur `npm run dev`, sessions admin persistées dans `.auth/admin.json`, screenshots automatiques en cas d'échec
- **Couverture** : rapport généré dans `coverage/` via `npm run test:coverage`

### 11.5 Commandes de test

```bash
npm run test:run        # Tests Vitest (une passe)
npm run test:watch      # Tests Vitest en mode watch
npm run test:coverage   # Rapport de couverture
npm run test:e2e        # Tests Playwright (serveur requis)
npm run test:e2e:ui     # Interface graphique Playwright
npm run test:e2e:debug  # Mode debug Playwright
```

---

## 12. Déploiement et intégration continue

### 12.1 Environnements

| Environnement | URL | Déclencheur |
|--------------|-----|-------------|
| **Développement** | `http://localhost:3000` | `npm run dev` |
| **Preview** | URL Vercel auto-générée | Push sur toute branche GitHub |
| **Production** | URL Vercel finale | Push / merge sur `main` |

### 12.2 Pipeline CI/CD (GitHub Actions)

Le workflow `.github/workflows/` exécute automatiquement à chaque push :

1. **Lint** — ESLint 9 sur l'ensemble du code TypeScript
2. **Type check** — `tsc --noEmit` (vérification des types sans compilation)
3. **Tests unitaires** — `npm run test:run` (Vitest)
4. **Build** — `npm run build` (Next.js production build)

Les tests E2E Playwright sont exécutés avec 1 seul worker en CI (variable `CI=true` dans `playwright.config.ts`).

### 12.3 Infrastructure de production

| Service | Fournisseur | Usage |
|---------|------------|-------|
| **Hébergement** | Vercel | Next.js serverless functions |
| **Base de données** | Neon (PostgreSQL 15) | Connexion poolée via PgBouncer |
| **Gestion de code** | GitHub | Versioning, PR reviews, CI/CD |
| **OAuth GitHub** | GitHub Apps | Authentification sociale |

### 12.4 Procédure de déploiement initial

```bash
# 1. Cloner le dépôt et installer les dépendances
git clone <repo>
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# Remplir DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL,
# GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

# 3. Initialiser la base de données
npm run db:push      # Applique le schéma Prisma
npm run db:seed      # Insère les données initiales

# 4. Lancer l'application
npm run dev          # Développement
npm run build && npm run start   # Production locale
```

---

## 13. Variables d'environnement

| Variable | Obligatoire | Description |
|----------|:-----------:|-------------|
| `DATABASE_URL` | ✅ | URL de connexion PostgreSQL (ex : `postgresql://user:pass@host/db`) |
| `BETTER_AUTH_SECRET` | ✅ | Clé secrète de chiffrement des sessions (min. 32 caractères) |
| `BETTER_AUTH_URL` | ✅ | URL publique de l'application (ex : `https://cesizen.vercel.app`) |
| `GITHUB_CLIENT_ID` | ✅ | Client ID de l'OAuth App GitHub |
| `GITHUB_CLIENT_SECRET` | ✅ | Client Secret de l'OAuth App GitHub |
| `NODE_ENV` | Auto | `development` ou `production` (géré par Next.js) |

La validation des variables d'environnement est effectuée au démarrage par `src/env.js` (t3-oss/env-nextjs + Zod). Toute variable manquante ou mal formatée provoque une erreur explicite au démarrage.

---

## 14. Dépendances et licences

### 14.1 Dépendances de production

| Package | Version | Licence | Usage |
|---------|---------|---------|-------|
| next | 15.2.3 | MIT | Framework full-stack |
| react / react-dom | 19.0.0 | MIT | Bibliothèque UI |
| @trpc/server / client | 11.0.0 | MIT | Communication type-safe |
| @prisma/client | 6.6.0 | Apache 2.0 | ORM PostgreSQL |
| better-auth | 1.3.x | MIT | Authentification |
| zod | 3.24.2 | MIT | Validation de schémas |
| tailwindcss | 4.0.15 | MIT | Framework CSS |
| daisyui | 5.5.19 | MIT | Composants UI |
| next-themes | — | MIT | Gestion thème dark/light |
| lucide-react | — | ISC | Icônes SVG |
| next-pwa | — | MIT | Progressive Web App |

### 14.2 Dépendances de développement

| Package | Version | Usage |
|---------|---------|-------|
| typescript | 5.8.2 | Typage statique |
| vitest | 4.1.7 | Tests unitaires |
| @playwright/test | 1.60.0 | Tests E2E |
| eslint | 9.23.0 | Linting |
| prettier | 3.5.3 | Formatage du code |
| prisma | 6.6.0 | CLI migrations / génération |

Toutes les dépendances sont sous licence permissive (MIT, Apache 2.0, ISC), compatibles avec un usage commercial et pédagogique.

---

## 15. Glossaire

| Terme | Définition |
|-------|-----------|
| **App Router** | Système de routage de Next.js 15 basé sur les dossiers et les React Server Components |
| **Better Auth** | Bibliothèque d'authentification open-source pour Node.js (alternative à NextAuth) |
| **CUID** | Collision-resistant Unique Identifier — format d'identifiant utilisé par Prisma |
| **DaisyUI** | Plugin Tailwind CSS fournissant des composants UI avec un système de thèmes |
| **E2E (End-to-End)** | Tests automatisés simulant un utilisateur réel dans un navigateur |
| **Hydratation** | Processus par lequel React prend le contrôle d'un HTML rendu côté serveur (SSR) |
| **Monorepo** | Dépôt contenant l'ensemble du code source (front, back, tests) dans un seul projet |
| **OAuth2** | Protocole d'autorisation permettant la connexion via un compte tiers (GitHub) |
| **Prisma** | ORM TypeScript pour PostgreSQL — génère les types, gère les migrations |
| **PWA** | Progressive Web App — application web installable avec fonctionnement offline partiel |
| **React Query** | Bibliothèque de gestion du cache et des requêtes asynchrones côté client |
| **RSC** | React Server Components — composants exécutés uniquement côté serveur |
| **RGAA** | Référentiel Général d'Amélioration de l'Accessibilité (norme française) |
| **SSR** | Server-Side Rendering — génération du HTML côté serveur à chaque requête |
| **T3 Stack** | Stack opinionnatée Next.js + tRPC + Prisma + TypeScript + Tailwind CSS |
| **tRPC** | TypeScript Remote Procedure Call — API type-safe sans schema OpenAPI |
| **Turbopack** | Bundler Rust de Vercel, remplaçant Webpack en mode développement Next.js |
| **Zod** | Bibliothèque de validation de schémas TypeScript-first |

---

*Document rédigé dans le cadre du projet CesiZen — École CESI — Lucas Helloco — 2026*
