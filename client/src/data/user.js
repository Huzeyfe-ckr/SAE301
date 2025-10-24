import {jsonPostRequest} from '../lib/api-request.js';

const STORAGE_KEY = 'user_data';

let UserData = {};

// Créer un utilisateur
UserData.create = async function(userInfo) {
    console.log("UserData.create appelé avec:", userInfo);
    const response = await jsonPostRequest('users', JSON.stringify(userInfo));
    console.log("Réponse de jsonPostRequest:", response);
    return response;
};

// Connexion
UserData.login = async function(credentials) {
    console.log("UserData.login appelé avec:", credentials);
    const response = await jsonPostRequest('auth', JSON.stringify(credentials));
    console.log("Réponse de login:", response);
    
    if (response && response.user) {
        // Sauvegarder l'utilisateur dans le localStorage
        UserData.set(response.user);
    }
    
    return response;
};

// ✅ Récupérer l'utilisateur connecté
UserData.get = function() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
};

// ✅ Sauvegarder l'utilisateur
UserData.set = function(userData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
};

// ✅ Supprimer l'utilisateur (déconnexion)
UserData.clear = function() {
    localStorage.removeItem(STORAGE_KEY);
};

// ✅ Vérifier si l'utilisateur est connecté
UserData.isAuthenticated = function() {
    const user = this.get();
    return user && user.id;
};

// ✅ Récupérer l'ID de l'utilisateur
UserData.getUserId = function() {
    const user = this.get();
    return user ? user.id : null;
};

export { UserData };