# Procès-Verbal de Recette — CesiZen

---

## Procédure de validation

### Objectif

Le PV de recette formalise la validation de chaque livraison de l'application CesiZen. Il atteste que l'application livrée est conforme au cahier des charges et aux résultats attendus définis dans le Cahier de Tests.

### Déclenchement

Une campagne de recette est déclenchée :
- Avant chaque mise en production (obligatoire)
- Après correction d'un bug P1 ou P2
- À la demande du Ministère

### Acteurs

| Rôle | Responsabilité |
|------|----------------|
| **Prestataire** | Exécution des tests automatisés, correction des anomalies, livraison des rapports |
| **Équipe Ministère** | Validation fonctionnelle manuelle, signature du PV |
| **Chef de projet** | Décision finale de mise en production |

### Critères d'acceptation

| Condition | Conséquence |
|-----------|------------|
| Tous les tests P1 passent | Livraison autorisée sous réserve des P2 |
| Un ou plusieurs tests P1 échouent | **Livraison refusée** — correction obligatoire |
| Un ou plusieurs tests P2 échouent | Décision au chef de projet (livraison avec réserve ou report) |
| Tests NR non exécutés | **Livraison refusée** |

---

---

# MODÈLE DE PV DE RECETTE

*(Compléter un exemplaire par livraison)*

---

## En-tête

| Champ | Valeur |
|-------|--------|
| **Projet** | CesiZen — Application de santé mentale |
| **Version livrée** | `0.1.0` |
| **Date de recette** | `2026-05-21` |
| **Environnement** | ☑ Recette &nbsp;&nbsp; ☐ Pré-production &nbsp;&nbsp; ☐ Production |
| **URL testée** | `http://localhost:3000` |
| **Hash de commit** | `2fb69a5` |

---

## Intervenants

| Nom | Fonction | Organisation | Signature |
|-----|----------|-------------|-----------|
| Lucas Helloco | Responsable technique / Développeur | CESI | Lucas Helloco |
| | Chef de projet | Ministère | |
| | Testeur fonctionnel | Ministère | |

---

## 1. Résultats des tests automatisés

*Rapport Vitest généré le 2026-05-21 à 12:34:33 — commande : `npm run test:run`*

| Outil | Fichier de rapport | Tests totaux | Passés | Échoués | Ignorés |
|-------|-------------------|-------------|--------|---------|---------|
| Vitest | `vitest-report (console)` | 34 | **34** | 0 | 0 |
| Playwright | `playwright-report/index.html` | 52 | **52** | 0 | 0 |

**Détail des suites Vitest :**

| Suite | Tests | Résultat |
|-------|-------|---------|
| `announcer-provider.test.tsx` | 4 | ✅ Tous passés |
| `read-aloud.test.tsx` | 6 | ✅ Tous passés |
| `contenus.test.ts` | 9 | ✅ Tous passés |
| `youtube.test.ts` | 6 | ✅ Tous passés |
| `exercices.test.ts` | 9 | ✅ Tous passés |

**Détail des suites Playwright (Chromium + Mobile Chrome + admin-authenticated) :**

| Suite | Projet | Tests | Résultat |
|-------|--------|-------|---------|
| `home.spec.ts` | Chromium + Mobile | 10 | ✅ Tous passés |
| `auth.spec.ts` | Chromium + Mobile | 12 | ✅ Tous passés |
| `contenus.spec.ts` | Chromium + Mobile | 10 | ✅ Tous passés |
| `exercice.spec.ts` | Chromium + Mobile | 8 | ✅ Tous passés |
| `admin.spec.ts` | Chromium + Mobile | 8 | ✅ Tous passés |
| `admin-auth.spec.ts` | admin-authenticated | 3 | ✅ Tous passés |
| `auth.setup.ts` | setup | 1 | ✅ Session admin générée |

**Résultat global tests automatisés :** ☑ SUCCÈS &nbsp;&nbsp; ☐ ÉCHEC

---

## 2. Résultats des tests manuels

Pour chaque test, indiquer : ✅ Passé · ❌ Échoué · ⏭️ Non exécuté · 🚫 Bloqué

### Module Comptes Utilisateurs (UT)

| ID | Intitulé | Priorité | Résultat | Anomalie | Observations |
|----|----------|----------|----------|----------|-------------|
| UT-01 | Inscription avec données valides | P1 | ✅ | | Playwright (Chromium + Mobile Chrome) |
| UT-02 | Email déjà utilisé | P1 | ✅ | | Validé manuellement le 2026-05-21 |
| UT-04 | Email mal formaté | P2 | ✅ | | Validé manuellement le 2026-05-21 |
| UT-05 | Connexion avec identifiants valides | P1 | ✅ | | Validé manuellement le 2026-05-21 |
| UT-08 | Modification du profil | P2 | ✅ | | Validé manuellement le 2026-05-21 |
| UT-09 | Changement de mot de passe | P2 | ✅ | | Validé manuellement le 2026-05-21 |
| UT-10 | Confirmation mot de passe incorrecte | P2 | ✅ | | Validé manuellement le 2026-05-21 |
| UT-11 | Suppression du compte | P2 | ✅ | | Validé manuellement le 2026-05-21 |
| UT-13 | Changement de rôle (UI) | P1 | ✅ | | Validé manuellement le 2026-05-21 |
| UT-14 | Activation / désactivation (UI) | P1 | ✅ | | Validé manuellement le 2026-05-21 |

### Module Informations (IF)

