# Comparatif des solutions techniques — CesiZen

**Version :** 1.0  
**Date :** 2026-05-21  
**Contexte :** Choix de la stack technique pour l'application CesiZen  

---

## 1. Présentation des solutions étudiées

Trois architectures ont été étudiées avant de retenir la T3 Stack. Elles représentent les approches les plus répandues pour une application web full-stack en 2025 : une stack full JavaScript orientée type safety, une stack JavaScript classique avec API REST découplée, et une stack PHP+JavaScript hybride populaire dans l'enseignement français.

| | Solution A | Solution B | Solution C |
|--|-----------|-----------|-----------|
| **Nom** | **T3 Stack** | **MERN Stack** | **Laravel + Vue 3** |
| **Langage back** | TypeScript | JavaScript | PHP 8 |
| **Langage front** | TypeScript | JavaScript/TypeScript | TypeScript |
| **Framework front** | Next.js 15 | React (Vite SPA) | Vue 3 + Inertia.js |
| **Framework back** | Next.js API Routes | Express.js | Laravel 11 |
| **Base de données** | PostgreSQL | MongoDB | MySQL / PostgreSQL |
| **ORM** | Prisma | Mongoose | Eloquent |
| **Communication** | tRPC | REST API JSON | Inertia.js (SSR) |
| **Auth** | Better Auth | JWT maison / Passport.js | Laravel Breeze/Sanctum |
| **Style** | Tailwind CSS | Tailwind / Material UI | Tailwind CSS |
| **Architecture** | Full-stack monorepo | API + SPA découplés | Monolithique MVC |

---

## 2. Critères d'évaluation

Les critères ont été définis en tenant compte du contexte du projet : équipe de taille réduite, délai court, application devant garantir la confidentialité des données de santé mentale.

| # | Critère | Pondération | Description |
|---|---------|------------|-------------|
| C1 | **Type safety end-to-end** | ×4 | Cohérence des types du modèle de données jusqu'à l'interface |
| C2 | **Productivité / DX** | ×4 | Vitesse de développement, hot-reload, outillage |
| C3 | **Sécurité** | ×4 | Auth, validation des entrées, protection des routes |
| C4 | **Performance** | ×3 | SSR, temps de chargement initial, optimisation réseau |
| C5 | **Courbe d'apprentissage** | ×3 | Accessibilité pour un développeur junior/intermédiaire |
| C6 | **Facilité de déploiement** | ×3 | Hébergement, CI/CD, variables d'environnement |
| C7 | **Écosystème / communauté** | ×2 | Packages disponibles, documentation, pérennité |
| C8 | **Testabilité** | ×2 | Facilité d'écriture et d'automatisation des tests |
| C9 | **Support PWA** | ×1 | Progressive Web App, service worker, offline |
| C10 | **Scalabilité** | ×1 | Capacité à évoluer si le projet grandit |

**Barème :** 1 = Insuffisant · 2 = Moyen · 3 = Bien · 4 = Très bien · 5 = Excellent

---

## 3. Analyse détaillée par critère

### C1 — Type safety end-to-end (×4)

La sécurité des types est critique pour une application manipulant des données personnelles de santé. Une incohérence de type entre le backend et le frontend peut exposer des données sensibles ou provoquer des crashs silencieux.

**T3 Stack (5/5)**  
tRPC génère automatiquement les types TypeScript côté client à partir des routers serveur. Toute modification du schéma Prisma se propage à la chaîne : base de données → types Prisma → router tRPC → composants React. Si un champ est renommé en base, le compilateur TypeScript signale l'erreur partout dans le code avant même l'exécution. Il n'y a aucune couche de génération de code manuelle (pas de Swagger, pas de schéma OpenAPI).

