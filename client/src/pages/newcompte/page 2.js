import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { jsonPostRequest } from "../../lib/api-request.js";

let C = {};

/**
 * Gestionnaire de soumission du formulaire d'inscription
 */
C.handler_submitForm = async function(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    let form = ev.target;
    let formData = new FormData(form);
    
    let data = {
        action: 'register',
        email: formData.get("email"),
        password: formData.get("password"),
        gender: formData.get("gender"),
        prenom: formData.get("prenom"),
        nom: formData.get("nom")
    };
    
   
    
    // Appeler l'API via jsonPostRequest
    const result = await jsonPostRequest('users', data);
    
    
    if (result && result.success) {
        console.log("✅ Inscription réussie");
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        window.location.href = '/compte';
        
    } else {
        alert(result.error || 'Erreur lors de l\'inscription');
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

V.newComptesFragment = function(data) {
    let pagefragment = htmlToFragment(template);
    let formDOM = pagefragment.querySelector('form');
    return pagefragment;
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