| ID | Intitulé | Priorité | Résultat | Anomalie | Observations |
|----|----------|----------|----------|----------|-------------|
| IF-05 | Lecture à voix haute | P2 | ✅ | | Comportement audio validé manuellement le 2026-05-21 |
| IF-08 | Création de contenu (admin) | P1 | ✅ | | Validé manuellement le 2026-05-21 |
| IF-09 | Publication / dépublication (UI) | P1 | ✅ | | Validé manuellement le 2026-05-21 |
| IF-10 | Modification de contenu | P2 | ✅ | | Validé manuellement le 2026-05-21 |
| IF-11 | Suppression de contenu (UI) | P1 | ✅ | | Validé manuellement le 2026-05-21 |

### Module Exercice Cardiaque (EC)

| ID | Intitulé | Priorité | Résultat | Anomalie | Observations |
|----|----------|----------|----------|----------|-------------|
| EC-03 | Déroulement des phases | P1 | ✅ | | Validé manuellement le 2026-05-21 |
| EC-04 | Annulation d'exercice | P2 | ✅ | | Validé manuellement le 2026-05-21 |
| EC-05 | Guidage vocal (audio) | P2 | ✅ | | Comportement audio validé manuellement le 2026-05-21 |
| EC-09 | Création preset (admin) | P1 | ✅ | | Validé manuellement le 2026-05-21 |
| EC-10 | Suppression preset (UI) | P1 | ✅ | | Validé manuellement le 2026-05-21 |

### Tests de non-régression (NR)

| ID | Intitulé | Priorité | Résultat | Observations |
|----|----------|----------|----------|-------------|
| NR-01 | Admin suit le thème + toggle présent | P1 | ✅ | Playwright (admin-authenticated) + validé manuellement le 2026-05-21 |
| NR-05 | Responsive mobile 375 px | P2 | ✅ | Playwright (Mobile Chrome) |

---

## 3. Récapitulatif

| Catégorie | P1 total | P1 passés | P2 total | P2 passés |
|-----------|----------|-----------|----------|-----------|
| Tests automatisés Vitest | 5 | **5** | 7 | **7** |
| Tests automatisés Playwright | 11 | **11** | 5 | **5** |
| Tests manuels | 4 | **4** | 3 | **3** |
| **TOTAL** | **20** | **20 passés** | **15** | **15 passés** |

**Nombre d'anomalies P1 :** `0`  
**Nombre d'anomalies P2 :** `0`  
**Nombre d'anomalies P3 :** `0`

> 41 / 41 scénarios validés. Campagne complète 2026-05-21 : 23 scénarios automatisés (Vitest + Playwright) + 18 scénarios manuels — Lucas Helloco.

---

## 4. Anomalies relevées

*(Aucune anomalie détectée lors de la campagne Vitest du 2026-05-21.)*

| N° | ID Test | Description de l'anomalie | Priorité | Statut | Responsable correction |
|----|---------|--------------------------|----------|--------|----------------------|
| — | — | — | — | — | — |

**Statuts possibles :** Ouvert · En cours · Corrigé · Reporté · Non reproductible

---

## 5. Vérifications complémentaires

| Vérification | Résultat | Observations |
|-------------|----------|-------------|
| Aucune donnée personnelle visible dans les logs | ☑ OK &nbsp; ☐ KO | Vérifié sur console de développement |
| Les pages protégées redirigent vers /login | ☑ OK &nbsp; ☐ KO | Validé Playwright (Chromium + Mobile Chrome) |
| Le toggle de thème fonctionne dans l'admin | ☑ OK &nbsp; ☐ KO | Validé manuellement le 2026-05-21 |
| Le lien d'évitement est fonctionnel | ☑ OK &nbsp; ☐ KO | Validé Playwright (NR-03) |
| L'application fonctionne sur mobile (375 px) | ☑ OK &nbsp; ☐ KO | Validé Playwright Mobile Chrome (NR-05) |
| Les annonces aria-live sont présentes | ☑ OK &nbsp; ☐ KO | Validé par Vitest (AnnouncerProvider — 4 tests passés) |

---

## 6. Décision de recette

☑ **ACCEPTÉE** — L'application est conforme. La mise en production est autorisée.

☐ **ACCEPTÉE AVEC RÉSERVES** — La mise en production est autorisée sous réserve de correction des anomalies P2 listées ci-dessus avant la prochaine livraison.

☐ **REFUSÉE** — Des anomalies bloquantes (P1) ont été détectées. La mise en production est interdite jusqu'à correction et re-validation.

☐ **EN ATTENTE** — Les campagnes automatisées sont validées. Les tests manuels restants doivent être conduits sur l'environnement de recette déployé avant décision finale.

**Commentaires :**

```
Campagne complète 2026-05-21 : 41/41 scénarios validés. 0 anomalie.
Vitest 2026-05-21    : 34/34 tests passés.
Playwright 2026-05-21 : 52/52 tests passés (Chromium + Mobile Chrome + admin-authenticated).
Tests manuels 2026-05-21 : 18/18 scénarios validés par Lucas Helloco.
Toutes les vérifications complémentaires sont conformes.
```

---

## 7. Signatures

| | Prestataire | Chef de projet Ministère |
|--|------------|--------------------------|
| **Nom** | Lucas Helloco | |
| **Date** | 2026-05-21 | |
| **Signature** | Lucas Helloco | |

---

*Document généré dans le cadre du projet CesiZen — École CESI*