**MERN Stack (2/5)**  
Sans contrat de typage entre le backend Express et le frontend React, les types doivent être maintenus manuellement en deux endroits. Les erreurs de désynchronisation (ex. : `user.firstName` en backend devenu `user.first_name` en frontend) ne sont détectées qu'à l'exécution. Des outils comme Zod ou Yup peuvent partiellement combler ce manque mais nécessitent un effort d'intégration supplémentaire.

**Laravel + Vue 3 (3/5)**  
Laravel dispose d'une validation robuste côté serveur (Form Requests). Inertia.js transmet les données de Laravel à Vue avec un partage de props structuré, mais les types doivent être déclarés manuellement côté Vue. Des packages comme `laravel-typescript-transformer` existent mais restent optionnels et peu standardisés.

---

### C2 — Productivité / DX (×4)

**T3 Stack (5/5)**  
Un seul dépôt, un seul langage (TypeScript partout), un seul processus de développement (`npm run dev`). Le hot-reload Turbopack de Next.js 15 est extrêmement rapide. La CLI `create-t3-app` génère un projet configuré en quelques minutes. Prisma Studio offre une interface graphique pour inspecter la base de données. L'absence de génération de code intermédiaire (pas d'OpenAPI, pas de client HTTP à générer) réduit la friction.

**MERN Stack (3/5)**  
Deux processus à lancer simultanément (backend Express + frontend Vite), deux `package.json`, deux configurations ESLint/TypeScript. L'organisation des appels API côté client est laissée à la discrétion du développeur (fetch natif, Axios, React Query…), ce qui génère du code boilerplate. La liberté est totale mais implique des décisions d'architecture chronophages.

**Laravel + Vue 3 (4/5)**  
Laravel Artisan offre une excellente productivité : génération de modèles, migrations, controllers en une ligne. Inertia.js simplifie le rendu serveur. L'environnement PHP peut cependant ralentir le démarrage (configuration Composer, PHP-FPM, Apache/Nginx). La cohabitation de deux langages (PHP + TypeScript) alourdit la maintenance.

---

### C3 — Sécurité (×4)

**T3 Stack (5/5)**  
Better Auth est une bibliothèque d'authentification moderne, maintenue activement, qui gère nativement les sessions sécurisées, le hachage de mot de passe (bcrypt), la vérification d'email et l'OAuth. La validation des entrées est réalisée systématiquement avec Zod dans chaque procédure tRPC — une procédure sans schéma Zod ne peut tout simplement pas recevoir d'entrée non validée. La protection des routes admin est centralisée dans le middleware tRPC (`adminProcedure`).

**MERN Stack (2/5)**  
La sécurité repose entièrement sur les choix du développeur : bibliothèque JWT, hachage bcrypt manuel, middleware de validation. L'absence de standard impose un niveau d'expertise plus élevé pour éviter les vulnérabilités classiques (injection NoSQL avec MongoDB, JWT exposé dans localStorage, CORS mal configuré).

**Laravel + Vue 3 (5/5)**  
Laravel excelle en sécurité : protection CSRF native, hachage bcrypt intégré, ORM Eloquent résistant aux injections SQL, authentification complète via Breeze/Sanctum. C'est l'un des frameworks PHP les plus sécurisés par défaut. Score équivalent à T3 sur ce critère.

---

### C4 — Performance (×3)

**T3 Stack (5/5)**  
Next.js 15 propose le rendu serveur (SSR), la génération statique (SSG), le streaming et les React Server Components. Les pages de contenu sont rendues côté serveur — le premier affichage est quasi-instantané même sans JavaScript. Le cache de l'App Router permet d'optimiser les requêtes répétitives. tRPC utilise React Query en interne : les données sont mises en cache côté client automatiquement.

**MERN Stack (3/5)**  
L'architecture SPA (Single Page Application) avec Vite implique un bundle JavaScript chargé intégralement au premier accès, ce qui pénalise le Time to First Contentful Paint. Le SSR est possible avec des solutions comme Remix ou Next.js mais sort du cadre MERN standard. Les performances sont bonnes une fois l'application chargée mais moins optimales pour le référencement et l'accessibilité.

