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
    fragment.querySelector('#user-firstname').textContent = user.prenom || 'Non renseigné';
    fragment.querySelector('#user-lastname').textContent = user.nom || 'Non renseigné';
    fragment.querySelector('#user-email').textContent = user.email || 'Non renseigné';
    
    const genderText = user.gender === 'M' ? 'Monsieur' : user.gender === 'F' ? 'Madame' : 'Non renseigné';
    fragment.querySelector('#user-gender').textContent = genderText;
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