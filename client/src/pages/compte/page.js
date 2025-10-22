import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { jsonPostRequest } from "../../lib/api-request.js";
import { updateAuthStatus } from "../../main.js";

let C = {};

/**
 * Gestionnaire de soumission du formulaire de connexion
 */
C.handler_submitLogin = async function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    
    const form = ev.target;
    const formData = new FormData(form);
    
    // ✅ AuthController n'utilise PAS "action", juste email et password
    const data = {
        email: formData.get("email"),
        password: formData.get("password")
    };
    
    console.log("📤 Tentative de connexion avec:", data.email);
    
    // Appeler l'API via jsonPostRequest
    const result = await jsonPostRequest('auth', JSON.stringify(data));
    
    console.log("📥 Réponse du serveur:", result);
    
    if (result && result.success) {
        console.log("✅ Connexion réussie, session créée côté serveur");
        
        await updateAuthStatus();
        
        alert('Connexion réussie ! Bienvenue ' + result.user.prenom);
        window.location.href = '/profil';
        
    } else {
        alert(result.error || 'Email ou mot de passe incorrect');
    }
};

C.init = function() {
    return V.init();
};

let V = {};

V.init = function() {
    let fragment = htmlToFragment(template);
    V.attachEvents(fragment);
    return fragment;
};

V.attachEvents = function(fragment) {
    const loginForm = fragment.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', C.handler_submitLogin);
    }
};

export function ComptesPage() {
    return C.init();
}