import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let HeaderView = {
  html: function () {
    return template;
  },

  dom: function () {
    const fragment = htmlToFragment(template);

    // Sélection des éléments
    const menuBtn = fragment.querySelector('#menu-btn');
    const mobileMenu = fragment.querySelector('#mobile-menu');

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    return fragment;
  }
};

export { HeaderView };
