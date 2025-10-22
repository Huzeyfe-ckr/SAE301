import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { jsonPostRequest } from "../../lib/api-request.js";
import { updateAuthStatus } from "../../main.js";

let C = {};


C.handler_submitLogin = async function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    
    const form = ev.target;
    const formData = new FormData(form);
    
   
    const data = {
        email: formData.get("email"),
        password: formData.get("password")
    };
    
    const result = await jsonPostRequest('auth', JSON.stringify(data));
    
    
    if (result && result.success) {
        
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