**Laravel + Vue 3 (4/5)**  
Inertia.js assure le rendu initial côté serveur (les données HTML sont présentes dès la première réponse HTTP), ce qui est favorable aux performances perçues. Laravel dispose d'un système de cache (Redis, Memcached) mature. Légèrement pénalisé par l'overhead PHP par rapport à un runtime Node.js sur des charges élevées.

---

### C5 — Courbe d'apprentissage (×3)

**T3 Stack (3/5)**  
TypeScript strict, React avec hooks, Server Components, tRPC, Prisma, Next.js App Router — la somme des concepts est élevée. Un développeur débutant peut être déstabilisé par la distinction Server/Client Components ou la configuration du contexte tRPC. En revanche, une fois les bases acquises, la cohérence du système accélère le développement.

**MERN Stack (4/5)**  
JavaScript est le langage le plus enseigné. La séparation claire backend/frontend est intuitive. Express.js est minimaliste et bien documenté. MongoDB et son schéma flexible réduisent la charge cognitive liée aux migrations. C'est la stack la plus accessible pour un développeur junior.

**Laravel + Vue 3 (4/5)**  
Laravel est réputé pour sa documentation exemplaire (Laravel Docs, Laracasts). PHP est enseigné dans de nombreuses formations françaises dont CESI. Vue 3 est plus accessible que React pour les débutants grâce à sa syntaxe HTML-like. Inertia.js peut être déroutant au premier abord mais simplifie finalement l'architecture.

---

### C6 — Facilité de déploiement (×3)

**T3 Stack (5/5)**  
Vercel, l'hébergeur créé par l'équipe Next.js, déploie l'application en quelques clics depuis GitHub avec zéro configuration. Les variables d'environnement se gèrent depuis l'interface. Les preview deployments automatiques sur chaque Pull Request sont inclus. Pour une base de données PostgreSQL, Neon offre un tier gratuit avec connexion poolée native pour Prisma.

**MERN Stack (3/5)**  
Le backend Express nécessite un hébergeur Node.js (Railway, Render, Heroku, VPS). Le frontend React peut être déployé sur Vercel/Netlify. Deux déploiements à gérer, deux URLs, configuration CORS entre les deux. La complexité opérationnelle est sensiblement plus élevée.

**Laravel + Vue 3 (3/5)**  
Nécessite un serveur PHP (PHP-FPM + Nginx/Apache). Les hébergeurs mutualisés supportent PHP mais pas toujours les versions récentes. Les solutions modernes comme Laravel Forge ou Laravel Vapor simplifient le déploiement mais impliquent un coût supplémentaire. La migration d'un hébergement Laravel est plus complexe qu'une application Node.js.

---

### C7 — Écosystème / communauté (×2)

**T3 Stack (4/5)**  
Next.js est le framework React le plus utilisé en production (Vercel, The Guardian, Hulu…). tRPC et Prisma ont des communautés actives et croissantes. L'écosystème npm est le plus grand registre de packages au monde. Quelques incertitudes sur la stabilité des API Next.js (App Router étant relativement récent à l'époque du projet).

**MERN Stack (5/5)**  
React est la bibliothèque frontend la plus utilisée. Express.js est le serveur HTTP Node.js de référence. MongoDB a une communauté massive. L'écosystème est très mature avec une quantité de ressources, tutoriels et exemples sans égal.

**Laravel + Vue 3 (4/5)**  
Laravel est le framework PHP le plus populaire. Vue.js est particulièrement bien adopté en France et en Europe. La documentation est réputée comme la meilleure du secteur. L'écosystème PHP est plus restreint que npm mais suffisant pour les besoins du projet.

---

### C8 — Testabilité (×2)

**T3 Stack (5/5)**  
Vitest s'intègre nativement à l'écosystème Vite/TypeScript. Les procedures tRPC sont testables unitairement avec un contexte mocké (sans serveur HTTP). React Testing Library teste les composants de façon comportementale. Playwright couvre les tests E2E. La séparation logique entre procédures serveur et composants client facilite l'isolation des tests.

