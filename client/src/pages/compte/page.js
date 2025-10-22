import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { UserData } from "../../data/user.js";

let C = {};

C.handler_submitLogin = async function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    
    const form = ev.target;
    const formData = new FormData(form);
    
    const data = {
        action: 'login', // ✅ IMPORTANT: Ajouter l'action pour la connexion
        email: formData.get("email"),
        password: formData.get("password")
    };
    
    console.log("Données de connexion envoyées:", data);
    
    try {
        const result = await UserData.login(data);
        
        console.log("Résultat de connexion:", result);
        
        if (result && result.success) {
            alert('Connexion réussie ! Bienvenue ' + result.user.firstname);
            window.location.href = '/profil'; // Rediriger vers la page d'accueil
        } else {
            alert(result.error || 'Email ou mot de passe incorrect');
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        alert('Erreur lors de la connexion. Veuillez réessayer.');
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