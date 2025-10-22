import {jsonPostRequest} from '../lib/api-request.js';

let UserData = {};

UserData.create = async function(userInfo) {
    console.log("UserData.create appelé avec:", userInfo);
    const response = await jsonPostRequest('users', JSON.stringify(userInfo));
    console.log("Réponse de jsonPostRequest:", response);
    return response;
};

// ✅ AJOUTER CETTE MÉTHODE
UserData.login = async function(credentials) {
    console.log("UserData.login appelé avec:", credentials);
    const response = await jsonPostRequest('users', JSON.stringify(credentials));
    console.log("Réponse de login:", response);
    return response;
};

export { UserData };