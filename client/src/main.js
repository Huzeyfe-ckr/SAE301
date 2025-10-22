
import { Router } from "./lib/router.js";
import { AboutPage } from "./pages/about/page.js";
import { HomePage } from "./pages/home/page.js";
import { ProductsPage } from "./pages/products/page.js";
import { ProductDetailPage } from "./pages/productDetail/page.js";

import { RootLayout } from "./layouts/root/layout.js";
import { The404Page } from "./pages/404/page.js";
import { ComptesPage } from "./pages/compte/page.js";
import { NewComptesPage } from "./pages/newcompte/page.js";
import { ProfilPage } from "./pages/auth/page.js";

// Exemple d'utilisation avec authentification

const router = new Router('app', {loginPath: '/compte'});

router.addLayout("/", RootLayout);

router.addRoute("/", HomePage);
router.addRoute("/about", AboutPage);

router.addRoute("/products", ProductsPage);
router.addRoute("/products/:id/:slug", ProductDetailPage);

router.addRoute("/category/:id", ProductsPage);
router.addRoute("/compte", ComptesPage);
router.addRoute("/newcompte", NewComptesPage);
router.addRoute("/profil", ProfilPage);


router.addRoute("*", The404Page);


// Démarrer le routeur
router.start();

