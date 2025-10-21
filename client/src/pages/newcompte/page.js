import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let C = {};

C.handler_submitForm = async function(ev) {
    ev.preventDefault();
    
    const form = ev.target;
    const formData = {
        action: 'register',
        prenom: form.querySelector('input[name="prenom"]').value,
        nom: form.querySelector('input[name="nom"]').value,
        email: form.querySelector('input[type="email"]').value,
        mot_de_passe: form.querySelector('input[type="password"]').value,
        pays: form.querySelector('select').value,
        date_naissance: form.querySelector('input[type="date"]').value
    };
    // Validation côté client
    if (!formData.prenom || !formData.nom || !formData.email || !formData.mot_de_passe) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    // Validation du mot de passe
    const password = formData.mot_de_passe;
    if (password.length < 8 || !/[0-9]/.test(password) || !/[A-Za-z]/.test(password)) {
        alert('Le mot de passe doit contenir au moins 8 caractères, des lettres et des chiffres');
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
    const form = fragment.querySelector('form');
    if (form) {
        form.addEventListener('submit', C.handler_submitForm);
    }
};

export function NewComptesPage() {
    return C.init();
}