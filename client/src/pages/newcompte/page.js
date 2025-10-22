import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { UserData } from "../../data/user.js";

let C = {};

C.handler_submitForm = async function(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    let form = ev.target;
    let formData = new FormData(form);

    console.log("Données du formulaire:");
    console.log(formData.get("email"));
    console.log(formData.get("password"));
    console.log(formData.get("gender"));
    console.log(formData.get("prenom"));
    console.log(formData.get("nom"));
    
    // ✅ Préparer les données avec les bons noms de propriétés
    let data = {
        action: 'register', // ✅ IMPORTANT: Ajouter l'action
        email: formData.get("email"),
        password: formData.get("password"), // ✅ Utiliser "password" (sera converti côté serveur)
        gender: formData.get("gender"),
        prenom: formData.get("prenom"),
        nom: formData.get("nom")
    };
    
    console.log("Données envoyées à l'API:", data);
    
    try {
        // ✅ Utiliser await pour attendre la réponse
        const result = await UserData.create(data);
        
        console.log("Résultat de l'API:", result);
        
        if (result && result.success) {
            alert('Inscription réussie ! Bienvenue ' + result.user.firstname);
            window.location.href = '/';
        } else {
            alert(result.error || 'Erreur lors de l\'inscription');
        }
    } catch (error) {
        console.error('Erreur complète:', error);
        alert('Erreur lors de l\'inscription. Veuillez réessayer.');
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