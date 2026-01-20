
import { Router } from "./lib/router.js";
import { AboutPage } from "./pages/about/page.js";
import { HomePage } from "./pages/home/page.js";
import { ProductsPage } from "./pages/products/page.js";
import { ProductDetailPage } from "./pages/productDetail/page.js";
import { RootLayout } from "./layouts/root/layout.js";
import { The404Page } from "./pages/404/page.js";
import { ComptesPage } from "./pages/compte/page.js";
import { NewComptesPage } from "./pages/newcompte/page.js";
import { ProfilPage } from "./pages/profil/page.js";
import { getRequest } from "./lib/api-request.js";
import { PanierPage } from "./pages/panier/page.js";
import { ConfirmationPage } from "./pages/confirmation/page.js";

// Créer le router avec loginPath
const router = new Router('app', {loginPath: '/SAE301/compte'});

// Fonction pour mettre à jour le statut d'auth
async function updateAuthStatus() {
    const result = await getRequest('auth');
    if (result && result.is_authenticated) {
        router.setAuth(true);
    } else {
        router.setAuth(false);
    }
}

// Ajouter le layout principal
router.addLayout("/SAE301/", RootLayout);

// Routes publiques
router.addRoute("/SAE301/", HomePage);
router.addRoute("/SAE301/about", AboutPage);
router.addRoute("/SAE301/products", ProductsPage);
router.addRoute("/SAE301/products/:id/:slug", ProductDetailPage);
router.addRoute("/SAE301/category/:id", ProductsPage);
router.addRoute("/SAE301/compte", ComptesPage); // Page de connexion
router.addRoute("/SAE301/newcompte", NewComptesPage); // Page d'inscription
router.addRoute("/SAE301/panier", PanierPage); // Alias pour la page de panier
router.addRoute("/SAE301/confirmation/:id", ConfirmationPage); // Alias pour la page de confirmation

// ✅ Route protégée - nécessite l'authentification
router.addRoute("/SAE301/profil", ProfilPage, { requireAuth: true });

// Route 404
router.addRoute("*", The404Page);

// ✅ Fonction pour initialiser l'app
async function initApp() {
    // D'abord vérifier l'auth
    await updateAuthStatus();
    // Puis démarrer le router
    router.start();
}

// Démarrer l'app
initApp();

// Exporter
export { router, updateAuthStatus };
