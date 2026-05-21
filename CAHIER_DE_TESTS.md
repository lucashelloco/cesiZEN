# Cahier de Tests — CesiZen

**Version :** 1.0  
**Date :** 2026-05-21  
**Projet :** CesiZen — Application de santé mentale  
**Rédacteur :** Équipe de développement  
**Statut :** En vigueur  

---

## 1. Périmètre et objectifs

Ce document couvre les trois modules applicatifs suivants :

| Module | Code | Description |
|--------|------|-------------|
| Comptes utilisateurs | **UT** | Inscription, authentification, profil, gestion admin |
| Informations | **IF** | Articles, documents, publication, recherche |
| Exercice cardiaque | **EC** | Presets, timer, configuration personnelle, guidage vocal |

Il inclut également une section de tests de non-régression (**NR**) transversaux.

### Types de tests couverts

- **Tests unitaires (U)** — fonctions isolées, validation Zod, logique métier
- **Tests fonctionnels (F)** — parcours utilisateur complets, interface
- **Tests de non-régression (NR)** — vérification de la stabilité entre livraisons

### Outils d'automatisation

| Outil | Usage | Commande |
|-------|-------|---------|
| **Vitest** | Tests unitaires et composants | `npm run test:run` |
| **Playwright** | Tests fonctionnels E2E | `npm run test:e2e` |

> Vitest est l'outil principal : il gère à la fois les tests unitaires (routers tRPC, fonctions pures) et les tests composants React (via jsdom). Playwright prend en charge les scénarios end-to-end sur navigateur réel. Un seul dépôt git contient le code source et l'ensemble des tests — le versioning, les tests unitaires et les tests de non-régression sont donc gérés par le même outil (npm + git + CI).

---

## 2. Conventions du document

### Statuts

| Symbole | Statut |
|---------|--------|
| ✅ | Passé |
| ❌ | Échoué |
| ⏭️ | Non exécuté |
| 🚫 | Bloqué |

### Niveaux de priorité

| Niveau | Description |
|--------|-------------|
| **P1** | Critique — bloque la livraison si échec |
| **P2** | Important — doit passer avant mise en production |
| **P3** | Mineur — amélioration, n'est pas bloquant |

### Format d'un scénario

Chaque test précise : identifiant · type · priorité · préconditions · étapes · résultat attendu · résultat obtenu · responsable.

---

## 3. Module Comptes Utilisateurs (UT)

### 3.1 Inscription

---

**UT-01** — Inscription avec des données valides  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Playwright  
**Responsable :** Développeur / Testeur fonctionnel

**Préconditions :** L'application est démarrée. L'adresse email n'est pas encore enregistrée.

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Naviguer vers `/register` | Le formulaire d'inscription s'affiche avec les champs Nom, Email, Mot de passe |
| 2 | Saisir un nom valide (ex : "Jean Dupont") | Le champ est rempli |
| 3 | Saisir une adresse email valide (ex : "jean@test.com") | Le champ est rempli |
| 4 | Saisir un mot de passe d'au moins 8 caractères | Le champ est rempli |
| 5 | Cliquer sur "Créer un compte" | Redirection vers la page d'accueil ou de connexion. L'utilisateur est enregistré en base. |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**UT-02** — Inscription avec une adresse email déjà utilisée  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ❌ Manuel

**Préconditions :** Un compte avec l'email "jean@test.com" existe déjà en base.

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Naviguer vers `/register` | Le formulaire s'affiche |
| 2 | Saisir "jean@test.com" dans le champ email | Le champ est rempli |
| 3 | Remplir les autres champs valablement | Les champs sont remplis |
| 4 | Soumettre le formulaire | Un message d'erreur s'affiche : "Cette adresse email est déjà utilisée" |
| 5 | Vérifier que le compte n'est pas dupliqué en base | Un seul compte avec cet email en base |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**UT-03** — Inscription avec un mot de passe trop court (< 8 caractères)  
**Type :** Unitaire + Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Vitest (Zod)

**Préconditions :** Aucune.

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Naviguer vers `/register` | Le formulaire s'affiche |
| 2 | Saisir un mot de passe de 5 caractères (ex : "abc12") | Le champ est rempli |
| 3 | Soumettre le formulaire | Erreur affichée : "Le mot de passe doit contenir au moins 8 caractères" |
| 4 | Vérifier qu'aucun compte n'est créé | La base de données reste inchangée |

