import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { getRequest, jsonPostRequest } from "../../lib/api-request.js";

let M = {
    user: null
};

let C = {};

C.handler_logout = async function(ev) {
    ev.preventDefault();
    
    try {
        const result = await jsonPostRequest('auth', JSON.stringify({ action: 'logout' }));
        
        if (result && result.success) {
            alert('Déconnexion réussie');
            window.location.href = '/compte';
        } else {
            alert('Erreur lors de la déconnexion');
        }
    } catch (error) {
        alert('Erreur lors de la déconnexion');
    }
};

C.handler_editProfile = function(ev) {
    ev.preventDefault();
    alert('Fonctionnalité de modification à implémenter');
};

C.init = async function() {
    // Vérifier si l'utilisateur est connecté
    try {
        const authData = await getRequest('auth');
        
        if (!authData || !authData.is_authenticated) {
            window.location.href = '/compte';
            return '<div>Redirection...</div>';
        }
        
        M.user = authData.user;
        return V.init(M.user);
        
    } catch (error) {
         window.location.href = '/compte';
        return '<div>Erreur de chargement...</div>';
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
    fragment.querySelector('#user-firstname').textContent = user.firstname || 'Non renseigné';
    fragment.querySelector('#user-lastname').textContent = user.lastname || 'Non renseigné';
    fragment.querySelector('#user-email').textContent = user.email || 'Non renseigné';
    fragment.querySelector('#user-gender').textContent = user.gender === 'M' ? 'Monsieur' : user.gender === 'F' ? 'Madame' : 'Non renseigné';
};

V.attachEvents = function(fragment) {
    const logoutBtn = fragment.querySelector('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', C.handler_logout);
    }
    
    const editBtn = fragment.querySelector('#edit-profile');
    if (editBtn) {
        editBtn.addEventListener('click', C.handler_editProfile);
    }
};

export function ProfilPage() {
    return C.init();
}