**MERN Stack (3/5)**  
Jest est l'outil standard pour le backend Express et le frontend React, mais la configuration diffère entre les deux parties du projet. Les tests d'intégration nécessitent une instance MongoDB de test (ou un mock comme `mongodb-memory-server`). La liberté architecturale de MERN peut rendre les tests plus difficiles si le code n'a pas été pensé pour la testabilité dès le départ.

**Laravel + Vue 3 (4/5)**  
Laravel dispose d'un framework de tests intégré (PHPUnit + Laravel Testing), d'un support natif pour les tests d'API (JSON assertions), et d'une base de données de test in-memory (SQLite). Dusk couvre les tests E2E. Vitest/Vue Test Utils couvrent le frontend. La séparation des préoccupations d'Eloquent facilite les tests unitaires.

---

### C9 — Support PWA (×1)

**T3 Stack (5/5)**  
`next-pwa` s'intègre en quelques lignes dans `next.config.js` et génère automatiquement le service worker. L'API Metadata de Next.js gère le manifeste. Le support offline, le cache agressif et l'installation sur mobile sont disponibles sans configuration complexe.

**MERN Stack (3/5)**  
Vite propose `vite-plugin-pwa` qui est bien intégré pour une SPA. La gestion du cache est plus simple que dans un contexte SSR. Cependant, une SPA pure a des limitations pour le PWA offline (toute la logique métier est côté client).

**Laravel + Vue 3 (3/5)**  
Le PWA est possible via `vite-plugin-pwa` sur la partie Vue, mais l'intégration avec le rendu serveur Laravel/Inertia nécessite des ajustements. La gestion du cache offline est plus complexe avec un backend PHP.

---

### C10 — Scalabilité (×1)

**T3 Stack (4/5)**  
Next.js supporte le déploiement serverless (Vercel Edge Functions) et les architectures distribuées. Prisma gère les connections poolées avec PgBouncer. L'architecture peut évoluer vers des microservices si nécessaire, tRPC étant remplaçable par une API REST ou GraphQL sans changer la base de code React.

**MERN Stack (4/5)**  
Node.js est réputé pour sa scalabilité horizontale (modèle événementiel non-bloquant). MongoDB scale horizontalement par sharding. L'indépendance backend/frontend permet de scaler chaque partie séparément.

**Laravel + Vue 3 (3/5)**  
Laravel scale verticalement plus facilement qu'horizontalement. PHP nécessite une attention particulière pour la gestion des connexions sous forte charge (PHP-FPM, Redis pour les sessions). Laravel Octane (Swoole/RoadRunner) améliore les performances mais complexifie l'infrastructure.

---

## 4. Tableau de synthèse

| Critère | Pond. | T3 Stack | MERN Stack | Laravel + Vue 3 |
|---------|:-----:|:--------:|:----------:|:---------------:|
| C1 — Type safety | ×4 | **5** (20) | 2 (8) | 3 (12) |
| C2 — Productivité | ×4 | **5** (20) | 3 (12) | 4 (16) |
| C3 — Sécurité | ×4 | **5** (20) | 2 (8) | 5 (20) |
| C4 — Performance | ×3 | **5** (15) | 3 (9) | 4 (12) |
| C5 — Apprentissage | ×3 | 3 (9) | **4** (12) | **4** (12) |
| C6 — Déploiement | ×3 | **5** (15) | 3 (9) | 3 (9) |
| C7 — Écosystème | ×2 | 4 (8) | **5** (10) | 4 (8) |
| C8 — Testabilité | ×2 | **5** (10) | 3 (6) | 4 (8) |
| C9 — PWA | ×1 | **5** (5) | 3 (3) | 3 (3) |
| C10 — Scalabilité | ×1 | 4 (4) | **4** (4) | 3 (3) |
| **TOTAL PONDÉRÉ** | | **126 / 140** | **81 / 140** | **103 / 140** |

