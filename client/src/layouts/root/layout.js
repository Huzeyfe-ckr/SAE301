import template from "./template.html?raw";
import { htmlToFragment } from "../../lib/utils.js";
import { HeaderView } from "../../ui/header/index.js";
import { FooterView } from "../../ui/footer/index.js";

/**
 * Construit et retourne le layout principal de l'application.
 *
 * @function
 * @returns {Promise<DocumentFragment>} Le fragment DOM représentant le layout complet.
 *
 * @description
 * - Crée un fragment DOM à partir du template HTML.
 * - Génère le DOM de l'en-tête via HeaderView.dom() (asynchrone).
 * - Génère le DOM du pied de page via FooterView.dom().
 * - Remplace le slot nommé "header" par le DOM de l'en-tête.
 * - Remplace le slot nommé "footer" par le DOM du pied de page.
 * - Retourne le fragment DOM finalisé.
 */
export async function RootLayout() {
    let layout = htmlToFragment(template);

    // ✅ Attendre le header qui est maintenant asynchrone
    const headerDOM = await HeaderView.dom();
    const footerDOM = FooterView.dom();

    layout.querySelector('slot[name="header"]').replaceWith(headerDOM);
    layout.querySelector('slot[name="footer"]').replaceWith(footerDOM);
    
    return layout;
}