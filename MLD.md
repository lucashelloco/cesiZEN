# Modèle Logique de Données — CesiZen

**Version :** 1.0  
**Date :** 2026-05-21  
**SGBD cible :** PostgreSQL  
**ORM :** Prisma  

---

## 1. Schéma des relations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  user                                       │
│ PK  id            VARCHAR  (CUID / Better Auth)                             │
│     name          VARCHAR  NOT NULL                                         │
│     email         VARCHAR  NOT NULL  ◄── UNIQUE                             │
│     emailVerified BOOLEAN  DEFAULT false                                    │
│     image         VARCHAR  NULL                                             │
│     role          Role     DEFAULT 'USER'   ← enum(USER, ADMIN)            │
│     isActive      BOOLEAN  DEFAULT true                                     │
│     createdAt     TIMESTAMP DEFAULT now()                                   │
│     updatedAt     TIMESTAMP DEFAULT now()                                   │
└───────────┬───────────────────────────────────────────────────┬─────────────┘
            │ 1                                                 │ 1
            │                                                   │
    ┌───────┴────────────────┐                     ┌────────────┴───────────────┐
    │       session          │   ┌──────────┐      │        account             │
    │ PK id        VARCHAR   │   │ verifi-  │      │ PK id           VARCHAR    │
    │    expiresAt TIMESTAMP │   │ cation   │      │    accountId    VARCHAR    │
    │    token     VARCHAR   │   │          │      │    providerId   VARCHAR    │
    │             ◄UNIQUE    │   │ PK id    │      │    accessToken  VARCHAR?   │
    │    ipAddress VARCHAR?  │   │ ident.   │      │    refreshToken VARCHAR?   │
    │    userAgent VARCHAR?  │   │ value    │      │    idToken      VARCHAR?   │
    │ FK userId    VARCHAR   │   │ expiresAt│      │    password     VARCHAR?   │
    │    CASCADE ON DELETE   │   │ createdAt│      │    scope        VARCHAR?   │
    └────────────────────────┘   │ updatedAt│      │ FK userId       VARCHAR    │
                                 └──────────┘      │    CASCADE ON DELETE       │
                                                   └───────────────────────────┘

            │ 1                                             │ 1
            │                                               │
    ┌───────┴──────────────────────────┐     ┌─────────────┴──────────────────┐
    │           contenu                │     │       exercice_cardiaque        │
    │ PK id          VARCHAR (CUID)    │     │ PK id               VARCHAR     │
    │    titre       VARCHAR NOT NULL  │     │    nom              VARCHAR     │
    │    corps       TEXT    NOT NULL  │     │    nombreCycles      INT        │
    │    videoUrl    VARCHAR NULL      │     │    tempsInspiration  INT (sec)  │
    │    type        TypeContenu       │     │    tempsApnee        INT (sec)  │
    │           ← enum(ARTICLE,        │     │    tempsExpiration   INT (sec)  │
    │             DOCUMENT)           │     │    isPreset          BOOLEAN     │
    │    isPublished BOOLEAN           │     │ FK userId            VARCHAR?   │
    │             DEFAULT false        │     │         NULL si preset global   │
    │ FK auteurId    VARCHAR NOT NULL  │     │    CASCADE ON DELETE            │
    │    createdAt   TIMESTAMP         │     │    createdAt         TIMESTAMP  │
    │    updatedAt   TIMESTAMP         │     │    updatedAt         TIMESTAMP  │
    │                                  │     │                                 │
    │ INDEX(type)                      │     │ UNIQUE(nom, isPreset)           │
    │ INDEX(isPublished)               │     │ INDEX(userId)                   │
    └──────────────────────────────────┘     │ INDEX(isPreset)                 │
                                             └─────────────────────────────────┘