---

## 5. Visualisation des scores

```
T3 Stack       ████████████████████████████████████████████░░  126/140
Laravel+Vue3   ██████████████████████████████████░░░░░░░░░░░░  103/140
MERN Stack     ████████████████████████████░░░░░░░░░░░░░░░░░░   81/140
```

---

## 6. Argumentation du choix final — T3 Stack

### 6.1 Le critère discriminant : la type safety end-to-end

L'application CesiZen manipule des données à caractère personnel de santé mentale. Toute erreur de type non détectée (champ inexistant, mauvais format de date, rôle utilisateur mal transmis) peut exposer des données sensibles ou produire un comportement incorrect sur des fonctionnalités critiques (contrôle d'accès admin, sauvegarde d'exercices).

La T3 Stack résout ce problème structurellement : le schéma Prisma est la **source de vérité unique**. Les types générés par Prisma alimentent tRPC qui génère automatiquement les types côté client. Si une modification du modèle de données est incompatible avec un composant React, le compilateur TypeScript l'indique immédiatement, avant tout test, avant tout déploiement.

Avec la MERN Stack ou Laravel + Vue 3, cette cohérence doit être maintenue manuellement entre deux couches technologiques différentes — une source de bugs potentiels en équipe.

### 6.2 Un seul langage, un seul dépôt

Développer à la fois le backend (tRPC routers, Prisma), le frontend (React, Next.js) et les tests (Vitest, Playwright) en TypeScript dans un seul monorepo présente des avantages concrets :

- **Un seul environnement** à configurer et à maintenir (Node.js, npm)
- **Un seul pipeline CI/CD** pour les tests et le déploiement
- **Partage de code** entre client et serveur sans duplication (types, constantes, utilitaires)
- **Onboarding** simplifié : un nouveau développeur maîtrisant TypeScript peut intervenir sur n'importe quelle couche

### 6.3 Le déploiement comme avantage stratégique

Pour un projet pédagogique avec des contraintes de temps, la capacité à déployer en quelques minutes est décisive. La combinaison Next.js + Vercel + Neon (PostgreSQL) offre :

- Déploiement automatique sur chaque push GitHub
- Preview URL par Pull Request
- Base de données PostgreSQL avec tier gratuit
- Variables d'environnement gérées depuis une interface web
- Zéro configuration serveur

Cette simplicité opérationnelle libère du temps pour le développement fonctionnel.

### 6.4 Reconnaissance des limites

La T3 Stack présente des points de friction réels qui ont été pris en compte :

| Limite | Impact | Mitigation |
|--------|--------|-----------|
| Courbe d'apprentissage élevée | Ralentissement initial | Documentation officielle complète, exemples T3 nombreux |
| App Router Next.js récent | Quelques comportements instables | Veille active, mise à jour régulière |
| tRPC peu connu des recruteurs vs REST | Moindre visibilité sur CV | Compétences React/TypeScript/Prisma transférables |
| Couplage fort Vercel/Next.js | Risque de vendor lock-in | Next.js reste déployable sur tout serveur Node.js |

### 6.5 Conclusion

La T3 Stack s'impose comme le choix le plus cohérent avec les exigences du projet CesiZen :

> **Fiabilité** (type safety) · **Rapidité** (monorepo, un langage) · **Simplicité de livraison** (Vercel) · **Maintenabilité long terme** (tests automatisés, TypeScript strict)

Laravel + Vue 3 aurait été un choix défendable — sécurité équivalente, courbe d'apprentissage plus douce — mais le changement de langage PHP → TypeScript entre backend et frontend reste un frein à la cohérence de la codebase. La MERN Stack, malgré sa popularité pédagogique, ne répond pas suffisamment aux exigences de sécurité et de type safety pour une application manipulant des données de santé.
