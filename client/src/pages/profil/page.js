import { htmlToFragment } from "../../lib/utils.js";
import { getRequest,postRequest, patchRequest, deleteRequest } from "../../lib/api-request.js";
import template from "./template.html?raw";

let M = {
    user: null
};

let C = {};



/**
 * Gestionnaire de modification du profil (PATCH)
 */
C.handler_editProfile = async function(ev) {
    ev.preventDefault();
    
    const firstname = document.getElementById('user-firstname').value;
    const lastname = document.getElementById('user-lastname').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    
    if (!firstname || !lastname) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    const formData = new FormData();
    formData.append('prenom', firstname);
    formData.append('nom', lastname);
    if (gender) {
        formData.append('gender', gender);
    } 
    // Utiliser PATCH pour la mise à jour partielle
    const response = await patchRequest('users', formData);
    
    if (response && response.success) {
        alert('Profil mis à jour avec succès !');
        
        // Recharger les données utilisateur
        const authData = await getRequest('auth');
        if (authData && authData.is_authenticated) {
            M.user = authData.user;
            V.fillUserData(document.body, M.user);
        }
    } else {
        alert('Erreur : ' + (response?.error || 'Erreur inconnue'));
    }
};

C.handler_updatePassword = async function(ev) {
    ev.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    
    if (!currentPassword || !newPassword) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    if (newPassword.length < 8) {
        alert('Le nouveau mot de passe doit contenir au moins 8 caractères');
        return;
    }
    
    const formData = new FormData();
    formData.append('action', 'update_password');
    formData.append('current_password', currentPassword);
    formData.append('new_password', newPassword);
    
    // POST car c'est une action spécifique, pas une simple mise à jour
    const response = await postRequest('users', formData);
    
    if (response && response.success) {
        alert('Mot de passe modifié avec succès !');
        
        document.getElementById('password-form').reset();
        } else {
            console.error("Erreur lors du changement:", response);
        alert('Erreur : ' + (response?.error || 'Mot de passe actuel incorrect'));
    }
};



C.handler_deleteAccount = async function(ev) {
    ev.preventDefault();
    
    const confirmation = confirm(
        'Êtes-vous sûr de vouloir supprimer votre compte ?\n' +
        'Cette action est irréversible.'
    );
    
    if (!confirmation) return;
    
    const doubleConfirmation = confirm('Confirmation finale : supprimer définitivement le compte ?');
    
    if (!doubleConfirmation) return;
    
    // DELETE pour supprimer la ressource utilisateur
    const response = await deleteRequest('users');
    
    if (response && response.success) {
        alert('Compte supprimé avec succès');
        window.location.href = '/';
    } else {
        console.error("❌ Erreur lors de la suppression:", response);
        alert('Erreur : ' + (response?.error || 'Erreur inconnue'));
    }
};




/**
 * Gestionnaire de déconnexion
 */
C.handler_logout = async function(ev) {
    ev.preventDefault();
    
    // Appeler l'API via deleteRequest
    const result = await deleteRequest('auth');
    
    
    if (result && result.success) {
        alert('Déconnexion réussie');
        
        // Rediriger vers la page de connexion
        window.location.href = '/compte';
        
    } else {
        alert('Erreur lors de la déconnexion');
    }
};

C.togglePassword = function(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
};


/**
 * Initialisation de la page profil
 * Note: Le router a déjà vérifié l'authentification grâce à requireAuth: true
 */
C.init = async function() {
    // Récupérer les infos utilisateur depuis la session
    const authData = await getRequest('auth');
    if (authData && authData.is_authenticated) {
        M.user = authData.user;
        return V.init(M.user);
    } else {
        // Ne devrait jamais arriver ici grâce à requireAuth
        console.error("Utilisateur non authentifié malgré requireAuth");
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

    // Bouton modifier profil
    const editBtn = fragment.querySelector('#edit-profile');
    if (editBtn) {
        editBtn.addEventListener('click', C.handler_editProfile);
    }
    
    // Bouton changer mot de passe
    const updatePasswordBtn = fragment.querySelector('#update-password');
    if (updatePasswordBtn) {
        updatePasswordBtn.addEventListener('click', C.handler_updatePassword);
    }
    
    // Bouton supprimer compte
    const deleteBtn = fragment.querySelector('#delete-account');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', C.handler_deleteAccount);
    }
    
    // Toggle password visibility
    const toggleCurrentPwd = fragment.querySelector('#toggle-current-password');
    if (toggleCurrentPwd) {
        toggleCurrentPwd.addEventListener('click', () => {
            C.togglePassword('current-password', 'toggle-current-password');
        });
    }

    // Toggle new password visibility
    const toggleNewPwd = fragment.querySelector('#toggle-new-password');
    if (toggleNewPwd) {
        toggleNewPwd.addEventListener('click', () => {
            C.togglePassword('new-password', 'toggle-new-password');
        });
    }


};


export function ProfilPage() {
    return C.init();
}