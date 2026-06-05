# Annexes & Soutenance — Bloc 3 CesiZen

> Document d'accompagnement : liste des captures à réaliser + trame de la soutenance orale (20 min).

---

## Partie 1 — Captures d'annexes à réaliser

Réalise ces captures et insère-les dans le dossier (ou en annexe). Pour chacune : l'endroit exact où la prendre et ce qu'elle doit montrer.

| # | Annexe | Où la prendre | Ce qui doit être visible |
|---|--------|---------------|--------------------------|
| A | **Déploiement Vercel réussi** | vercel.com → projet `cesi-zen` → onglet **Deployments** → un déploiement **Production ● Ready** | Statut *Ready*, environnement *Production*, durée du build |
| B | **Protection de branche `main`** | github.com/lucashelloco/cesiZEN → Settings → **Branches** | La règle `main` avec « Require a pull request » + « Require status checks » |
| C | **Pipeline CI verte** | [Run CI de référence](https://github.com/lucashelloco/cesiZEN/actions/runs/27015565068) | Les étapes vertes : Lint, Typecheck, Tests, Build |
| D1 | **Alertes Dependabot** | github.com/lucashelloco/cesiZEN/security/dependabot | La répartition par sévérité (High/Medium/Low) |
| D2 | **Réduction des vulnérabilités** | Terminal : `npm audit` (avant/après) | Le passage de 23 → 8 vulnérabilités |
| E1 | **Gabarits d'issue** | github.com/lucashelloco/cesiZEN/issues/new/choose | Le choix entre « Anomalie » et « Évolution » |
| E2 | **Tableau de suivi (Projects)** | github.com/lucashelloco/cesiZEN → onglet **Projects** | Le board Kanban avec des tickets dans les colonnes |
| F | **Variables d'environnement Vercel** | vercel.com → `cesi-zen` → Settings → Environment Variables | La liste (valeurs masquées « Encrypted ») — montre la gestion sécurisée des secrets |
| G | **En-têtes de sécurité** (optionnel) | Terminal : `curl -I https://cesi-zen-lucas-projects-0159bd0f.vercel.app` | Les en-têtes `Strict-Transport-Security`, `X-Frame-Options`… |

### ⚠️ À préparer avant les captures E1/E2

Actuellement le dépôt n'a **aucune issue** ni **tableau Projects**. Pour que l'annexe « ticketing » soit crédible :

1. **Créer 2-3 issues de démonstration** via les gabarits (1 anomalie + 1 évolution). → *Je peux les créer pour toi en une commande.*
2. **Créer un tableau GitHub Projects** (onglet Projects → New project → Board) et y glisser les issues dans les colonnes *À faire / En cours / Terminé*.

---

## Partie 2 — Trame de soutenance (20 min)

Format : 20 min de présentation + 10 min de questions. Vise ~18 min pour garder une marge.
Conseil : **prépare une démo live** (CI + Vercel) — c'est ce qui marque le plus le jury.

### Déroulé minuté

| Temps | Section | Messages clés |
|-------|---------|---------------|
| **0–2 min** | **1. Introduction & contexte** | Présente CesiZen (santé mentale, 3 modules). Annonce le plan : déployer / maintenir / sécuriser. Montre le schéma de la chaîne Git → CI → Vercel. |
| **2–6 min** | **2. Plan de déploiement** *(le + de points : 10)* | Architecture serverless (justifie : charge variable, coût, exploitation). Les 3 environnements. **DÉMO LIVE** : montre une PR → la CI qui tourne → le déploiement Vercel. Versioning (branches protégées). |
| **6–10 min** | **3. Plan de maintenance** *(9 pts)* | Montre le **board GitHub Issues** + un gabarit. Explique le cycle de vie d'un ticket + la matrice de criticité. Veille : Dependabot + le **retour d'expérience** sur les majeurs (Next 16/Prisma 7) — ça montre du recul. |
| **10–16 min** | **4. Plan de sécurisation** *(11 pts)* | Analyse de risques (OWASP + tes **41 alertes Dependabot réelles**). Mesures : auth/rôles, Zod, Prisma, en-têtes, chiffrement. Action corrective vécue (23→8). Gestion de crise + **RGPD** (pages légales, droits, CNIL 72 h, données de santé sensibles). |
| **16–18 min** | **5. Conclusion** | Bilan : chaîne complète + sécurité réelle. Pistes : monitoring, CodeQL, adoption testée des majeurs. |
| **18–20 min** | Marge / transition Q&A | — |

### Démo live — séquence recommandée (à répéter avant !)
1. Ouvre une **Pull Request** factice (ou montre la #46) → la **CI se déclenche**.
2. Montre les **checks verts** sur la PR.
3. Montre le **déploiement Preview** généré automatiquement.
4. Montre le **dashboard Vercel** (production Ready).
> Prépare un **plan B** (captures) au cas où le wifi/la démo lâche.

### Questions probables du jury — réponses prêtes

| Question | Réponse courte |
|----------|----------------|
| *Pourquoi serverless et pas Docker/un VPS ?* | Charge variable d'une app grand public, scaling auto, exploitation simplifiée, coût à l'usage. Docker reste utilisé pour la base en local. |
| *Comment gères-tu les secrets ?* | Variables d'environnement chiffrées (Vercel), jamais dans le code ; vérifié : aucun secret dans l'historique Git. |
| *Que se passe-t-il si une dépendance a une faille ?* | Dependabot alerte → qualification de criticité → PR de correctif → CI → déploiement. Démontré (23→8). |
| *Comment réagis-tu à une fuite de données ?* | Procédure en 5 étapes (détection→confinement→éradication→restauration→post-mortem) + notification CNIL sous 72 h. |
| *Le RGPD pour des données de santé ?* | Données sensibles (art. 9) → garanties renforcées ; le module concerné (tracker) est hors périmètre, mais la vigilance est documentée. |
| *Comment reviens-tu en arrière en cas de bug en prod ?* | Instant Rollback Vercel (1 clic) + `git revert` côté code. |
| *Ta branche `main` est protégée mais « Not enforced » ?* | Politique définie ; l'enforcement sur dépôt privé nécessite GitHub Pro/Team (Student Pack), la pratique est en place. |

### Erreurs à éviter
- Ne pas lire le dossier mot à mot → parler des **choix** et de leur **justification**.
- Ne pas négliger le temps sur la **sécurité** (domaine le mieux noté : 11 pts).
- Toujours relier une affirmation à une **preuve concrète** (capture/démo).
