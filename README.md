# CRM STELNEO - Système de Gestion Client

Un CRM complet et moderne pour la gestion de vos clients, leads, commandes et contacts.

## 🚀 Fonctionnalités

### ✅ Gestion des Clients
- Ajout, modification et suppression de clients
- Suivi du statut (Prospect, Actif, Inactif)
- Historique des contacts
- Origine des clients (Site web, Réseaux sociaux, Recommandation, etc.)

### ✅ Gestion des Leads
- Conversion de leads en clients
- Suivi des sources de leads
- Statuts de progression (Nouveau, Contacté, Intéressé, Converti)

### ✅ Gestion des Commandes
- Création et suivi des commandes
- Types d'emballages (Standard, Premium, Écologique, Sur mesure)
- Calcul automatique des totaux
- Statuts de commande (En attente, Confirmée, En production, Expédiée, Livrée)

### ✅ Historique des Contacts
- Suivi de tous les contacts (Appels, Emails, RDV)
- Notes détaillées sur chaque échange
- Prochaines étapes à suivre
- Utilisateur responsable du contact

### ✅ Templates d'Emails
- Templates prédéfinis pour différents types de communication
- Variables dynamiques ({{nom}}, {{entreprise}}, {{utilisateur}}, etc.)
- Gestion complète des templates

### ✅ Analytics et Statistiques
- Tableau de bord avec KPIs
- Graphiques d'origine des clients
- Évolution des ventes
- Performance par mois
- Types d'emballages vendus
- Sources de leads

### ✅ Recherche Globale
- Recherche dans tous les modules
- Filtres avancés
- Interface intuitive

## 🛠️ Installation et Utilisation

### Version Locale (Recommandée pour débuter)

1. **Téléchargez les fichiers** dans un dossier sur votre ordinateur
2. **Ouvrez `index.html`** dans votre navigateur web
3. **C'est tout !** Le CRM fonctionne immédiatement

### Données et Sauvegarde

- **Stockage local** : Toutes les données sont stockées dans le navigateur (localStorage)
- **Sauvegarde** : Utilisez la fonction d'export dans les paramètres
- **Import** : Vous pouvez importer des sauvegardes pour restaurer vos données

## 🌐 Déploiement sur Vercel (Pour collaboration)

Si vous voulez que les deux utilisateurs puissent accéder au CRM en même temps :

### Option 1 : Déploiement Simple

1. **Créez un compte** sur [Vercel.com](https://vercel.com)
2. **Connectez votre GitHub** (créez un repo avec ces fichiers)
3. **Déployez** en un clic depuis Vercel
4. **Partagez l'URL** avec votre collègue

### Option 2 : Version Cloud Avancée

Pour une vraie collaboration en temps réel, nous pouvons créer une version avec :
- Base de données Supabase (gratuite)
- Synchronisation en temps réel
- Comptes utilisateurs
- Sauvegarde automatique

## 📱 Utilisation

### Navigation
- **Tableau de bord** : Vue d'ensemble et statistiques
- **Clients** : Gestion de votre base clients
- **Leads** : Suivi des prospects
- **Commandes** : Gestion des ventes
- **Contacts** : Historique des échanges
- **Templates** : Modèles d'emails
- **Analytics** : Analyses détaillées

### Ajout de Données
1. Cliquez sur le bouton **"Nouveau"** dans chaque section
2. Remplissez le formulaire
3. Sauvegardez

### Recherche
- Utilisez la **barre de recherche** en haut pour trouver rapidement clients, contacts, etc.
- Utilisez les **filtres** dans chaque section pour affiner les résultats

### Templates d'Emails
- Créez des templates avec des variables comme `{{nom}}`, `{{entreprise}}`
- Utilisez-les pour standardiser vos communications

## 🔧 Personnalisation

### Modifier les Types d'Emballages
Éditez le fichier `app.js`, section `showOrderModal()` pour ajouter/modifier les types.

### Ajouter de Nouveaux Statuts
Modifiez les options dans les formulaires selon vos besoins.

### Changer l'Apparence
Éditez le fichier `styles.css` pour personnaliser les couleurs et le design.

## 📊 Données d'Exemple

Le CRM inclut des templates d'emails prédéfinis pour vous aider à démarrer :
- Premier contact
- Relance commerciale
- Confirmation de commande

## 🔒 Sécurité et Confidentialité

- **Données locales** : Vos données restent sur votre ordinateur
- **Pas de serveur** : Aucune donnée n'est envoyée sur internet (version locale)
- **Sauvegarde** : Exportez régulièrement vos données

## 🆘 Support

### Problèmes Courants

**Le CRM ne se charge pas :**
- Vérifiez que tous les fichiers sont dans le même dossier
- Ouvrez la console du navigateur (F12) pour voir les erreurs

**Données perdues :**
- Vérifiez que localStorage est activé dans votre navigateur
- Importez votre dernière sauvegarde

**Performance lente :**
- Exportez vos données et redémarrez le navigateur
- Supprimez les anciens contacts si nécessaire

### Fonctionnalités Avancées

Pour des besoins spécifiques, nous pouvons ajouter :
- Import/Export Excel
- Intégration email
- Notifications
- Rapports personnalisés
- API pour intégrations

## 🚀 Prochaines Étapes

1. **Testez** le CRM avec vos données
2. **Personnalisez** selon vos besoins
3. **Formez** votre équipe
4. **Déployez** sur Vercel si nécessaire
5. **Évoluez** avec de nouvelles fonctionnalités

---

**Développé spécialement pour STELNEO** - Un CRM simple, efficace et adapté à vos besoins d'emballage.

*Besoin d'aide ? Contactez-nous pour des modifications ou des fonctionnalités supplémentaires.*
