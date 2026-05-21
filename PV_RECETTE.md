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
| **Version livrée** | `_______________` |
| **Date de recette** | `_______________` |
| **Environnement** | ☐ Recette &nbsp;&nbsp; ☐ Pré-production &nbsp;&nbsp; ☐ Production |
| **URL testée** | `_______________` |
| **Hash de commit** | `_______________` |

---

## Intervenants

| Nom | Fonction | Organisation | Signature |
|-----|----------|-------------|-----------|
| | Responsable technique | Prestataire | |
| | Chef de projet | Ministère | |
| | Testeur fonctionnel | Ministère | |

---

## 1. Résultats des tests automatisés

*Joindre le rapport Vitest (`npm run test:run`) et le rapport Playwright (`npm run test:e2e`) en annexe.*

| Outil | Fichier de rapport | Tests totaux | Passés | Échoués | Ignorés |
|-------|-------------------|-------------|--------|---------|---------|
| Vitest | `vitest-report.html` | | | | |
| Playwright | `playwright-report/index.html` | | | | |

**Résultat global tests automatisés :** ☐ SUCCÈS &nbsp;&nbsp; ☐ ÉCHEC

---

## 2. Résultats des tests manuels

Pour chaque test, indiquer : ✅ Passé · ❌ Échoué · ⏭️ Non exécuté · 🚫 Bloqué

### Module Comptes Utilisateurs (UT)

| ID | Intitulé | Priorité | Résultat | Anomalie | Observations |
|----|----------|----------|----------|----------|-------------|
| UT-01 | Inscription avec données valides | P1 | | | |
| UT-02 | Email déjà utilisé | P1 | | | |
| UT-04 | Email mal formaté | P2 | | | |
| UT-05 | Connexion avec identifiants valides | P1 | | | |
| UT-08 | Modification du profil | P2 | | | |
| UT-09 | Changement de mot de passe | P2 | | | |
| UT-10 | Confirmation mot de passe incorrecte | P2 | | | |
| UT-11 | Suppression du compte | P2 | | | |
| UT-13 | Changement de rôle (UI) | P1 | | | |
| UT-14 | Activation / désactivation (UI) | P1 | | | |

### Module Informations (IF)

| ID | Intitulé | Priorité | Résultat | Anomalie | Observations |
|----|----------|----------|----------|----------|-------------|
| IF-05 | Lecture à voix haute | P2 | | | |
| IF-08 | Création de contenu (admin) | P1 | | | |
| IF-09 | Publication / dépublication (UI) | P1 | | | |
| IF-10 | Modification de contenu | P2 | | | |
| IF-11 | Suppression de contenu (UI) | P1 | | | |

### Module Exercice Cardiaque (EC)

| ID | Intitulé | Priorité | Résultat | Anomalie | Observations |
|----|----------|----------|----------|----------|-------------|
| EC-03 | Déroulement des phases | P1 | | | |
| EC-04 | Annulation d'exercice | P2 | | | |
| EC-05 | Guidage vocal (audio) | P2 | | | |
| EC-09 | Création preset (admin) | P1 | | | |
| EC-10 | Suppression preset (UI) | P1 | | | |

### Tests de non-régression (NR)

| ID | Intitulé | Priorité | Résultat | Observations |
|----|----------|----------|----------|-------------|
| NR-01 | Admin toujours en mode clair | P1 | | |
| NR-05 | Responsive mobile 375 px | P2 | | |

---

## 3. Récapitulatif

| Catégorie | P1 total | P1 passés | P2 total | P2 passés |
|-----------|----------|-----------|----------|-----------|
| Tests automatisés | | | | |
| Tests manuels | | | | |
| **TOTAL** | | | | |

**Nombre d'anomalies P1 :** `_____`  
**Nombre d'anomalies P2 :** `_____`  
**Nombre d'anomalies P3 :** `_____`  

---

## 4. Anomalies relevées

*(Compléter une ligne par anomalie constatée.)*

| N° | ID Test | Description de l'anomalie | Priorité | Statut | Responsable correction |
|----|---------|--------------------------|----------|--------|----------------------|
| 1 | | | | Ouvert | |
| 2 | | | | Ouvert | |
| 3 | | | | Ouvert | |

**Statuts possibles :** Ouvert · En cours · Corrigé · Reporté · Non reproductible

---

## 5. Vérifications complémentaires

| Vérification | Résultat | Observations |
|-------------|----------|-------------|
| Aucune donnée personnelle visible dans les logs | ☐ OK &nbsp; ☐ KO | |
| Les pages protégées redirigent vers /login | ☐ OK &nbsp; ☐ KO | |
| Le toggle de thème n'affecte pas l'admin | ☐ OK &nbsp; ☐ KO | |
| Le lien d'évitement est fonctionnel | ☐ OK &nbsp; ☐ KO | |
| L'application fonctionne sur mobile (375 px) | ☐ OK &nbsp; ☐ KO | |
| Les annonces aria-live sont présentes | ☐ OK &nbsp; ☐ KO | |

---

## 6. Décision de recette

☐ **ACCEPTÉE** — L'application est conforme. La mise en production est autorisée.

☐ **ACCEPTÉE AVEC RÉSERVES** — La mise en production est autorisée sous réserve de correction des anomalies P2 listées ci-dessus avant la prochaine livraison.

☐ **REFUSÉE** — Des anomalies bloquantes (P1) ont été détectées. La mise en production est interdite jusqu'à correction et re-validation.

**Commentaires :**

```
________________________________________________________________________________

________________________________________________________________________________

________________________________________________________________________________
```

---

## 7. Signatures

| | Prestataire | Chef de projet Ministère |
|--|------------|--------------------------|
| **Nom** | | |
| **Date** | | |
| **Signature** | | |

---

*Document généré dans le cadre du projet CesiZen — École CESI*
