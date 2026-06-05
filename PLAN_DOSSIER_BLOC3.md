# Plan détaillé — Dossier Bloc 3
## Déployer et sécuriser les applications informatiques — Projet CesiZen

> Document de travail (sommaire + check-list). Cible : dossier de 15 à 20 pages + soutenance 20 min.
> Stack réelle exploitable : Next.js 15 / TypeScript / PostgreSQL / Prisma / Better Auth / tRPC, versionnée sur GitHub, CI GitHub Actions, déploiement Vercel.

---

## Correspondance barème → sections

| Domaine | Livrable noté | Pts | Section du dossier |
|---------|---------------|-----|--------------------|
| Déploiement | Mise en place des environnements | 2 | §2.2, §2.4 |
| Déploiement | Plan de déploiement | 6 | §2 (tout) |
| Déploiement | Outil de versioning | 2 | §2.3 |
| Maintenance | Outil de gestion des évolutions (ticketing) | 6 | §3.1, §3.2 |
| Maintenance | Évolutivité — veille & méthodo | 3 | §3.3 |
| Sécurisation | Plan de sécurisation | 8 | §4.1 → §4.4 |
| Sécurisation | Données perso, sensibles & RGPD | 2 | §4.5 |
| Sécurisation | Bonnes pratiques de développement | 1 | §4.6 |
| Dossier/soutenance | Qualité | 4 | mise en forme + oral |
| **Total** | | **34** | |

---

## Structure du dossier (≈18 pages)

### Page de garde + Sommaire (1 p.)
- Titre, nom, date, contexte CESI, lien dépôt GitHub + URL Vercel de prod.

### 1. Introduction & contexte (1 p.)
- 1.1 Rappel du projet CesiZen (santé mentale, modules livrés : Comptes, Informations, Exercice cardiaque).
- 1.2 Périmètre du Bloc 3 : déployer + maintenir + sécuriser.
- 1.3 Vue d'ensemble de la chaîne (schéma : Dev → Git → CI → Vercel → Prod).

### 2. PLAN DE DÉPLOIEMENT (6 p.) — 10 pts
- **2.1 Architecture cible** — schéma d'archi : client (PWA Next.js), serveur (Vercel serverless / edge), base PostgreSQL managée (Neon), services (GitHub OAuth). Dimensionnement justifié (grand public, charge variable → serverless qui scale).
- **2.2 Les trois environnements** — tableau comparatif :
  | | Développement | Test / Preview | Production |
  |--|--|--|--|
  | Hébergement | localhost | Vercel Preview (par PR) | Vercel Prod |
  | Base | PostgreSQL local / Docker | branche Neon de test | Neon prod |
  | Déclencheur | `npm run dev` | push sur branche / PR | merge sur `main` |
  | Données | seed | jeu de test anonymisé | réelles |
  - → **un environnement réellement mis en place** (exigé) : décrire le déploiement Vercel de prod, captures.
- **2.3 Versioning des sources** — Git/GitHub : modèle de branches (`main` protégée, `feature/*`), convention de commits, PR + revue, protection de branche. Versionnement de la doc dans le repo. (Bonus : SemVer + tags de release.)
- **2.4 Automatisation & intégration continue** — pipeline `.github/workflows/ci.yml` : lint → typecheck → migrations Prisma → build, sur chaque push/PR. CD Vercel auto sur `main`. Schéma du pipeline + capture d'un run vert.
- **2.5 Ressources nécessaires** — comptes/services (GitHub, Vercel, Neon), coûts (tiers gratuits), variables d'environnement & secrets (où/comment stockés).
- **2.6 Procédure de déploiement pas à pas** — check-list ordonnée (config secrets → migration BDD → build → smoke test → bascule), + procédure de rollback.

### 3. PLAN DE MAINTENANCE (4 p.) — 9 pts
- **3.1 Outil de ticketing** — choix justifié : **GitHub Issues + Projects** (intégré au repo, gratuit, traçable). Templates d'issues (bug / évolution), labels (`bug`, `enhancement`, `priority:high`…), workflow board (To do → In progress → Done).
- **3.2 Méthodologie anomalies & évolutions** — cycle de vie d'un ticket : déclaration → qualification (criticité) → priorisation → correction sur branche → PR + tests → revue → merge → déploiement → clôture. Matrice de criticité/priorité. Lien avec la CI (rien ne merge sans pipeline vert).
- **3.3 Veille technologique & pérennité** — méthodo de veille (sources : releases GitHub des dépendances, Dependabot/`npm audit`, blogs Next.js/Prisma, OWASP). Fréquence, outils, comment ça nourrit le backlog. Stratégie de mise à jour des dépendances.

