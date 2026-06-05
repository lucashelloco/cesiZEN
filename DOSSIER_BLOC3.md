# Déployer et sécuriser les applications informatiques
## Projet CesiZen — Bloc 3

> **Auteur :** Lucas
> **Formation :** Concepteur Développeur d'Applications (CDA) — CESI
> **Dépôt :** https://github.com/lucashelloco/cesiZEN
> **Production :** https://cesi-zen.vercel.app

---

## Sommaire

1. Introduction et contexte
2. Plan de déploiement
3. Plan de maintenance
4. Plan de sécurisation
5. Conclusion
6. Annexes

---

## 1. Introduction et contexte

### 1.1 Présentation du projet

CesiZen est une plateforme web grand public dédiée à la **santé mentale** et à la **gestion du stress**. Elle met à disposition des contenus de prévention (articles et documents) et des exercices de respiration guidés (cohérence cardiaque).

Le périmètre fonctionnel livré couvre trois modules :

| Module | Type | Acteurs |
|--------|------|---------|
| Comptes utilisateurs | Obligatoire | Visiteur, Utilisateur connecté, Administrateur |
| Informations | Obligatoire | Visiteur, Utilisateur connecté, Administrateur |
| Exercice de respiration (cohérence cardiaque) | Au choix | Visiteur, Utilisateur connecté |

L'application repose sur la **T3 Stack** : Next.js 15 (React 19), TypeScript, tRPC, Prisma, PostgreSQL et Better Auth, le tout déployé sur Vercel.

### 1.2 Périmètre du Bloc 3

Ce dossier traite de la mise en production et de la pérennité de l'application, autour de trois axes :

- **Déployer** — concevoir et mettre en place une chaîne de déploiement automatisée et reproductible (versioning, intégration continue, environnements) ;
- **Maintenir** — outiller le suivi des anomalies et des évolutions, et organiser la veille technologique ;
- **Sécuriser** — identifier les risques, appliquer des mesures préventives et correctives, garantir la conformité RGPD et organiser la réponse aux incidents.

### 1.3 Vue d'ensemble de la chaîne

```
Développeur            GitHub                        Vercel               Neon
┌──────────┐  push   ┌──────────────────────────┐  deploy   ┌──────────┐
│  Poste   │ ──────► │  Dépôt Git + Pull Request│ ────────► │  Edge /  │
│  local   │         │  ↳ CI (GitHub Actions)   │  auto     │ Serverless│
│ npm dev  │ ◄────── │    lint · types · tests  │           │  Next.js │
└──────────┘ branche │    · migrations · build  │           └────┬─────┘
                     └──────────────────────────┘                │ Prisma
                                                          ┌───────▼────────┐
                                                          │ PostgreSQL Neon │
                                                          └────────────────┘
```

Chaque modification suit le même trajet : développement local → branche Git → Pull Request déclenchant la CI → fusion sur `main` → déploiement automatique en production. Cette chaîne garantit qu'aucun code non validé n'atteint la production.

---

## 2. Plan de déploiement

### 2.1 Architecture cible

L'application adopte une architecture **serverless** : il n'y a pas de serveur applicatif permanent à administrer. Le code Next.js est exécuté à la demande par la plateforme Vercel, qui adapte automatiquement la capacité à la charge.

**Composants :**

| Couche | Technologie | Hébergement | Rôle |
|--------|-------------|-------------|------|
| Client | Next.js / React 19 (PWA) | CDN Vercel (Edge) | Interface utilisateur, rendu et mise en cache statique |
| Application | Next.js Route Handlers + tRPC | Fonctions serverless Vercel | Logique métier, API typée, authentification |
| Données | PostgreSQL | Neon (base managée) | Persistance (utilisateurs, contenus, exercices) |
| Identité | Better Auth + OAuth GitHub | Intégré à l'application | Sessions, comptes, rôles |

**Justification du dimensionnement.** CesiZen vise le grand public, avec une fréquentation par nature **variable et imprévisible** (pics liés à la communication, usage diurne). Une architecture serverless répond précisément à ce besoin :

- **Élasticité** — la capacité monte et descend automatiquement, sans surcoût en période creuse ;
- **Coût maîtrisé** — facturation à l'usage, tiers gratuits suffisants en phase de lancement ;
- **Exploitation simplifiée** — pas de système d'exploitation ni de serveur à patcher, ce qui réduit la surface d'attaque et la charge de maintenance ;
- **Distribution géographique** — le CDN Vercel sert les ressources statiques au plus près de l'utilisateur (latence réduite).

La base PostgreSQL est confiée à **Neon**, qui sépare le stockage et le calcul, propose des branches de base de données (utiles pour les environnements de test) et un *connection pooler* adapté aux fonctions serverless.

### 2.2 Les trois environnements

Le déploiement s'appuie sur trois environnements distincts, chacun avec son rôle, ses données et son déclencheur :

| | Développement | Test / Preview | Production |
|--|---------------|----------------|------------|
| **Objectif** | Coder et tester localement | Valider une évolution avant fusion | Servir les utilisateurs réels |
| **Hébergement** | `localhost:3000` | Vercel Preview (URL unique par PR) | Vercel Production |
| **Base de données** | PostgreSQL local (ou Docker) | Branche Neon de test | Base Neon de production |
| **Déclencheur** | `npm run dev` | Ouverture / mise à jour d'une Pull Request | Fusion sur la branche `main` |
| **Données** | Jeu de seed (`npm run db:seed`) | Données de test anonymisées | Données réelles |
| **Accès** | Développeur | Équipe / relecteur via lien | Public |

