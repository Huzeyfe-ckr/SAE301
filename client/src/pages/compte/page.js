import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let C = {};

C.handler_submitLogin = async function(ev) {
    ev.preventDefault();
    
    const form = ev.target;
    const formData = {
        action: 'login',
        email: form.querySelector('#email').value,
        mot_de_passe: form.querySelector('#password').value
    };
    // Validation côté client
    if (!formData.email || !formData.mot_de_passe) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
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