### 4. PLAN DE SÉCURISATION (5-6 p.) — 11 pts
- **4.1 Analyse des vulnérabilités, risques & criticité** — tableau de risques (menace → vulnérabilité → impact → probabilité → criticité → mesure). Appui sur l'**OWASP Top 10** (injection, broken auth, XSS, CSRF, exposition de données…). 
- **4.2 Actions préventives & correctives en place** — auth (Better Auth, hash de mot de passe), contrôle d'accès par rôle (USER/ADMIN, `protectedProcedure`/`adminProcedure`), validation des entrées (Zod), ORM paramétré (Prisma → anti-injection SQL), middleware ([src/middleware.ts](src/middleware.ts)), en-têtes de sécurité, HTTPS (Vercel).
- **4.3 Solutions de chiffrement & cryptage** — en transit (TLS/HTTPS partout), au repos (chiffrement Neon), mots de passe (hash), secrets (variables d'env chiffrées Vercel, jamais commitées).
- **4.4 Gestion de crise / incident de sécurité** — méthodologie : détection → confinement → éradication → restauration → post-mortem. Plan de communication & escalade (qui prévient qui, délais), notification CNIL (72 h) en cas de fuite de données perso.
- **4.5 Données personnelles & RGPD** — données collectées (email, nom, mot de passe), base légale, durée de conservation, droits (accès/rectification/suppression → fonction désactivation/suppression de compte déjà présente), pages [politique-de-confidentialite](src/app/(front)/politique-de-confidentialite/) & [mentions-legales](src/app/(front)/mentions-legales/). Données de santé = sensibles → vigilance accrue (le tracker d'émotions n'est pas dans le périmètre livré, à mentionner).
- **4.6 Bonnes pratiques de développement** — type safety bout-en-bout (TS + tRPC + Zod), lint/format (ESLint/Prettier), tests (Vitest + Playwright), revue de code obligatoire, secrets hors du repo, principe du moindre privilège.

### 5. Conclusion (0,5 p.)
- Synthèse, limites, pistes d'amélioration (monitoring/alerting, tests de charge, WAF…).

### Annexes (hors pagination si possible)
- Captures : run CI vert, dashboard Vercel, board GitHub Issues, template d'issue.
- Liens : dépôt, URL prod.

---

## Check-list technique à mettre en place (le « concret » exigé)

| # | Élément | Statut | Action |
|---|---------|--------|--------|
| 1 | Versioning Git + GitHub | ✅ existant | Documenter + activer protection de branche `main` |
| 2 | CI (lint/typecheck/build/migrations) | ✅ existant | Captures + éventuellement ajouter étape tests |
| 3 | CD Vercel auto sur `main` | ✅ existant | Captures dashboard |
| 4 | **Templates GitHub Issues** (bug + évolution) | ❌ à créer | `.github/ISSUE_TEMPLATE/` |
| 5 | **Labels de priorité/criticité** | ❌ à créer | via `gh` ou UI |
| 6 | **Template de Pull Request** | ❌ à créer | `.github/pull_request_template.md` |
| 7 | **Dependabot** (veille dépendances) | ⚠️ à vérifier | `.github/dependabot.yml` |
| 8 | Étape tests dans la CI | ⚠️ optionnel | ajouter `npm run test:run` au pipeline |
| 9 | Documenter procédure de déploiement | ❌ à créer | section dossier + capture |
| 10 | Vérifier en-têtes de sécurité (next.config) | ⚠️ à vérifier | `headers()` dans next.config |

---

## Plan de la soutenance (20 min) — rappel
1. Contexte & objectifs (2 min)
2. Démo live : pipeline CI + déploiement Vercel (4 min)
3. Plan de déploiement & environnements (4 min)
4. Maintenance & ticketing (démo board) (4 min)
5. Sécurisation & RGPD (5 min)
6. Conclusion (1 min)