**Résultat obtenu :** ⏭️  
**Observations :** Validation côté client (HTML5 `minLength`) et côté serveur (Zod).

---

**UT-04** — Inscription avec un email mal formaté  
**Type :** Fonctionnel | **Priorité :** P2 | **Automatisé :** ❌ Manuel

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Naviguer vers `/register` | Le formulaire s'affiche |
| 2 | Saisir "pasunemail" dans le champ email | Le champ est rempli |
| 3 | Soumettre | Validation HTML5 bloque la soumission ou erreur affichée |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

### 3.2 Connexion

---

**UT-05** — Connexion avec des identifiants valides  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ❌ Manuel (données de test requises)

**Préconditions :** Un compte "jean@test.com" / "motdepasse123" existe en base.

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Naviguer vers `/login` | Le formulaire de connexion s'affiche |
| 2 | Saisir "jean@test.com" | Email rempli |
| 3 | Saisir "motdepasse123" | Mot de passe rempli |
| 4 | Cliquer sur "Se connecter" | Redirection vers la page d'accueil. La session est ouverte. |
| 5 | Vérifier la présence du menu utilisateur | Lien "Profil" ou "Se déconnecter" visible |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**UT-06** — Connexion avec des identifiants invalides  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Playwright

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Naviguer vers `/login` | Le formulaire s'affiche |
| 2 | Saisir "nope@nope.com" et "mauvaismdp" | Champs remplis |
| 3 | Cliquer sur "Se connecter" | Message d'erreur affiché (`role="alert"`). Aucune redirection. |
| 4 | Vérifier l'URL | L'URL reste `/login` |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**UT-07** — Redirection des pages protégées vers /login  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Playwright

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Sans être connecté, naviguer vers `/profil` | Redirection automatique vers `/login` |
| 2 | Sans être connecté, naviguer vers `/admin` | Redirection automatique vers `/login` |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

### 3.3 Profil utilisateur

---

**UT-08** — Modification du nom et de l'email  
**Type :** Fonctionnel | **Priorité :** P2 | **Automatisé :** ❌ Manuel

**Préconditions :** L'utilisateur est connecté.

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Naviguer vers `/profil` | Le formulaire de profil s'affiche avec les valeurs actuelles |
| 2 | Modifier le champ "Nom" | Le champ est éditable |
| 3 | Cliquer sur "Enregistrer" | Message de succès (`role="status"`) : "Profil mis à jour avec succès" |
| 4 | Rafraîchir la page | Les nouvelles valeurs sont persistées |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**UT-09** — Changement de mot de passe  
**Type :** Fonctionnel | **Priorité :** P2 | **Automatisé :** ❌ Manuel

**Préconditions :** L'utilisateur est connecté.

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Naviguer vers `/profil` | La section "Changer le mot de passe" est visible |
| 2 | Saisir le mot de passe actuel | Champ rempli |
| 3 | Saisir un nouveau mot de passe valide | Champ rempli |
| 4 | Confirmer le nouveau mot de passe | Champ rempli |
| 5 | Soumettre | Message de succès. La session reste ouverte. |
| 6 | Se déconnecter puis se reconnecter avec le nouveau mot de passe | Connexion réussie |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**UT-10** — Changement de mot de passe avec confirmation incorrecte  
**Type :** Fonctionnel | **Priorité :** P2 | **Automatisé :** ❌ Manuel

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Remplir le nouveau mot de passe avec "nouveaumdp123" | Champ rempli |
| 2 | Remplir la confirmation avec "autremdp456" | Champ rempli |
| 3 | Soumettre | Erreur (`role="alert"`) : "Les mots de passe ne correspondent pas" |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**UT-11** — Suppression du compte utilisateur  
**Type :** Fonctionnel | **Priorité :** P2 | **Automatisé :** ❌ Manuel

**Préconditions :** L'utilisateur est connecté avec un compte de test.

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Naviguer vers `/profil` | Le bouton "Supprimer mon compte" est visible |
| 2 | Cliquer sur "Supprimer mon compte" | Une confirmation est demandée |
| 3 | Confirmer la suppression | L'utilisateur est déconnecté et redirigé. Le compte n'existe plus en base. |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

### 3.4 Administration des comptes (Admin)

---

