/**
 * Configuration des URLs d'API selon l'environnement
 */

export const getApiUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Développement local
        return "http://localhost:8000/";
    } else if (window.location.hostname === 'mmi.unilim.fr' || window.location.hostname.includes('mmi.unilim.fr')) {
        // Production sur mmi.unilim.fr
        return "https://mmi.unilim.fr/~cakir4/api/";
    } else {
        // Autre environnement
        return window.location.origin + "/api/";
    }
};

export const API_URL = getApiUrl();
