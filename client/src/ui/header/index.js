import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { getRequest } from "../../lib/api-request.js";

let HeaderView = {
  html: function () {
    return template;
  },

  dom: async function () {
    const fragment = htmlToFragment(template);

    // Sélection des éléments
    const menuBtn = fragment.querySelector('#menu-btn');
    const mobileMenu = fragment.querySelector('#mobile-menu');

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        menuBtn.classList.toggle('active');
      });
    }

    // ✅ Vérifier si l'utilisateur est connecté et mettre à jour le lien
    await HeaderView.updateUserLink(fragment);

    return fragment;
  },

  // ✅ Nouvelle méthode pour mettre à jour le lien dynamiquement
  updateUserLink: async function(fragment) {
    try {
      const authData = await getRequest('auth');
      
      const userLink = fragment.querySelector('#user-link');
      const userLinkText = fragment.querySelector('#user-link-text');
      
      if (authData && authData.is_authenticated) {
        // Utilisateur connecté → Afficher "PROFIL"
        userLink.setAttribute('href', '/profil');
        userLinkText.textContent = 'PROFIL';
      } else {
        // Utilisateur non connecté → Afficher "COMPTE"
        userLink.setAttribute('href', '/compte');
        userLinkText.textContent = 'COMPTE';
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la session:', error);
      // En cas d'erreur, garder le lien par défaut vers /compte
    }
  }
};

export { HeaderView };