**Environnement réellement mis en place et démontré : la production Vercel.** À chaque fusion sur `main`, Vercel reconstruit et publie automatiquement l'application. Le déploiement comprend l'installation des dépendances, la génération du client Prisma, le build Next.js et la mise en ligne atomique (bascule instantanée, sans coupure). Les variables d'environnement de production (URL de base de données, secret d'authentification, identifiants OAuth) sont configurées de façon chiffrée dans le tableau de bord Vercel — jamais dans le code.

> *Annexe A — capture du tableau de bord Vercel (déploiement de production réussi).*

### 2.3 Versioning des sources

Le code et la documentation sont versionnés avec **Git** et hébergés sur **GitHub**.

**Modèle de branches.**

- `main` — branche de production, **protégée** : toute modification passe obligatoirement par une Pull Request, et la CI doit être verte avant la fusion. Les pushs directs sont interdits.
- `feature/*` — une branche par fonctionnalité ou correction (ex. `feature/commit4`). Le développement y est isolé, puis proposé à la fusion via une Pull Request relue.

**Pull Requests et revue.** Chaque PR utilise un gabarit standardisé ([.github/pull_request_template.md](.github/pull_request_template.md)) rappelant la check-list de validation (lint, tests, CI verte, absence de secret, ticket lié). La revue de code, même en projet individuel, sert de point de contrôle qualité et documente l'intention des changements.

**Versionnement de la documentation.** L'ensemble des livrables (cahier technique, cahier de tests, plans du Bloc 3) est versionné dans le dépôt au format Markdown, garantissant un historique complet et une cohérence avec le code.

> *Annexe B — capture de la règle de protection de branche `main`.*
> *Note : l'application effective de la protection sur un dépôt privé nécessite un plan GitHub Pro/Team ; la politique est définie et activable via le GitHub Student Pack.*

### 2.4 Automatisation et intégration continue

L'intégration continue est assurée par **GitHub Actions** ([.github/workflows/ci.yml](.github/workflows/ci.yml)). Le pipeline se déclenche à **chaque push et chaque Pull Request** vers `main`.

**Étapes du pipeline :**

```
1. Checkout du code
2. Installation de Node.js 20 (avec cache npm)
3. Démarrage d'un service PostgreSQL 16 (conteneur jetable)
4. npm ci                  → installation reproductible des dépendances
5. prisma generate         → génération du client de base de données
6. prisma migrate deploy   → application des migrations sur la base de test
7. npm run lint            → qualité et conventions de code (ESLint)
8. npm run typecheck       → vérification statique des types (TypeScript)
9. npm run test:run        → tests unitaires et composants (Vitest, 34 tests)
10. npm run build          → build de production Next.js
```

Si une seule étape échoue, le pipeline est rouge et la fusion est bloquée. Cela garantit que **seul du code qui compile, respecte les conventions et passe les tests** peut atteindre la production.

**Déploiement continu (CD).** Le déploiement est automatisé par l'intégration native **GitHub ↔ Vercel** :

- toute Pull Request génère un **déploiement Preview** isolé, avec sa propre URL, permettant de valider visuellement l'évolution avant fusion ;
- toute fusion sur `main` déclenche un **déploiement de production** automatique.

Cette séparation CI (valider) / CD (livrer) constitue une chaîne **CI/CD complète et reproductible**.

> *Annexe C — capture d'une exécution réussie du pipeline GitHub Actions.*

### 2.5 Ressources nécessaires

| Ressource | Service | Plan | Rôle |
|-----------|---------|------|------|
| Hébergement code & CI | GitHub | Gratuit (Pro via Student Pack) | Versioning, Pull Requests, Actions |
| Hébergement application | Vercel | Hobby (gratuit) | Build, hébergement, CDN, Preview |
| Base de données | Neon | Free tier | PostgreSQL managé |
| Authentification tierce | GitHub OAuth | Gratuit | Connexion via GitHub |

**Gestion des secrets.** Aucun secret n'est stocké dans le dépôt (vérifié : aucun fichier `.env` n'a jamais été commité, aucune valeur sensible en dur dans le code). Les variables sensibles sont :

- en **local** : dans un fichier `.env` ignoré par Git, dérivé de `.env.example` (qui ne contient que des valeurs vides) ;
- en **CI** : dans des variables d'environnement de placeholder, sans valeur réelle ;
- en **production** : dans les variables d'environnement chiffrées de Vercel.

### 2.6 Procédure de déploiement et rollback

**Déploiement d'une évolution (procédure nominale) :**

1. Créer une branche `feature/*` à partir de `main`.
2. Développer et tester localement (`npm run dev`, `npm run check`, `npm run test:run`).
3. En cas de changement de modèle de données, créer la migration Prisma (`npm run db:generate`).
4. Pousser la branche et ouvrir une Pull Request.
5. La CI s'exécute automatiquement ; un déploiement Preview est généré pour validation.
6. Après revue et CI verte, fusionner la PR sur `main`.
7. Vercel applique les migrations puis déploie automatiquement en production.
8. **Smoke test** : vérifier les parcours critiques (connexion, affichage des contenus, lancement d'un exercice) sur l'URL de production.

**Rollback (retour arrière).** En cas d'anomalie détectée en production, deux leviers complémentaires :

- **Côté application** — Vercel conserve l'historique des déploiements ; un *Instant Rollback* permet de re-promouvoir le déploiement précédent en un clic, sans rebuild.
- **Côté code** — `git revert` du commit fautif puis nouvelle PR, afin que l'historique reste cohérent et que le correctif passe par la CI.

Les migrations de base de données étant potentiellement non réversibles, elles sont conçues pour être **additives** autant que possible (ajout de colonnes plutôt que suppression), afin qu'un rollback applicatif reste compatible avec le schéma en place.

---