```

---

## 2. Description des tables

### 2.1 `user` — Utilisateurs

Table centrale gérée par Better Auth. Étendue avec les champs métier `role` et `isActive`.

| Colonne | Type SQL | Contraintes | Description |
|---------|----------|-------------|-------------|
| `id` | `VARCHAR` | PK | Identifiant unique généré par Better Auth |
| `name` | `VARCHAR` | NOT NULL | Nom affiché de l'utilisateur |
| `email` | `VARCHAR` | NOT NULL, UNIQUE | Adresse email (identifiant de connexion) |
| `emailVerified` | `BOOLEAN` | DEFAULT false | Email vérifié via lien de validation |
| `image` | `VARCHAR` | NULL | URL de l'avatar (OAuth) |
| `role` | `Role` | DEFAULT 'USER' | Rôle applicatif : `USER` ou `ADMIN` |
| `isActive` | `BOOLEAN` | DEFAULT true | Compte actif ou désactivé par un admin |
| `createdAt` | `TIMESTAMP` | DEFAULT now() | Date de création |
| `updatedAt` | `TIMESTAMP` | DEFAULT now(), ON UPDATE | Date de dernière modification |

**Relations sortantes :** `session` (1-N), `account` (1-N), `contenu` (1-N), `exercice_cardiaque` (1-N nullable)

---

### 2.2 `session` — Sessions d'authentification

Gérée automatiquement par Better Auth. Une session par connexion active.

| Colonne | Type SQL | Contraintes | Description |
|---------|----------|-------------|-------------|
| `id` | `VARCHAR` | PK | Identifiant de session |
| `expiresAt` | `TIMESTAMP` | NOT NULL | Date d'expiration |
| `token` | `VARCHAR` | NOT NULL, UNIQUE | Token de session (cookie) |
| `ipAddress` | `VARCHAR` | NULL | Adresse IP du client |
| `userAgent` | `VARCHAR` | NULL | User-Agent du navigateur |
| `userId` | `VARCHAR` | FK → user.id | Utilisateur propriétaire |
| `createdAt` | `TIMESTAMP` | DEFAULT now() | Date de création |
| `updatedAt` | `TIMESTAMP` | ON UPDATE | Date de modification |

**Suppression en cascade** : si l'utilisateur est supprimé, ses sessions sont supprimées.

---

### 2.3 `account` — Comptes d'authentification (OAuth)

Associe un fournisseur d'identité (GitHub, credentials) à un utilisateur.

| Colonne | Type SQL | Contraintes | Description |
|---------|----------|-------------|-------------|
| `id` | `VARCHAR` | PK | Identifiant |
| `accountId` | `VARCHAR` | NOT NULL | ID chez le fournisseur |
| `providerId` | `VARCHAR` | NOT NULL | Nom du fournisseur (ex : `github`, `credential`) |
| `userId` | `VARCHAR` | FK → user.id | Utilisateur lié |
| `accessToken` | `VARCHAR` | NULL | Token d'accès OAuth |
| `refreshToken` | `VARCHAR` | NULL | Token de rafraîchissement OAuth |
| `idToken` | `VARCHAR` | NULL | Token OpenID Connect |
| `accessTokenExpiresAt` | `TIMESTAMP` | NULL | Expiration access token |
| `refreshTokenExpiresAt` | `TIMESTAMP` | NULL | Expiration refresh token |
| `scope` | `VARCHAR` | NULL | Portées OAuth accordées |
| `password` | `VARCHAR` | NULL | Mot de passe hashé (provider `credential`) |
| `createdAt` | `TIMESTAMP` | DEFAULT now() | Date de création |
| `updatedAt` | `TIMESTAMP` | ON UPDATE | Date de modification |

**Suppression en cascade** : si l'utilisateur est supprimé, ses comptes OAuth sont supprimés.

---

### 2.4 `verification` — Jetons de vérification

Stocke les tokens temporaires (vérification email, réinitialisation de mot de passe).

| Colonne | Type SQL | Contraintes | Description |
|---------|----------|-------------|-------------|
| `id` | `VARCHAR` | PK | Identifiant |
| `identifier` | `VARCHAR` | NOT NULL | Cible (email, userId…) |
| `value` | `VARCHAR` | NOT NULL | Valeur du token |
| `expiresAt` | `TIMESTAMP` | NOT NULL | Expiration du token |
| `createdAt` | `TIMESTAMP` | DEFAULT now() | Date de création |
| `updatedAt` | `TIMESTAMP` | DEFAULT now() | Date de modification |

**Pas de clé étrangère** : les tokens sont indépendants — Better Auth les gère entièrement.

---

### 2.5 `contenu` — Contenus éditoriaux

Articles et documents publiés par les administrateurs.

| Colonne | Type SQL | Contraintes | Description |
|---------|----------|-------------|-------------|
| `id` | `VARCHAR` | PK (CUID) | Identifiant unique |
| `titre` | `VARCHAR` | NOT NULL | Titre du contenu |
| `corps` | `TEXT` | NOT NULL | Corps (texte long) |
| `videoUrl` | `VARCHAR` | NULL | URL YouTube optionnelle |
| `type` | `TypeContenu` | NOT NULL | `ARTICLE` ou `DOCUMENT` |
| `isPublished` | `BOOLEAN` | DEFAULT false | Visibilité publique |
| `auteurId` | `VARCHAR` | FK → user.id, NOT NULL | Administrateur auteur |
| `createdAt` | `TIMESTAMP` | DEFAULT now() | Date de création |
| `updatedAt` | `TIMESTAMP` | ON UPDATE | Date de dernière modification |

**Index :** `(type)`, `(isPublished)` — optimisent les filtres de listing public.  
**Pas de cascade** : la suppression d'un auteur ne supprime pas ses contenus (protection éditoriale).

---

### 2.6 `exercice_cardiaque` — Exercices de cohérence cardiaque

Sert deux usages via le champ `isPreset` et `userId` :

| `isPreset` | `userId` | Signification |
|-----------|---------|---------------|
| `true` | `NULL` | Preset global — visible par tous les utilisateurs |
| `false` | renseigné | Configuration personnelle d'un utilisateur connecté |

| Colonne | Type SQL | Contraintes | Description |
|---------|----------|-------------|-------------|
| `id` | `VARCHAR` | PK (CUID) | Identifiant unique |
| `nom` | `VARCHAR` | NOT NULL | Nom de l'exercice (ex : "5-0-5") |
| `nombreCycles` | `INT` | NOT NULL, ≥ 1 | Nombre de cycles à effectuer |
| `tempsInspiration` | `INT` | NOT NULL, ≥ 1 | Durée inspiration en secondes |
| `tempsApnee` | `INT` | NOT NULL, ≥ 0 | Durée apnée en secondes (0 = sans apnée) |
| `tempsExpiration` | `INT` | NOT NULL, ≥ 1 | Durée expiration en secondes |
| `isPreset` | `BOOLEAN` | DEFAULT false | true = preset admin, false = config utilisateur |
| `userId` | `VARCHAR` | FK → user.id, NULL | NULL pour les presets, renseigné pour les configs |
| `createdAt` | `TIMESTAMP` | DEFAULT now() | Date de création |
| `updatedAt` | `TIMESTAMP` | ON UPDATE | Date de modification |

**Contrainte UNIQUE :** `(nom, isPreset)` — deux presets ne peuvent pas avoir le même nom.  
**Index :** `(userId)`, `(isPreset)` — optimisent les requêtes de listing.  
**Suppression en cascade** : si l'utilisateur est supprimé, ses configurations personnelles sont supprimées. Les presets (`userId = NULL`) ne sont jamais supprimés en cascade.

---

## 3. Énumérations

### `Role`
| Valeur | Description |
|--------|-------------|
| `USER` | Utilisateur standard — accès lecture, profil, exercices |
| `ADMIN` | Administrateur — accès back-office complet |

### `TypeContenu`
| Valeur | Description |
|--------|-------------|
| `ARTICLE` | Article de fond (conseils, bien-être) |
| `DOCUMENT` | Document téléchargeable ou de référence |

---

## 4. Règles de gestion

| RG | Description |
|----|-------------|
| **RG-01** | Un utilisateur peut avoir plusieurs sessions simultanées (multi-appareils) |
| **RG-02** | Un utilisateur ne peut avoir qu'une seule configuration personnelle d'exercice (`isPreset=false`) — mise à jour si elle existe |
| **RG-03** | Seul un utilisateur avec `role=ADMIN` peut créer, modifier ou supprimer des contenus et des presets d'exercices |
| **RG-04** | Un contenu avec `isPublished=false` n'est pas accessible en mode public (API filtrée) |
| **RG-05** | La suppression d'un utilisateur entraîne la suppression de ses sessions, comptes OAuth et configurations d'exercices (CASCADE). Ses contenus restent en base. |
| **RG-06** | Un utilisateur avec `isActive=false` ne peut pas se connecter |
| **RG-07** | L'email d'un utilisateur est unique en base — une tentative d'inscription avec un email existant est rejetée |

---

## 5. Diagramme simplifié des cardinalités

```
user ||--o{ session           : "possède"
user ||--o{ account           : "s'authentifie via"
user ||--o{ contenu           : "rédige"
user ||--o{ exercice_cardiaque: "configure"
```

*Notation crow's foot — lecture : un utilisateur possède zéro ou plusieurs sessions.*