**UT-12** — Accès à l'espace admin refusé à un utilisateur standard  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Playwright

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Se connecter avec un compte rôle USER | Connexion réussie |
| 2 | Naviguer vers `/admin` | Redirection vers `/` (page d'accueil) |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**UT-13** — Changement de rôle d'un utilisateur (USER ↔ ADMIN)  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Vitest (router) + ❌ Manuel (UI)

**Préconditions :** Connecté en tant qu'ADMIN. Un utilisateur cible existe.

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Naviguer vers `/admin/users` | La liste des utilisateurs s'affiche |
| 2 | Repérer un utilisateur rôle USER | La ligne de l'utilisateur est visible |
| 3 | Cliquer sur "→ ADMIN" | Le rôle est mis à jour. L'annonce aria-live lit "Rôle mis à jour : ADMIN" |
| 4 | Vérifier que le badge de rôle affiche "ADMIN" | Badge mis à jour sans rechargement de page |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**UT-14** — Désactivation / réactivation d'un compte  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Vitest (router) + ❌ Manuel (UI)

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Sur `/admin/users`, repérer un compte actif | Badge "Actif" visible |
| 2 | Cliquer sur "Désactiver" | Le badge passe à "Inactif". Annonce aria-live : "Compte désactivé" |
| 3 | Cliquer sur "Activer" | Le badge repasse à "Actif". Annonce : "Compte activé" |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

## 4. Module Informations (IF)

### 4.1 Consultation des contenus (rôle public)

---

**IF-01** — Affichage de la liste des contenus publiés  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Playwright + Vitest (router)

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Naviguer vers `/contenus` | La page se charge. Un titre h1 est visible. |
| 2 | Observer la liste | Seuls les contenus `isPublished: true` sont affichés |
| 3 | Vérifier les données de chaque carte | Titre, type (ARTICLE/DOCUMENT), date, auteur visibles |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**IF-02** — Recherche textuelle dans les contenus  
**Type :** Fonctionnel | **Priorité :** P2 | **Automatisé :** ✅ Vitest (router)

**Préconditions :** Au moins deux contenus publiés avec des titres distincts.

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Naviguer vers `/contenus` | La page se charge |
| 2 | Saisir un terme dans le champ de recherche | Le champ est rempli |
| 3 | Observer les résultats | Seuls les contenus dont le titre ou le corps contient le terme sont affichés |
| 4 | Effacer la recherche | Tous les contenus publiés réapparaissent |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**IF-03** — Tri des contenus par date  
**Type :** Fonctionnel | **Priorité :** P3 | **Automatisé :** ✅ Vitest (router)

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Sur `/contenus`, sélectionner "Plus récents" | Les contenus sont triés du plus récent au plus ancien |
| 2 | Sélectionner "Plus anciens" | Les contenus sont triés du plus ancien au plus récent |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**IF-04** — Consultation du détail d'un contenu  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Playwright

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Sur `/contenus`, cliquer sur un article | Navigation vers `/contenus/[id]` |
| 2 | Observer la page | Titre h1, corps du texte, type (Badge), date, auteur visibles |
| 3 | Vérifier le lien "Retour aux contenus" | Le lien est visible et fonctionnel |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**IF-05** — Lecture à voix haute (Web Speech API)  
**Type :** Fonctionnel | **Priorité :** P2 | **Automatisé :** ✅ Vitest (composant) + ❌ Manuel (audio)

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Sur `/contenus/[id]`, repérer le bouton "Lire à voix haute" | Le bouton est visible avec `aria-pressed="false"` |
| 2 | Cliquer sur le bouton | La lecture démarre. Le bouton affiche "Arrêter". `aria-pressed="true"` |
| 3 | Vérifier le contenu lu | Le titre puis le corps sont lus en français (`lang="fr-FR"`) |
| 4 | Cliquer sur "Arrêter" | La lecture s'arrête. Le bouton revient à son état initial |

**Résultat obtenu :** ⏭️  
**Observations :** Comportement audio à valider manuellement sur navigateur réel.

---

**IF-06** — Un contenu non publié n'est pas accessible en mode public  
**Type :** Unitaire + Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Vitest (router)

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Récupérer l'id d'un contenu `isPublished: false` | Id connu |
| 2 | Naviguer vers `/contenus/[id]` | Page 404 affichée |
| 3 | Vérifier que le contenu n'apparaît pas dans la liste `/contenus` | Contenu absent |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**IF-07** — Affichage d'une vidéo YouTube intégrée  
**Type :** Unitaire + Fonctionnel | **Priorité :** P3 | **Automatisé :** ✅ Vitest (getYoutubeEmbedUrl)

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Ouvrir un contenu avec une `videoUrl` YouTube valide | La page se charge |
| 2 | Observer la zone vidéo | Un `<iframe>` avec l'URL embed YouTube est affiché |
| 3 | Tester avec une URL `youtu.be` courte | L'iframe est également généré correctement |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

### 4.2 Administration des contenus (Admin)

---

**IF-08** — Création d'un contenu depuis le back-office  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ❌ Manuel

**Préconditions :** Connecté en tant qu'ADMIN.

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Naviguer vers `/admin/contenus` | La liste des contenus admin s'affiche |
| 2 | Cliquer sur "Nouveau contenu" | Un formulaire de création s'ouvre (Dialog/Modal) |
| 3 | Remplir le titre, le type (ARTICLE ou DOCUMENT), le corps | Les champs sont remplis |
| 4 | Soumettre | Le contenu est créé en statut "Brouillon". Il apparaît dans la liste. |
| 5 | Vérifier que le contenu n'est pas visible sur `/contenus` | Absent de la liste publique |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**IF-09** — Publication / dépublication d'un contenu  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Vitest (router) + ❌ Manuel (UI)

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Sur `/admin/contenus`, repérer un contenu "Brouillon" | Badge "Brouillon" visible |
| 2 | Cliquer sur "Publier" | Badge passe à "Publié". Annonce aria-live : "Contenu publié" |
| 3 | Vérifier que le contenu apparaît sur `/contenus` | Contenu visible publiquement |
| 4 | Cliquer sur "Dépublier" | Badge revient à "Brouillon". Annonce : "Contenu dépublié" |
| 5 | Vérifier que le contenu disparaît de `/contenus` | Contenu absent |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**IF-10** — Modification d'un contenu existant  
**Type :** Fonctionnel | **Priorité :** P2 | **Automatisé :** ❌ Manuel

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Sur `/admin/contenus`, cliquer sur "Modifier" d'un contenu | Le formulaire s'ouvre pré-rempli avec les valeurs actuelles |
| 2 | Modifier le titre | Le champ est éditable |
| 3 | Soumettre | Le titre est mis à jour dans la liste. Les modifications sont persistées. |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**IF-11** — Suppression d'un contenu  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Vitest (router) + ❌ Manuel (UI)

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Sur `/admin/contenus`, cliquer sur "Supprimer" | Une confirmation est demandée (dialog natif) |
| 2 | Confirmer | Le contenu est supprimé. Annonce : "Contenu supprimé". La liste se rafraîchit. |
| 3 | Vérifier que le contenu n'est plus accessible | Page 404 sur `/contenus/[id]` |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

## 5. Module Exercice Cardiaque (EC)

### 5.1 Consultation et démarrage

---

**EC-01** — Affichage des exercices presets  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Vitest (router) + Playwright

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Naviguer vers `/exercice` | La page se charge. Un heading h1 est visible. |
| 2 | Observer la liste des presets | Les exercices presets sont affichés avec nom et paramètres |
| 3 | Vérifier les données affichées | Nombre de cycles, temps inspiration/apnée/expiration visibles |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**EC-02** — Démarrage d'un exercice depuis un preset  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Playwright

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Sur `/exercice`, cliquer sur "Commencer" d'un preset | Le compte à rebours démarre : 3, 2, 1 |
| 2 | Observer la phase de préparation | Message "Préparez-vous..." avec décompte animé |
| 3 | Attendre la fin du compte à rebours (3 secondes) | L'exercice démarre. Le timer circulaire apparaît. |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**EC-03** — Déroulement des phases de l'exercice  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ❌ Manuel

**Préconditions :** Un exercice est en cours d'exécution.

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Observer la phase d'inspiration | Label "Inspirez" affiché en vert. Timer en décompte. |
| 2 | Si apnée > 0 : observer la transition | Label passe à "Retenez" en teal |
| 3 | Observer la phase d'expiration | Label passe à "Expirez" en jaune |
| 4 | Observer la transition de cycle | Le compteur "Cycle X / N" s'incrémente |
| 5 | Observer la fin du dernier cycle | Écran "Exercice terminé !" avec animation |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**EC-04** — Annulation d'un exercice en cours  
**Type :** Fonctionnel | **Priorité :** P2 | **Automatisé :** ❌ Manuel

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Démarrer un exercice | Le timer est en cours |
| 2 | Cliquer sur "✕ Arrêter" | L'exercice s'arrête. Le configurateur réapparaît. |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**EC-05** — Guidage vocal pendant l'exercice  
**Type :** Fonctionnel | **Priorité :** P2 | **Automatisé :** ✅ Vitest (composant) + ❌ Manuel (audio)

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Démarrer un exercice | Le timer démarre avec le compte à rebours |
| 2 | Repérer le bouton "Guidage vocal OFF" | Le bouton est visible avec `aria-pressed="false"` |
| 3 | Cliquer sur le bouton | Le bouton affiche "Guidage vocal ON" et `aria-pressed="true"` |
| 4 | Observer le compte à rebours | Les chiffres "3", "2", "1" sont annoncés vocalement |
| 5 | Observer les changements de phase | "Inspirez", "Retenez", "Expirez" sont annoncés vocalement |
| 6 | Observer la fin d'exercice | "Exercice terminé. Bravo !" est annoncé |
| 7 | Recliquer sur le bouton | Le guidage s'arrête (`aria-pressed="false"`) |

**Résultat obtenu :** ⏭️  
**Observations :** Comportement audio à valider manuellement.

---

### 5.2 Configuration personnelle (utilisateur connecté)

---

**EC-06** — Sauvegarde d'une configuration personnalisée  
**Type :** Fonctionnel | **Priorité :** P2 | **Automatisé :** ✅ Vitest (router)

**Préconditions :** L'utilisateur est connecté.

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Sur `/exercice`, modifier les paramètres (cycles, temps) | Les valeurs sont modifiées dans le formulaire |
| 2 | Cliquer sur "Sauvegarder ma configuration" | Message de confirmation. La config est stockée en base. |
| 3 | Rafraîchir la page | Les paramètres personnalisés sont rechargés automatiquement |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**EC-07** — Mise à jour d'une configuration existante (pas de doublon)  
**Type :** Unitaire | **Priorité :** P2 | **Automatisé :** ✅ Vitest (router)

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Sauvegarder une première configuration | Un enregistrement créé en base (`isPreset: false`) |
| 2 | Modifier les paramètres et sauvegarder à nouveau | Le même enregistrement est mis à jour (pas de doublon) |
| 3 | Vérifier en base | Un seul enregistrement `isPreset: false` par utilisateur |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**EC-08** — Accès à saveUserConfig sans authentification  
**Type :** Unitaire | **Priorité :** P1 | **Automatisé :** ✅ Vitest (router)

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Appeler `saveUserConfig` sans session | Erreur `UNAUTHORIZED` (code 401) |
| 2 | Vérifier qu'aucun enregistrement n'est créé | Base inchangée |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

### 5.3 Administration des exercices (Admin)

---

**EC-09** — Création d'un exercice preset depuis le back-office  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ❌ Manuel

**Préconditions :** Connecté en tant qu'ADMIN.

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Naviguer vers `/admin/exercices` | La liste des presets s'affiche |
| 2 | Cliquer sur "Nouvel exercice" | Le formulaire de création s'ouvre |
| 3 | Remplir nom, cycles, temps inspiration/apnée/expiration | Champs remplis |
| 4 | Soumettre | L'exercice apparaît dans la liste admin et sur `/exercice` |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**EC-10** — Suppression d'un exercice preset  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Vitest (router) + ❌ Manuel (UI)

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Sur `/admin/exercices`, cliquer sur "Supprimer" d'un preset | Confirmation demandée |
| 2 | Confirmer | L'exercice est supprimé. Annonce : "Exercice supprimé". |
| 3 | Vérifier sur `/exercice` | Le preset n'apparaît plus |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**EC-11** — Validation des paramètres (contraintes Zod)  
**Type :** Unitaire | **Priorité :** P1 | **Automatisé :** ✅ Vitest

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Créer un exercice avec `tempsInspiration: 0` | Erreur de validation : valeur minimum 1 |
| 2 | Créer un exercice avec `tempsApnee: -1` | Erreur de validation : valeur minimum 0 |
| 3 | Créer un exercice avec `nombreCycles: 0` | Erreur de validation : valeur minimum 1 |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

## 6. Tests de non-régression (NR)

Ces tests sont exécutés **avant chaque mise en production**. Leur échec bloque la livraison.

---

**NR-01** — Le dashboard admin reste en thème clair quelle que soit la préférence système  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ❌ Manuel

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Activer le mode sombre via le toggle | Le site principal passe en dark mode |
| 2 | Naviguer vers `/admin` | L'interface admin reste en fond blanc |
| 3 | Vérifier la sidebar et les tableaux | Fond blanc, texte gris foncé — non affecté par le toggle |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**NR-02** — Navigation entre toutes les pages sans erreur  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Playwright

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Naviguer vers `/` | Chargement sans erreur console |
| 2 | Naviguer vers `/contenus` | Chargement sans erreur |
| 3 | Naviguer vers `/exercice` | Chargement sans erreur |
| 4 | Naviguer vers `/login` | Chargement sans erreur |
| 5 | Naviguer vers `/mentions-legales` | Chargement sans erreur |
| 6 | Naviguer vers `/politique-de-confidentialite` | Chargement sans erreur |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**NR-03** — Accessibilité RGAA — lien d'évitement et focus clavier  
**Type :** Fonctionnel | **Priorité :** P1 | **Automatisé :** ✅ Playwright

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Charger n'importe quelle page | La page se charge |
| 2 | Appuyer sur Tab | Le lien "Aller au contenu principal" devient visible |
| 3 | Appuyer sur Entrée | Le focus se déplace sur `#main-content` |
| 4 | Continuer à tabber | Tous les éléments interactifs reçoivent un outline visible |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**NR-04** — Accessibilité RGAA — annonces aria-live  
**Type :** Composant | **Priorité :** P1 | **Automatisé :** ✅ Vitest

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Publier un contenu depuis l'admin | La région `aria-live` annonce "Contenu publié" |
| 2 | Changer le rôle d'un utilisateur | Annonce "Rôle mis à jour : ADMIN/USER" |
| 3 | Supprimer un exercice | Annonce "Exercice supprimé" |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

**NR-05** — Affichage responsive sur mobile (375 px)  
**Type :** Fonctionnel | **Priorité :** P2 | **Automatisé :** ✅ Playwright (Mobile Chrome)

| # | Étape | Résultat attendu |
|---|-------|-----------------|
| 1 | Ouvrir l'application en viewport 375×812 (iPhone SE) | La page d'accueil s'affiche sans défilement horizontal |
| 2 | Vérifier la navigation | Le menu hamburger est visible. Les liens s'affichent au clic. |
| 3 | Ouvrir `/exercice` | Le timer circulaire est visible et adapté à l'écran |
| 4 | Ouvrir `/admin` sur mobile | La sidebar devient un menu déroulant en haut |

**Résultat obtenu :** ⏭️  
**Observations :** —

---

## 7. Matrice de couverture

| ID | Intitulé | U | F | NR | Auto | Priorité | Statut |
|----|----------|---|---|----|------|----------|--------|
| UT-01 | Inscription valide | | ✅ | | Playwright | P1 | ⏭️ |
| UT-02 | Email déjà utilisé | | ✅ | | Manuel | P1 | ⏭️ |
| UT-03 | Mot de passe trop court | ✅ | ✅ | | Vitest | P1 | ⏭️ |
| UT-04 | Email mal formaté | | ✅ | | Manuel | P2 | ⏭️ |
| UT-05 | Connexion valide | | ✅ | | Manuel | P1 | ⏭️ |
| UT-06 | Connexion invalide | | ✅ | | Playwright | P1 | ⏭️ |
| UT-07 | Redirection pages protégées | | ✅ | | Playwright | P1 | ⏭️ |
| UT-08 | Modification profil | | ✅ | | Manuel | P2 | ⏭️ |
| UT-09 | Changement mot de passe | | ✅ | | Manuel | P2 | ⏭️ |
| UT-10 | Confirmation mot de passe incorrecte | | ✅ | | Manuel | P2 | ⏭️ |
| UT-11 | Suppression de compte | | ✅ | | Manuel | P2 | ⏭️ |
| UT-12 | Accès admin refusé (USER) | | ✅ | | Playwright | P1 | ⏭️ |
| UT-13 | Changement de rôle | ✅ | ✅ | | Vitest + Manuel | P1 | ⏭️ |
| UT-14 | Activation / désactivation | ✅ | ✅ | | Vitest + Manuel | P1 | ⏭️ |
| IF-01 | Liste des contenus publiés | ✅ | ✅ | | Vitest + Playwright | P1 | ⏭️ |
| IF-02 | Recherche textuelle | ✅ | ✅ | | Vitest | P2 | ⏭️ |
| IF-03 | Tri par date | ✅ | ✅ | | Vitest | P3 | ⏭️ |
| IF-04 | Détail d'un contenu | | ✅ | | Playwright | P1 | ⏭️ |
| IF-05 | Lecture à voix haute | | ✅ | | Vitest + Manuel | P2 | ⏭️ |
| IF-06 | Contenu non publié inaccessible | ✅ | ✅ | | Vitest | P1 | ⏭️ |
| IF-07 | Vidéo YouTube intégrée | ✅ | ✅ | | Vitest | P3 | ⏭️ |
| IF-08 | Création de contenu (admin) | | ✅ | | Manuel | P1 | ⏭️ |
| IF-09 | Publication / dépublication | ✅ | ✅ | | Vitest + Manuel | P1 | ⏭️ |
| IF-10 | Modification de contenu | | ✅ | | Manuel | P2 | ⏭️ |
| IF-11 | Suppression de contenu | ✅ | ✅ | | Vitest + Manuel | P1 | ⏭️ |
| EC-01 | Liste des presets | ✅ | ✅ | | Vitest + Playwright | P1 | ⏭️ |
| EC-02 | Démarrage d'un preset | | ✅ | | Playwright | P1 | ⏭️ |
| EC-03 | Déroulement des phases | | ✅ | | Manuel | P1 | ⏭️ |
| EC-04 | Annulation d'exercice | | ✅ | | Manuel | P2 | ⏭️ |
| EC-05 | Guidage vocal | | ✅ | | Vitest + Manuel | P2 | ⏭️ |
| EC-06 | Sauvegarde config personnelle | ✅ | ✅ | | Vitest | P2 | ⏭️ |
| EC-07 | Mise à jour sans doublon | ✅ | | | Vitest | P2 | ⏭️ |
| EC-08 | saveUserConfig sans auth | ✅ | | | Vitest | P1 | ⏭️ |
| EC-09 | Création preset (admin) | | ✅ | | Manuel | P1 | ⏭️ |
| EC-10 | Suppression preset (admin) | ✅ | ✅ | | Vitest + Manuel | P1 | ⏭️ |
| EC-11 | Validation Zod exercice | ✅ | | | Vitest | P1 | ⏭️ |
| NR-01 | Admin toujours en mode clair | | | ✅ | Manuel | P1 | ⏭️ |
| NR-02 | Navigation sans erreur | | | ✅ | Playwright | P1 | ⏭️ |
| NR-03 | Lien d'évitement / focus clavier | | | ✅ | Playwright | P1 | ⏭️ |
| NR-04 | Annonces aria-live | | | ✅ | Vitest | P1 | ⏭️ |
| NR-05 | Responsive mobile 375 px | | | ✅ | Playwright | P2 | ⏭️ |

**Total : 40 scénarios** — 34 automatisés (Vitest ou Playwright), 10 manuels

---

## 8. Procédure d'exécution des tests

### Tests automatisés

```bash
# 1. Tests unitaires et composants
npm run test:run

# 2. Tests fonctionnels E2E (serveur de dev requis)
npm run test:e2e:install   # première fois uniquement
npm run test:e2e

# 3. Rapport de couverture (optionnel)
npm run test:coverage
```

### Tests manuels

Les tests manuels (UT-02, UT-04, UT-05, UT-08 à UT-11, IF-05, IF-08, IF-10, EC-03, EC-04, EC-05, EC-09, NR-01) doivent être exécutés par un testeur sur un environnement de recette connecté à une base de données réelle.

**Environnement de recette requis :**
- URL de recette accessible
- Compte ADMIN de test disponible
- Compte USER de test disponible
- Au moins 3 contenus dont 1 publié et 1 brouillon
- Au moins 2 exercices presets

### Critère de succès

- **Livraison bloquée** si un test P1 échoue
- **Alerte** si un test P2 échoue (décision de livraison au chef de projet)
- Les tests NR doivent tous passer avant mise en production
