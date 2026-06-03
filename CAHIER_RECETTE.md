# Cahier de Recette — CesiZen

| | |
|---|---|
| **Projet** | CesiZen — Application de bien-être et de santé mentale |
| **Référence** | CR-CESIZEN-v1.0 |
| **Version** | 1.0 |
| **Date** | 2026-06-03 |
| **Rédacteur** | Lucas Helloco — Responsable technique |
| **Destinataire** | Équipe pédagogique CESI |
| **Statut** | Livré |

---

## Table des matières

1. [Objet et domaine d'application](#1-objet-et-domaine-dapplication)
2. [Documents de référence](#2-documents-de-référence)
3. [Présentation de l'application](#3-présentation-de-lapplication)
4. [Organisation de la recette](#4-organisation-de-la-recette)
5. [Environnement de test](#5-environnement-de-test)
6. [Périmètre et critères d'acceptation](#6-périmètre-et-critères-dacceptation)
7. [Plan de tests](#7-plan-de-tests)
8. [Exécution des campagnes de tests](#8-exécution-des-campagnes-de-tests)
9. [Résultats par module](#9-résultats-par-module)
10. [Gestion des anomalies](#10-gestion-des-anomalies)
11. [Procès-Verbal de recette](#11-procès-verbal-de-recette)

---

## 1. Objet et domaine d'application

### 1.1 Objet du document

Le présent Cahier de Recette définit les conditions, l'organisation et les critères de la campagne de validation de l'application **CesiZen version 1.0**. Il constitue le document de référence contractuel permettant au client (représenté par l'équipe pédagogique CESI) de valider la conformité des livrables par rapport aux spécifications fonctionnelles.

Il couvre :
- Le périmètre fonctionnel soumis à recette
- L'environnement de test requis
- Les cas de test à exécuter avec leurs résultats attendus
- Les critères d'acceptation et les règles de décision
- Le Procès-Verbal de recette (PV) à signer

### 1.2 Domaine d'application

Ce document s'applique à la **version 1.0** de l'application CesiZen, telle que livrée par Lucas Helloco (prestataire) dans le cadre du projet pédagogique CESI.

### 1.3 Contexte de la recette

La recette fonctionnelle est la phase finale avant la mise en production. Elle a pour objectif de vérifier que l'application livrée répond bien aux besoins exprimés par le client, en conditions réelles d'utilisation.

---

## 2. Documents de référence

| Document | Référence | Date | Objet |
|----------|-----------|------|-------|
| Cahier Technique | CT-CESIZEN-v1.0 | 2026-06-03 | Architecture et choix techniques |
| Modèle Logique de Données | MLD.md | 2026-05-21 | Schéma de base de données |
| Comparatif Technique | COMPARATIF_TECHNIQUE.md | 2026-05-21 | Justification de la stack |
| Guide d'installation | GUIDE_INSTALLATION.md | 2026-05-21 | Procédure de déploiement |
| Cahier de Tests | CAHIER_DE_TESTS.md | 2026-05-21 | Scénarios de tests détaillés (41 cas) |

---

## 3. Présentation de l'application

### 3.1 Description générale

CesiZen est une application web de bien-être mental proposant :

- La consultation d'**articles et documents** sur la santé mentale, le stress et la pleine conscience
- Des **exercices de respiration cardiaque** guidés avec minuterie et guidage vocal
- Un **espace personnel** pour gérer son profil et sauvegarder une configuration d'exercice
- Un **back-office d'administration** pour les gestionnaires de contenu

### 3.2 Modules fonctionnels

| Code | Module | Description |
|------|--------|-------------|
| **UT** | Comptes Utilisateurs | Inscription, connexion, profil, gestion admin des comptes |
| **IF** | Informations | Consultation et administration des articles et documents |
| **EC** | Exercice Cardiaque | Exercices de respiration guidés, configuration personnelle |
| **NR** | Non-Régression | Thème, navigation, accessibilité RGAA, responsive |

### 3.3 Profils utilisateurs

| Profil | Description | Accès |
|--------|-------------|-------|
| **Visiteur** | Non connecté | Pages publiques uniquement |
| **Utilisateur (USER)** | Compte créé | Pages publiques + profil + configuration exercice |
| **Administrateur (ADMIN)** | Rôle élevé | Tout + back-office (`/admin/**`) |

---

## 4. Organisation de la recette

### 4.1 Acteurs

| Rôle | Nom | Responsabilités |
|------|-----|----------------|
| **Prestataire** | Lucas Helloco | Exécution des tests automatisés, correction des anomalies, livraison des rapports |
| **Responsable recette client** | *(équipe CESI)* | Validation fonctionnelle manuelle, signature du PV |
| **Chef de projet** | *(à désigner)* | Décision finale de mise en production |

### 4.2 Planning de la recette

| Phase | Description | Durée estimée |
|-------|-------------|:-------------:|
| **Préparation** | Déploiement de l'environnement de recette, configuration des comptes de test | 1 jour |
| **Campagne automatisée** | Exécution Vitest + Playwright, analyse des rapports | 2 heures |
| **Campagne manuelle** | Exécution des tests non automatisés par le testeur | 1 jour |
| **Analyse des résultats** | Qualification des anomalies, décision de livraison | 1/2 journée |
| **Signature du PV** | Formalisation de la décision de recette | 1/2 journée |

### 4.3 Règles de communication

- Toute anomalie P1 détectée déclenche une notification immédiate au prestataire
- Les résultats des tests automatisés sont transmis sous forme de rapport HTML (Playwright) et console (Vitest)
- Les anomalies sont consignées dans le tableau de suivi (Section 10)

---

## 5. Environnement de test

### 5.1 Environnement de recette requis

| Composant | Spécification |
|-----------|--------------|
| **URL de l'application** | URL Vercel preview ou `http://localhost:3000` |
| **Base de données** | PostgreSQL 15+ — instance dédiée recette (isolée de la production) |
| **Navigateurs testés** | Google Chrome (dernière version), Mobile Chrome (375 × 812 px) |
| **Node.js** | Version 20+ |
| **npm** | Version 10+ |

### 5.2 Données de test requises

Avant le démarrage de la campagne manuelle, les conditions suivantes doivent être réunies :

| Donnée | Valeur requise |
|--------|---------------|
| Compte ADMIN de test | `admin@cesizen.test` / mot de passe connu du testeur |
| Compte USER de test | `user@cesizen.test` / mot de passe connu du testeur |
| Contenus | Au moins **3 contenus** : 1 article publié, 1 document publié, 1 brouillon |
| Exercices presets | Au moins **3 presets** (fournis par le seed : 7-4-8, 5-0-5, 4-0-6) |
| Email de test libre | Adresse non enregistrée, disponible pour tester l'inscription |

### 5.3 Initialisation de l'environnement

```bash
# Cloner et installer
git clone <repo>
npm install

# Configurer l'environnement de recette
cp .env.example .env
# Compléter DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL,
# GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

# Initialiser la base de données de recette
npm run db:push
npm run db:seed

# Démarrer l'application
npm run dev
```

### 5.4 Isolation des environnements

> **Important :** La base de données de recette doit être distincte de la base de production. Toute modification de données lors de la campagne (création de comptes, suppression de contenus de test) ne doit pas affecter l'environnement de production.

---

## 6. Périmètre et critères d'acceptation

### 6.1 Périmètre de la recette v1.0

| Module | Inclus dans la recette | Exclus |
|--------|:----------------------:|--------|
| Inscription / Connexion | ✅ | OAuth GitHub (optionnel, testé si disponible) |
| Profil utilisateur | ✅ | Export RGPD des données |
| Consultation des contenus | ✅ | — |
| Administration des contenus | ✅ | — |
| Exercice cardiaque | ✅ | — |
| Configuration personnelle | ✅ | — |
| Administration des exercices | ✅ | — |
| Gestion des utilisateurs (admin) | ✅ | — |
| Accessibilité RGAA | ✅ (partiel) | Audit RGAA complet |
| Responsive mobile | ✅ | Tablettes (iPad) |

### 6.2 Niveaux de priorité des tests

| Niveau | Signification | Impact sur la décision de recette |
|--------|--------------|----------------------------------|
| **P1 — Critique** | Fonctionnalité bloquante ou sécurité compromise | Livraison **refusée** si échec |
| **P2 — Important** | Fonctionnalité dégradée, workaround possible | Livraison avec réserve ou report (décision chef de projet) |
| **P3 — Mineur** | Amélioration ergonomique ou cas limite | Sans impact sur la décision de livraison |

### 6.3 Critères d'entrée de la campagne

La campagne de recette peut démarrer uniquement si les conditions suivantes sont réunies :

- [ ] L'application est accessible sur l'URL de recette
- [ ] La base de données est initialisée avec les données de seed
- [ ] Les comptes de test ADMIN et USER sont créés et fonctionnels
- [ ] Le rapport de build Next.js ne contient pas d'erreur bloquante
- [ ] Les tests Vitest ont été exécutés avec succès en environnement de développement

### 6.4 Critères de sortie de la campagne

| Condition | Décision |
|-----------|---------|
| Tous les tests P1 passés, tous les tests NR passés | ✅ **Recette acceptée** — mise en production autorisée |
| Tous les tests P1 passés, un ou plusieurs P2 échouent | ⚠️ **Acceptée avec réserves** — correction des P2 avant la prochaine livraison |
| Un ou plusieurs tests P1 échouent | ❌ **Recette refusée** — correction obligatoire, nouvelle campagne requise |
| Tests NR non exécutés | ❌ **Recette refusée** |

---

## 7. Plan de tests

### 7.1 Récapitulatif des cas de test

| ID | Intitulé | Priorité | Type | Automatisé |
|----|----------|:--------:|------|:----------:|
| **UT-01** | Inscription avec des données valides | P1 | Fonctionnel | ✅ Playwright |
| **UT-02** | Inscription avec un email déjà utilisé | P1 | Fonctionnel | ❌ Manuel |
| **UT-03** | Inscription — mot de passe trop court | P1 | Unitaire + Fonctionnel | ✅ Vitest |
| **UT-04** | Inscription — email mal formaté | P2 | Fonctionnel | ❌ Manuel |
| **UT-05** | Connexion avec des identifiants valides | P1 | Fonctionnel | ❌ Manuel |
| **UT-06** | Connexion avec des identifiants invalides | P1 | Fonctionnel | ✅ Playwright |
| **UT-07** | Redirection des pages protégées vers /login | P1 | Fonctionnel | ✅ Playwright |
| **UT-08** | Modification du nom et de l'email | P2 | Fonctionnel | ❌ Manuel |
| **UT-09** | Changement de mot de passe | P2 | Fonctionnel | ❌ Manuel |
| **UT-10** | Confirmation de mot de passe incorrecte | P2 | Fonctionnel | ❌ Manuel |
| **UT-11** | Suppression du compte utilisateur | P2 | Fonctionnel | ❌ Manuel |
| **UT-12** | Accès admin refusé à un USER | P1 | Fonctionnel | ✅ Playwright |
| **UT-13** | Changement de rôle USER ↔ ADMIN | P1 | Fonctionnel | ✅ Vitest + ❌ Manuel |
| **UT-14** | Désactivation / réactivation d'un compte | P1 | Fonctionnel | ✅ Vitest + ❌ Manuel |
| **IF-01** | Affichage de la liste des contenus publiés | P1 | Fonctionnel | ✅ Playwright + Vitest |
| **IF-02** | Recherche textuelle dans les contenus | P2 | Fonctionnel | ✅ Vitest |
| **IF-03** | Tri des contenus par date | P3 | Fonctionnel | ✅ Vitest |
| **IF-04** | Consultation du détail d'un contenu | P1 | Fonctionnel | ✅ Playwright |
| **IF-05** | Lecture à voix haute | P2 | Fonctionnel | ✅ Vitest + ❌ Manuel (audio) |
| **IF-06** | Contenu non publié inaccessible publiquement | P1 | Unitaire + Fonctionnel | ✅ Vitest |
| **IF-07** | Affichage d'une vidéo YouTube intégrée | P3 | Unitaire + Fonctionnel | ✅ Vitest |
| **IF-08** | Création d'un contenu depuis le back-office | P1 | Fonctionnel | ❌ Manuel |
| **IF-09** | Publication / dépublication d'un contenu | P1 | Fonctionnel | ✅ Vitest + ❌ Manuel |
| **IF-10** | Modification d'un contenu existant | P2 | Fonctionnel | ❌ Manuel |
| **IF-11** | Suppression d'un contenu | P1 | Fonctionnel | ✅ Vitest + ❌ Manuel |
| **EC-01** | Affichage des exercices presets | P1 | Fonctionnel | ✅ Playwright + Vitest |
| **EC-02** | Démarrage d'un exercice depuis un preset | P1 | Fonctionnel | ✅ Playwright |
| **EC-03** | Déroulement des phases de l'exercice | P1 | Fonctionnel | ❌ Manuel |
| **EC-04** | Annulation d'un exercice en cours | P2 | Fonctionnel | ❌ Manuel |
| **EC-05** | Guidage vocal pendant l'exercice | P2 | Fonctionnel | ✅ Vitest + ❌ Manuel (audio) |
| **EC-06** | Sauvegarde d'une configuration personnalisée | P2 | Fonctionnel | ✅ Vitest |
| **EC-07** | Mise à jour de configuration sans doublon | P2 | Unitaire | ✅ Vitest |
| **EC-08** | saveUserConfig sans authentification | P1 | Unitaire | ✅ Vitest |
| **EC-09** | Création d'un exercice preset (admin) | P1 | Fonctionnel | ❌ Manuel |
| **EC-10** | Suppression d'un exercice preset (admin) | P1 | Fonctionnel | ✅ Vitest + ❌ Manuel |
| **EC-11** | Validation des paramètres (contraintes Zod) | P1 | Unitaire | ✅ Vitest |
| **NR-01** | Dashboard admin suit le thème + toggle | P1 | Non-régression | ✅ Playwright |
| **NR-02** | Navigation entre toutes les pages sans erreur | P1 | Non-régression | ✅ Playwright |
| **NR-03** | Accessibilité — lien d'évitement et focus clavier | P1 | Non-régression | ✅ Playwright |
| **NR-04** | Accessibilité — annonces aria-live | P1 | Non-régression | ✅ Vitest |
| **NR-05** | Affichage responsive sur mobile (375 px) | P2 | Non-régression | ✅ Playwright |

**Total : 41 cas de test**  
**P1 :** 26 cas · **P2 :** 12 cas · **P3 :** 3 cas  
**Automatisés :** 23 cas (Vitest + Playwright) · **Manuels :** 18 cas · **Mixte :** 6 cas

---

## 8. Exécution des campagnes de tests

### 8.1 Campagne automatisée — Tests unitaires (Vitest)

**Prérequis :** Node.js 20+, `npm install` effectué

```bash
# Exécuter tous les tests Vitest
npm run test:run
```

**Résultat attendu :** `34 tests passed` — `0 failed`

**Rapport de couverture (optionnel) :**
```bash
npm run test:coverage
# Rapport généré dans coverage/index.html
```

### 8.2 Campagne automatisée — Tests E2E (Playwright)

**Prérequis :** Application démarrée sur `http://localhost:3000`, base de données initialisée

```bash
# Première exécution uniquement : installation des navigateurs Playwright
npm run test:e2e:install

# Exécution de la campagne E2E
npm run test:e2e

# Rapport HTML interactif (optionnel)
npx playwright show-report
```

**Résultat attendu :** `52 tests passed` — `0 failed` — rapport HTML disponible dans `playwright-report/`

### 8.3 Campagne manuelle

Les tests manuels suivants doivent être exécutés par un testeur humain sur l'environnement de recette déployé :

| ID | Intitulé | Compte requis |
|----|----------|:-------------:|
| UT-02 | Email déjà utilisé | Aucun (données préexistantes) |
| UT-04 | Email mal formaté | Aucun |
| UT-05 | Connexion valide | USER |
| UT-08 | Modification du profil | USER |
| UT-09 | Changement de mot de passe | USER |
| UT-10 | Confirmation mot de passe incorrecte | USER |
| UT-11 | Suppression du compte | USER (compte de test dédié) |
| UT-13 | Changement de rôle (UI) | ADMIN |
| UT-14 | Activation / désactivation (UI) | ADMIN |
| IF-05 | Lecture à voix haute (audio réel) | Aucun |
| IF-08 | Création de contenu (admin) | ADMIN |
| IF-09 | Publication / dépublication (UI) | ADMIN |
| IF-10 | Modification de contenu | ADMIN |
| IF-11 | Suppression de contenu (UI) | ADMIN |
| EC-03 | Déroulement des phases | Aucun |
| EC-04 | Annulation d'exercice | Aucun |
| EC-05 | Guidage vocal (audio réel) | Aucun |
| EC-09 | Création preset (admin) | ADMIN |

**Durée estimée de la campagne manuelle : 2 à 3 heures**

---

## 9. Résultats par module

### 9.1 Module Comptes Utilisateurs (UT)

| ID | Intitulé | Priorité | Résultat | Anomalie | Observations |
|----|----------|:--------:|:--------:|----------|-------------|
| UT-01 | Inscription valide | P1 | ✅ | — | Playwright (Chromium + Mobile Chrome) |
| UT-02 | Email déjà utilisé | P1 | ✅ | — | Validé manuellement le 2026-05-21 |
| UT-03 | Mot de passe trop court | P1 | ✅ | — | Vitest — validation Zod + HTML5 minLength |
| UT-04 | Email mal formaté | P2 | ✅ | — | Validé manuellement le 2026-05-21 |
| UT-05 | Connexion valide | P1 | ✅ | — | Validé manuellement le 2026-05-21 |
| UT-06 | Connexion invalide | P1 | ✅ | — | Playwright — erreur `role="alert"` |
| UT-07 | Redirection pages protégées | P1 | ✅ | — | Playwright — /profil et /admin → /login |
| UT-08 | Modification du profil | P2 | ✅ | — | Validé manuellement le 2026-05-21 |
| UT-09 | Changement de mot de passe | P2 | ✅ | — | Validé manuellement le 2026-05-21 |
| UT-10 | Confirmation incorrecte | P2 | ✅ | — | Validé manuellement le 2026-05-21 |
| UT-11 | Suppression du compte | P2 | ✅ | — | Validé manuellement le 2026-05-21 |
| UT-12 | Accès admin refusé (USER) | P1 | ✅ | — | Playwright — redirection /admin → /login |
| UT-13 | Changement de rôle | P1 | ✅ | — | Vitest (router) + Manuel (UI) |
| UT-14 | Activation / désactivation | P1 | ✅ | — | Vitest (router) + Manuel (UI) |

**Résultat module UT : 14/14 ✅**

### 9.2 Module Informations (IF)

| ID | Intitulé | Priorité | Résultat | Anomalie | Observations |
|----|----------|:--------:|:--------:|----------|-------------|
| IF-01 | Liste des contenus publiés | P1 | ✅ | — | Vitest (router) + Playwright |
| IF-02 | Recherche textuelle | P2 | ✅ | — | Vitest — filtre `search` validé |
| IF-03 | Tri par date | P3 | ✅ | — | Vitest — tri `date-asc` et `date-desc` |
| IF-04 | Détail d'un contenu | P1 | ✅ | — | Playwright — navigation + retour |
| IF-05 | Lecture à voix haute | P2 | ✅ | — | Vitest (composant) + Manuel (audio) |
| IF-06 | Contenu non publié inaccessible | P1 | ✅ | — | Vitest — filtre `isPublished: true` |
| IF-07 | Vidéo YouTube intégrée | P3 | ✅ | — | Vitest — 6 cas `getYoutubeEmbedUrl` |
| IF-08 | Création de contenu (admin) | P1 | ✅ | — | Validé manuellement le 2026-05-21 |
| IF-09 | Publication / dépublication | P1 | ✅ | — | Vitest + Manuel |
| IF-10 | Modification de contenu | P2 | ✅ | — | Validé manuellement le 2026-05-21 |
| IF-11 | Suppression de contenu | P1 | ✅ | — | Vitest + Manuel |

**Résultat module IF : 11/11 ✅**

### 9.3 Module Exercice Cardiaque (EC)

| ID | Intitulé | Priorité | Résultat | Anomalie | Observations |
|----|----------|:--------:|:--------:|----------|-------------|
| EC-01 | Affichage des presets | P1 | ✅ | — | Vitest (router) + Playwright |
| EC-02 | Démarrage depuis un preset | P1 | ✅ | — | Playwright — compte à rebours 3-2-1 |
| EC-03 | Déroulement des phases | P1 | ✅ | — | Validé manuellement le 2026-05-21 |
| EC-04 | Annulation d'exercice | P2 | ✅ | — | Validé manuellement le 2026-05-21 |
| EC-05 | Guidage vocal | P2 | ✅ | — | Vitest (aria-pressed) + Manuel (audio) |
| EC-06 | Sauvegarde config personnelle | P2 | ✅ | — | Vitest — `upsert` validé |
| EC-07 | Mise à jour sans doublon | P2 | ✅ | — | Vitest — un seul enregistrement par utilisateur |
| EC-08 | saveUserConfig sans auth | P1 | ✅ | — | Vitest — erreur UNAUTHORIZED |
| EC-09 | Création preset (admin) | P1 | ✅ | — | Validé manuellement le 2026-05-21 |
| EC-10 | Suppression preset (admin) | P1 | ✅ | — | Vitest + Manuel |
| EC-11 | Validation Zod | P1 | ✅ | — | Vitest — contraintes min validées |

**Résultat module EC : 11/11 ✅**

### 9.4 Tests de non-régression (NR)

| ID | Intitulé | Priorité | Résultat | Anomalie | Observations |
|----|----------|:--------:|:--------:|----------|-------------|
| NR-01 | Admin suit le thème + toggle | P1 | ✅ | — | Playwright (admin-authenticated) |
| NR-02 | Navigation sans erreur | P1 | ✅ | — | Playwright — 6 pages vérifiées |
| NR-03 | Lien d'évitement / focus clavier | P1 | ✅ | — | Playwright — `href="#main-content"` |
| NR-04 | Annonces aria-live | P1 | ✅ | — | Vitest — AnnouncerProvider (4 tests) |
| NR-05 | Responsive mobile 375 px | P2 | ✅ | — | Playwright Mobile Chrome |

**Résultat module NR : 5/5 ✅**

### 9.5 Récapitulatif global

| Catégorie | P1 total | P1 passés | P2 total | P2 passés | P3 total | P3 passés |
|-----------|:--------:|:---------:|:--------:|:---------:|:--------:|:---------:|
| Module UT | 9 | **9** | 5 | **5** | 0 | — |
| Module IF | 6 | **6** | 2 | **2** | 3 | **3** |
| Module EC | 7 | **7** | 4 | **4** | 0 | — |
| Module NR | 4 | **4** | 1 | **1** | 0 | — |
| **TOTAL** | **26** | **26** | **12** | **12** | **3** | **3** |

**Total général : 41 / 41 cas validés**

---

## 10. Gestion des anomalies

### 10.1 Cycle de vie d'une anomalie

```
Détectée → Qualifiée (P1/P2/P3) → Assignée au prestataire
    → En cours de correction → Corrigée → Re-testée → Fermée
                                        → Non reproductible → Fermée
                                        → Reportée → Prochaine livraison
```

### 10.2 Règles de qualification

| Priorité | Critère |
|:--------:|---------|
| **P1** | Fonctionnalité principale inopérante, faille de sécurité, perte de données |
| **P2** | Fonctionnalité dégradée, comportement inattendu sans perte de données, bug ergonomique majeur |
| **P3** | Problème cosmétique, cas limite, amélioration suggérée |

### 10.3 Registre des anomalies (campagne v1.0)

| N° | ID Test | Description | Priorité | Statut | Correction |
|----|---------|-------------|:--------:|:------:|-----------|
| — | — | *Aucune anomalie détectée lors de la campagne du 2026-05-21* | — | — | — |

**Nombre d'anomalies P1 ouvertes : 0**  
**Nombre d'anomalies P2 ouvertes : 0**  
**Nombre d'anomalies P3 ouvertes : 0**

---

## 11. Procès-Verbal de recette

---

### En-tête

| Champ | Valeur |
|-------|--------|
| **Projet** | CesiZen — Application de bien-être et de santé mentale |
| **Version livrée** | `1.0.0` |
| **Date de recette** | `2026-05-21` |
| **Environnement** | ☑ Recette &nbsp;&nbsp; ☐ Pré-production &nbsp;&nbsp; ☐ Production |
| **URL testée** | `http://localhost:3000` |
| **Hash de commit** | `efe34b7` |
| **Référence du cahier de recette** | CR-CESIZEN-v1.0 |

---

### Intervenants

| Nom | Fonction | Organisation | Signature |
|-----|----------|-------------|-----------|
| Lucas Helloco | Responsable technique / Développeur | CESI | Lucas Helloco |
| | Chef de projet | CESI | |
| | Testeur fonctionnel | CESI | |

---

### Résultats des tests automatisés

| Outil | Tests totaux | Passés | Échoués | Ignorés |
|-------|:-----------:|:------:|:-------:|:-------:|
| **Vitest** | 34 | **34** | 0 | 0 |
| **Playwright** | 52 | **52** | 0 | 0 |

**Détail des suites Vitest :**

| Suite | Tests | Résultat |
|-------|:-----:|:--------:|
| `announcer-provider.test.tsx` | 4 | ✅ |
| `read-aloud.test.tsx` | 6 | ✅ |
| `contenus.test.ts` | 9 | ✅ |
| `youtube.test.ts` | 6 | ✅ |
| `exercices.test.ts` | 9 | ✅ |

**Détail des suites Playwright :**

| Suite | Projet | Tests | Résultat |
|-------|--------|:-----:|:--------:|
| `home.spec.ts` | Chromium + Mobile | 10 | ✅ |
| `auth.spec.ts` | Chromium + Mobile | 12 | ✅ |
| `contenus.spec.ts` | Chromium + Mobile | 10 | ✅ |
| `exercice.spec.ts` | Chromium + Mobile | 8 | ✅ |
| `admin.spec.ts` | Chromium + Mobile | 8 | ✅ |
| `admin-auth.spec.ts` | admin-authenticated | 3 | ✅ |
| `auth.setup.ts` | setup | 1 | ✅ Session admin générée |

**Résultat global tests automatisés :** ☑ **SUCCÈS** &nbsp;&nbsp; ☐ ÉCHEC

---

### Résultats des tests manuels

**Module Comptes Utilisateurs (UT)**

| ID | Intitulé | Priorité | Résultat | Observations |
|----|----------|:--------:|:--------:|-------------|
| UT-02 | Email déjà utilisé | P1 | ✅ | 2026-05-21 — Lucas Helloco |
| UT-04 | Email mal formaté | P2 | ✅ | 2026-05-21 — Lucas Helloco |
| UT-05 | Connexion valide | P1 | ✅ | 2026-05-21 — Lucas Helloco |
| UT-08 | Modification du profil | P2 | ✅ | 2026-05-21 — Lucas Helloco |
| UT-09 | Changement de mot de passe | P2 | ✅ | 2026-05-21 — Lucas Helloco |
| UT-10 | Confirmation incorrecte | P2 | ✅ | 2026-05-21 — Lucas Helloco |
| UT-11 | Suppression du compte | P2 | ✅ | 2026-05-21 — Lucas Helloco |
| UT-13 | Changement de rôle (UI) | P1 | ✅ | 2026-05-21 — Lucas Helloco |
| UT-14 | Activation / désactivation (UI) | P1 | ✅ | 2026-05-21 — Lucas Helloco |

**Module Informations (IF)**

| ID | Intitulé | Priorité | Résultat | Observations |
|----|----------|:--------:|:--------:|-------------|
| IF-05 | Lecture à voix haute (audio) | P2 | ✅ | 2026-05-21 — Lucas Helloco |
| IF-08 | Création de contenu | P1 | ✅ | 2026-05-21 — Lucas Helloco |
| IF-09 | Publication / dépublication | P1 | ✅ | 2026-05-21 — Lucas Helloco |
| IF-10 | Modification de contenu | P2 | ✅ | 2026-05-21 — Lucas Helloco |
| IF-11 | Suppression de contenu | P1 | ✅ | 2026-05-21 — Lucas Helloco |

**Module Exercice Cardiaque (EC)**

| ID | Intitulé | Priorité | Résultat | Observations |
|----|----------|:--------:|:--------:|-------------|
| EC-03 | Déroulement des phases | P1 | ✅ | 2026-05-21 — Lucas Helloco |
| EC-04 | Annulation d'exercice | P2 | ✅ | 2026-05-21 — Lucas Helloco |
| EC-05 | Guidage vocal (audio) | P2 | ✅ | 2026-05-21 — Lucas Helloco |
| EC-09 | Création preset (admin) | P1 | ✅ | 2026-05-21 — Lucas Helloco |

**Tests de non-régression (NR)**

| ID | Intitulé | Priorité | Résultat | Observations |
|----|----------|:--------:|:--------:|-------------|
| NR-01 | Admin suit le thème + toggle | P1 | ✅ | 2026-05-21 — Lucas Helloco |

---

### Vérifications complémentaires

| Vérification | Résultat |
|-------------|:--------:|
| Aucune donnée personnelle visible dans les logs | ☑ OK |
| Les pages protégées redirigent vers /login | ☑ OK |
| Le toggle de thème fonctionne dans l'administration | ☑ OK |
| Le lien d'évitement est fonctionnel (Tab → focus visible) | ☑ OK |
| L'application fonctionne sur mobile (375 px, sans défilement horizontal) | ☑ OK |
| Les annonces aria-live sont présentes et fonctionnelles | ☑ OK |
| Aucune anomalie P1 ou P2 ouverte | ☑ OK |

---

### Récapitulatif final

| Catégorie | P1 | P2 | P3 |
|-----------|----|----|----|
| Tests automatisés Vitest | 5 ✅ | 7 ✅ | 3 ✅ |
| Tests automatisés Playwright | 11 ✅ | 5 ✅ | — |
| Tests manuels | 10 ✅ | 8 ✅ | — |
| **TOTAL** | **26 / 26** | **20 / 20** | **3 / 3** |

**Anomalies P1 :** `0` &nbsp; **Anomalies P2 :** `0` &nbsp; **Anomalies P3 :** `0`

---

### Décision de recette

☑ **ACCEPTÉE** — L'application est conforme aux spécifications. La mise en production est autorisée.

☐ **ACCEPTÉE AVEC RÉSERVES** — Mise en production autorisée sous réserve de correction des anomalies P2 avant la prochaine livraison.

☐ **REFUSÉE** — Des anomalies bloquantes (P1) ont été détectées. La mise en production est interdite jusqu'à correction et re-validation.

**Commentaires :**

```
Campagne complète 2026-05-21 : 41/41 scénarios validés. 0 anomalie détectée.
Vitest    : 34/34 tests passés.
Playwright: 52/52 tests passés (Chromium + Mobile Chrome + admin-authenticated).
Manuels   : 18/18 scénarios validés par Lucas Helloco.
```

---

### Signatures

| | Prestataire | Responsable recette CESI |
|--|------------|--------------------------|
| **Nom** | Lucas Helloco | |
| **Date** | 2026-05-21 | |
| **Signature** | Lucas Helloco | |

---

*Document rédigé dans le cadre du projet CesiZen — École CESI — Lucas Helloco — 2026*
