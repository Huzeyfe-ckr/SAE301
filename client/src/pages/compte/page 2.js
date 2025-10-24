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

    const email = formData.get("email");
    const password = formData.get("password");
    
    if (!email || !password) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
   
    const data = {
        action: 'login',
        email: email,
        password: password
    };
    
    const response = await jsonPostRequest('auth', data);


    if (response && response.success) {

        await updateAuthStatus();

        alert('Connexion réussie ! Bienvenue ' + response.user.prenom);
        window.location.href = '/profil';
        
    } else {
        alert(response.error || 'Email ou mot de passe incorrect');
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