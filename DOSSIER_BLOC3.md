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

### 1.4 Choix d'outillage : étude comparative et justification

Les outils ont été sélectionnés selon des critères communs : **adéquation au projet** (application individuelle, grand public, charge variable), **coût** (tiers gratuits suffisants), **intégration** (cohérence de la chaîne), **courbe d'apprentissage** et **sécurité**. Le tableau ci-dessous résume chaque choix face à ses alternatives.

| Besoin | Outil retenu | Alternatives évaluées | Justification du choix |
|--------|--------------|------------------------|------------------------|
| **Hébergement / déploiement** | **Vercel** | Netlify, AWS (Amplify/EC2), VPS + Docker, Kubernetes | Vercel est l'éditeur de Next.js : intégration et optimisations natives (SSR, edge, PWA). Déploiement Git automatique, *preview* par PR, *rollback* instantané, scaling serverless sans administration. AWS/Kubernetes offrent plus de contrôle mais une complexité et un coût d'exploitation disproportionnés pour un projet individuel. |
| **Base de données** | **Neon** (PostgreSQL) | Supabase, Railway, PlanetScale (MySQL), AWS RDS, Postgres auto-hébergé | PostgreSQL managé, **serverless** (scale-to-zero, adapté à la charge variable et au tiers gratuit), *connection pooling* indispensable au serverless, et **branches de base de données** pour les environnements de test. Compatible nativement avec Prisma. RDS impose une gestion d'infrastructure ; PlanetScale (MySQL) aurait changé de moteur. |
| **Versioning & hébergement de code** | **GitHub** | GitLab, Bitbucket | Standard du marché, écosystème le plus riche, intégration directe avec Vercel et avec les outils ci-dessous (Actions, Issues, Dependabot) — une seule plateforme pour tout. |
| **Intégration continue (CI/CD)** | **GitHub Actions** | GitLab CI, CircleCI, Jenkins | Intégré au dépôt (pas d'outil tiers ni de serveur à maintenir comme Jenkins), gratuit pour le volume du projet, configuration en YAML versionnée, large catalogue d'actions. |
| **Ticketing / suivi** | **GitHub Issues + Projects** | Jira, Trello, Linear | Au plus près du code (liens issue ↔ PR ↔ commit), gratuit, sans contexte externe à synchroniser. Jira est puissant mais surdimensionné et payant pour un projet individuel. |
| **Veille des dépendances** | **Dependabot** | Renovate, Snyk | Natif GitHub (zéro configuration d'intégration), alertes de sécurité et PRs de mise à jour automatiques. Renovate est plus configurable mais plus complexe ; Snyk est surtout pertinent en version payante. |
| **Authentification** | **Better Auth** | Auth.js (NextAuth), Clerk, Auth0 | Solution *self-hosted* (les données d'authentification restent dans notre base PostgreSQL, atout RGPD), gratuite et sans dépendance à un tiers facturé à l'utilisateur (Clerk/Auth0). Intégration TypeScript et OAuth (GitHub) directe. |

> Ces choix forment un **écosystème cohérent et majoritairement gratuit**, centré sur GitHub et Vercel, qui réduit le nombre d'intégrations à maintenir et la surface d'administration — un facteur clé de pérennité pour un projet porté par une seule personne.

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

Le déploiement s'appuie sur trois environnements distincts, articulés autour des branches Git, ce qui rend le flux de promotion explicite et traçable :

| | Développement | Test / Recette | Production |
|--|---------------|----------------|------------|
| **Branche Git** | `develop` (+ `feature/*`) | Branche en revue (PR) | `main` |
| **Objectif** | Intégrer le travail en cours | Valider/recetter une évolution avant fusion | Servir les utilisateurs réels |
| **Hébergement** | `localhost:3000` + Vercel Preview | Vercel Preview (URL automatique par PR) | Vercel Production |
| **Base de données** | PostgreSQL local (ou Docker) | Branche Neon de test | Base Neon de production |
| **Déclencheur** | Fusion d'une `feature/*` dans `develop` | Ouverture / mise à jour d'une Pull Request | Fusion sur `main` (+ tag `vX.Y.Z`) |
| **Données** | Jeu de seed (`npm run db:seed`) | Données de test anonymisées | Données réelles |
| **Accès** | Développeur | Équipe / relecteur via lien | Public |

**Flux de promotion** (un changement « monte » d'un environnement au suivant) :

```
feature/*  ──►  develop  ──►  Pull Request  ──►  main  ──►  tag vX.Y.Z
 (local)        (DEV)         (TEST/recette)      (PROD)     (release)
```

Chaque promotion vers `main` passe par une **Pull Request validée par la CI** (la branche est protégée). Une version livrée en production est **figée par un tag de version sémantique** (`v1.0.0`, `v1.1.0`…), ce qui permet d'identifier précisément ce qui tourne et de revenir à une version antérieure si besoin.

**Environnement réellement mis en place et démontré : la production Vercel.** À chaque fusion sur `main`, Vercel reconstruit et publie automatiquement l'application. Le déploiement comprend l'installation des dépendances, la génération du client Prisma, le build Next.js et la mise en ligne atomique (bascule instantanée, sans coupure). Les variables d'environnement de production (URL de base de données, secret d'authentification, identifiants OAuth) sont configurées de façon chiffrée dans le tableau de bord Vercel — jamais dans le code.

> *Annexe A — capture du tableau de bord Vercel (déploiement de production réussi).*

### 2.3 Versioning des sources

Le code et la documentation sont versionnés avec **Git** et hébergés sur **GitHub**.

**Modèle de branches (Git Flow simplifié).** Trois niveaux de branches, alignés sur les environnements :

- `feature/*` — une branche par fonctionnalité ou correction. Le développement y est isolé, puis proposé à la fusion via une Pull Request relue. La PR génère un **déploiement Preview** servant d'environnement de recette.
- `develop` — branche d'intégration : reçoit les `feature/*` validées. Correspond à l'environnement de **développement**.
- `main` — branche de **production**, **protégée** : toute modification passe obligatoirement par une Pull Request, la CI doit être verte avant la fusion, et les pushs directs sont **refusés** (vérifié : un `git push` direct sur `main` est rejeté par le hook de protection).

**Versionnement sémantique (SemVer).** Chaque mise en production est marquée par un **tag** `vMAJEUR.MINEUR.CORRECTIF` (ex. `v1.0.0`) et publiée comme **Release GitHub**. La règle : MAJEUR pour un changement incompatible, MINEUR pour une fonctionnalité rétrocompatible, CORRECTIF pour un correctif. Cela fournit un historique de versions lisible et un point de retour arrière fiable.

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

## 3. Plan de maintenance

### 3.1 Outil de gestion des anomalies et évolutions

L'outil retenu est **GitHub Issues**, couplé à **GitHub Projects** (tableau Kanban). Ce choix est justifié par :

- **L'intégration native** au dépôt : une anomalie ou une évolution est tracée au même endroit que le code, et peut être liée directement à une branche, une Pull Request et un commit (`Closes #42`) ;
- **La gratuité** et l'absence d'outil tiers à administrer ;
- **La traçabilité complète** : historique, responsable, statut, étiquettes, discussions.

**Structuration mise en place :**

- **Gabarits d'issue** ([.github/ISSUE_TEMPLATE/](.github/ISSUE_TEMPLATE/)) — deux formulaires guident la saisie :
  - *Anomalie / Bug* : description, étapes de reproduction, comportement attendu, **criticité**, environnement concerné ;
  - *Évolution / Fonctionnalité* : besoin, solution proposée, module, priorité, critères d'acceptation.
- **Étiquettes** : `bug`, `enhancement`, `à qualifier`, `priority:high/medium/low`, `dependencies`, `maintenance`.
- **Renvoi sécurité** : la création d'issue publique renvoie vers un *security advisory privé* pour les failles, afin de ne pas divulguer une vulnérabilité.
- **Tableau de suivi** (GitHub Projects) : colonnes *À qualifier → À faire → En cours → En revue → Terminé*.

### 3.2 Méthodologie de traitement

Chaque demande suit un **cycle de vie standardisé** :

```
Déclaration → Qualification → Priorisation → Développement → Revue → Déploiement → Clôture
  (issue)      (criticité)     (backlog)     (branche+PR)    (CI+code) (Vercel)    (close)
```

1. **Déclaration** — une issue est ouverte via le gabarit adapté.
2. **Qualification** — l'anomalie est reproduite et sa **criticité** évaluée selon la matrice ci-dessous.
3. **Priorisation** — placement dans le backlog selon criticité × impact métier.
4. **Développement** — sur une branche `feature/*` ou `fix/*`, avec ajout de tests.
5. **Revue** — Pull Request : la **CI doit être verte** (lint, typecheck, tests, build) et la check-list du gabarit respectée. Rien n'est fusionné sur `main` sans validation.
6. **Déploiement** — la fusion déclenche le déploiement automatique en production.
7. **Clôture** — l'issue est fermée automatiquement par la PR liée.

**Matrice de criticité :**

| Criticité | Définition | Délai de prise en charge cible |
|-----------|------------|-------------------------------|
| Bloquant | Service indisponible ou faille de sécurité | Immédiat (hotfix) |
| Majeur | Fonction principale dégradée | < 48 h |
| Mineur | Gêne sans contournement | Prochain cycle |
| Cosmétique | Affichage / confort | Backlog |

### 3.3 Veille technologique et pérennité

La pérennité de CesiZen dépend du suivi de l'écosystème JavaScript, qui évolue rapidement. La méthodologie de veille combine **outils automatisés** et **sources humaines** :

**Veille automatisée :**

- **Dependabot** ([.github/dependabot.yml](.github/dependabot.yml)) — analyse hebdomadaire des dépendances npm et des actions GitHub, avec ouverture automatique de Pull Requests de mise à jour. Les **mises à jour mineures et correctives sont regroupées** dans une seule PR ; les **montées de version majeures sont volontairement ignorées** (voir encadré ci-dessous).
- **Alertes de sécurité GitHub** — notification immédiate des vulnérabilités connues (CVE) touchant une dépendance.
- **`npm audit`** — vérification ponctuelle des vulnérabilités lors des développements.

**Veille humaine :** suivi des CHANGELOG et blogs officiels (Next.js, Prisma, Better Auth), de l'OWASP, et des annonces de fin de support (EOL) de Node.js.

> **Retour d'expérience — la gestion des montées de version majeures.**
> Une mise à jour automatique de plusieurs dépendances **majeures** (Next.js 16, Prisma 7, Zod 4, ESLint 10) acceptée sans test a **rompu le build et le déploiement** : Prisma 7 supprime les propriétés `url`/`directUrl` du schéma, Zod 4 modifie son API, etc. Le retour à un état stable a nécessité un *revert* des dépendances. **Conséquence concrète intégrée à la stratégie de veille** : Dependabot est désormais configuré pour ne proposer que des mises à jour **mineures/correctives** (faible risque, mergeables après CI verte) ; les **majeures sont traitées manuellement**, une par une, testées sur une branche dédiée avant adoption. Cet incident illustre la frontière entre *veille* (être informé) et *adoption* (mettre à jour de façon maîtrisée).

---

## 4. Plan de sécurisation

### 4.1 Analyse des vulnérabilités, des risques et de la criticité

L'analyse s'appuie sur l'**OWASP Top 10** et sur les **alertes Dependabot réelles** du projet. Au moment de l'analyse, l'outil recensait **41 vulnérabilités** dans les dépendances (21 hautes, 18 moyennes, 2 basses).

**Tableau des principaux risques :**

| Risque (OWASP) | Vulnérabilité concrète | Impact | Probabilité | Criticité | Mesure |
|----------------|------------------------|--------|-------------|-----------|--------|
| A06 – Composants vulnérables | Dépendances avec CVE (Next.js, etc.) | Élevé | Élevée | **Haute** | Dependabot + `npm audit fix` |
| A01 – Contrôle d'accès | Accès à une ressource admin sans rôle | Élevé | Moyenne | **Haute** | `adminProcedure`, middleware, rôles |
| A03 – Injection | Injection SQL via une saisie | Élevé | Faible | Moyenne | ORM Prisma (requêtes paramétrées) + Zod |
| A07 – Authentification | Vol de session, mot de passe faible | Élevé | Moyenne | **Haute** | Better Auth (hash), HTTPS, cookies sécurisés |
| A05 – Mauvaise configuration | En-têtes de sécurité absents | Moyen | Moyenne | Moyenne | En-têtes HSTS, X-Frame-Options… |
| A02 – Défaillances cryptographiques | Données en clair en transit/au repos | Élevé | Faible | Moyenne | TLS partout + chiffrement Neon |
| Spécifique Next.js | Contournement de middleware (CVE) | Élevé | Moyenne | **Haute** | Mise à jour Next.js + contrôle serveur (tRPC) |

> **Point d'attention identifié.** Plusieurs CVE concernent un **contournement de middleware Next.js**. Le projet utilisant le middleware pour rediriger les accès non authentifiés, la sécurité ne **repose pas uniquement** sur lui : chaque procédure sensible est **revérifiée côté serveur** dans tRPC (`protectedProcedure` / `adminProcedure`). C'est une application du principe de **défense en profondeur**.

### 4.2 Actions préventives et correctives mises en œuvre

**Préventif (par conception) :**

- **Authentification** — Better Auth gère les sessions et le **hachage des mots de passe** (jamais stockés en clair) ; connexion possible via **OAuth GitHub**.
- **Contrôle d'accès par rôle** — deux rôles (`USER`, `ADMIN`) ; les procédures tRPC sont segmentées en `publicProcedure`, `protectedProcedure`, `adminProcedure`. Le [middleware](src/middleware.ts) bloque l'accès aux routes `/admin` sans session, et un compte peut être désactivé (`isActive`).
- **Validation des entrées** — toutes les entrées d'API sont validées par des schémas **Zod** avant traitement.
- **Anti-injection** — l'ORM **Prisma** génère des requêtes paramétrées, éliminant l'injection SQL.
- **En-têtes HTTP de sécurité** — ajoutés dans [next.config.js](next.config.js) : `Strict-Transport-Security` (force HTTPS), `X-Frame-Options` (anti-clickjacking), `X-Content-Type-Options` (anti-sniffing MIME), `Referrer-Policy`, `Permissions-Policy`.

**Correctif (mené durant ce projet) :**

- Exécution de `npm audit fix` ayant réduit les vulnérabilités corrigibles de **23 à 8** (les 8 restantes nécessitant des montées de version majeures, planifiées et testées séparément).
- Mise à jour de Prisma et régénération du client pour intégrer les correctifs de sécurité.

### 4.3 Solutions de chiffrement et de cryptage

| Donnée | Protection |
|--------|-----------|
| Données en transit (client ↔ serveur ↔ BDD) | **TLS/HTTPS** systématique (certificats gérés par Vercel ; `sslmode=require` côté Neon) |
| Données au repos (base de données) | **Chiffrement au repos** assuré par Neon |
| Mots de passe utilisateurs | **Hachés** par Better Auth (jamais réversibles) |
| Secrets applicatifs (clés, identifiants OAuth) | **Variables d'environnement chiffrées** (Vercel) ; jamais commitées (vérifié : aucun secret dans l'historique Git) |

### 4.4 Gestion de crise et des incidents de sécurité

En cas d'attaque ou de risque avéré, une **procédure en cinq étapes** est définie :

1. **Détection** — alerte (Dependabot, monitoring, signalement utilisateur via *security advisory*).
2. **Confinement** — limiter l'impact : *rollback* du déploiement via Vercel, désactivation d'un compte compromis, révocation des secrets.
3. **Éradication** — corriger la cause (patch de dépendance, correctif de code) sur une branche, validée par la CI.
4. **Restauration** — redéploiement de la version saine et vérification (*smoke test*).
5. **Post-mortem** — analyse de l'incident, mise à jour des bonnes pratiques.

**Communication et escalade :** en cas de **violation de données à caractère personnel**, notification à la **CNIL sous 72 heures** (obligation RGPD) et information des utilisateurs concernés si le risque est élevé. La chaîne d'escalade définit qui est informé (responsable du projet → DPO → autorité), dans quels délais et par quels canaux.

### 4.5 Données personnelles, données sensibles et RGPD

**Données collectées :** nom, adresse e-mail, mot de passe (haché). Ces données relèvent du RGPD.

| Exigence RGPD | Mise en œuvre |
|---------------|---------------|
| Information & transparence | Pages [politique de confidentialité](src/app/(front)/politique-de-confidentialite/) et [mentions légales](src/app/(front)/mentions-legales/) |
| Minimisation | Seules les données nécessaires au compte sont collectées |
| Droit d'accès / rectification | Gestion du compte par l'utilisateur connecté |
| Droit à l'effacement | Fonction de **désactivation / suppression de compte** (administrateur) |
| Sécurité | Hachage, HTTPS, contrôle d'accès (cf. §4.2–4.3) |
| Conservation limitée | Suppression des données à la clôture du compte |

> **Données de santé = données sensibles.** Le module *Tracker d'émotions* manipulerait des **données de santé** (catégorie sensible au sens de l'art. 9 RGPD), exigeant des garanties renforcées (consentement explicite, chiffrement, accès strict). Ce module **ne fait pas partie du périmètre livré** ; cette vigilance est documentée en prévision d'une évolution future.

### 4.6 Bonnes pratiques de développement

- **Type safety de bout en bout** — TypeScript + tRPC + Zod : les erreurs de type sont détectées à la compilation, du client à la base.
- **Qualité automatisée** — ESLint + Prettier ; lint et typecheck bloquants en CI.
- **Tests** — Vitest (unitaires/composants) et Playwright (E2E), exécutés en CI.
- **Revue de code** — toute évolution passe par une Pull Request relue, avec check-list.
- **Gestion des secrets** — hors du dépôt, en variables d'environnement (vérifié).
- **Moindre privilège** — séparation stricte des rôles et des procédures d'accès.

---

## 5. Conclusion

Le projet CesiZen dispose d'une **chaîne de livraison complète et automatisée** (Git → CI → Vercel), d'un **outillage de maintenance** traçable (GitHub Issues, Dependabot configuré) et d'un **dispositif de sécurité** couvrant l'authentification, le contrôle d'accès, le chiffrement, la conformité RGPD et la réponse aux incidents.

Au-delà de la théorie, ce travail a impliqué des actions **concrètes et vérifiées** : remise au vert de l'intégration continue, réduction des vulnérabilités (23 → 8), correction d'un blocage de déploiement réel et gestion d'un incident de montée de version majeure.

**Pistes d'amélioration :** mise en place d'un **monitoring/alerting** (logs, disponibilité), activation de l'analyse statique **CodeQL**, **tests de charge**, et adoption progressive et testée des montées de version majeures (Next.js 16, Prisma 7).

---

## 6. Annexes

- **Annexe A** — Tableau de bord Vercel : déploiement de production réussi.
- **Annexe B** — Règle de protection de la branche `main`.
- **Annexe C** — Exécution réussie du pipeline GitHub Actions (CI verte).
- **Annexe D** — Alertes Dependabot (vulnérabilités identifiées) et tableau de bord sécurité.
- **Annexe E** — Tableau de suivi GitHub Projects et gabarits d'issue.
- **Annexe F** — Branches `develop` / `main` et Release `v1.0.0` (versionnement sémantique).
- **Liens** — Dépôt : https://github.com/lucashelloco/cesiZEN · Production : https://cesi-zen-lucas-projects-0159bd0f.vercel.app

---
