import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { getRequest, deleteRequest } from "../../lib/api-request.js";

let M = {
    user: null
};

let C = {};

/**
 * Gestionnaire de déconnexion
 */
C.handler_logout = async function(ev) {
    ev.preventDefault();
    
    console.log("📤 Tentative de déconnexion...");
    
    // Appeler l'API via deleteRequest
    const result = await deleteRequest('auth');
    
    console.log("📥 Réponse du serveur:", result);
    
    if (result && result.success) {
        console.log("✅ Session détruite côté serveur");
        alert('Déconnexion réussie');
        
        // Rediriger vers la page de connexion
        window.location.href = '/compte';
        
    } else {
        alert('Erreur lors de la déconnexion');
    }
};

/**
 * Initialisation de la page profil
 * Note: Le router a déjà vérifié l'authentification grâce à requireAuth: true
 */
C.init = async function() {
    console.log("🔍 Chargement du profil utilisateur...");
    
    // Récupérer les infos utilisateur depuis la session
    const authData = await getRequest('auth');
    console.log("📥 Données d'authentification:", authData);
    
    if (authData && authData.is_authenticated) {
        console.log("✅ Utilisateur authentifié, affichage du profil");
        M.user = authData.user;
        return V.init(M.user);
    } else {
        // Ne devrait jamais arriver ici grâce à requireAuth
        console.error("❌ Utilisateur non authentifié malgré requireAuth");
        return '<div>Erreur: Utilisateur non authentifié</div>';
    }
};

let V = {};

V.init = function(user) {
    let fragment = htmlToFragment(template);
    V.fillUserData(fragment, user);
    V.attachEvents(fragment);
    return fragment;
};

V.fillUserData = function(fragment, user) {
    // Remplir les champs du formulaire
    fragment.querySelector('#user-firstname').value = user.prenom || '';
    fragment.querySelector('#user-lastname').value = user.nom || '';
    fragment.querySelector('#user-email').value = user.email || '';
    
    // Cocher le bon bouton radio pour la civilité
    if (user.gender === 'M') {
        fragment.querySelector('#user-gender-m').checked = true;
    } else if (user.gender === 'F') {
        fragment.querySelector('#user-gender-f').checked = true;
    }
    
    // Remplir les informations du profil (colonne gauche)
    fragment.querySelector('#user-fullname').textContent = `${user.prenom || ''} ${user.nom || ''}`.trim();
    fragment.querySelector('#user-id').textContent = user.id || '';
    
    // Message de bienvenue
    const genderText = user.gender === 'M' ? 'Monsieur' : user.gender === 'F' ? 'Madame' : '';
    fragment.querySelector('#user-welcome').textContent = `Bonjour ${genderText} ${user.nom || ''}`.trim();
};

V.attachEvents = function(fragment) {
    const logoutBtn = fragment.querySelector('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', C.handler_logout);
    }
};

export function ProfilPage() {
    return C.init();
}