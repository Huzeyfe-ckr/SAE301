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

        // Animation des barres du burger
        const spans = menuBtn.querySelectorAll('span');
        menuBtn.classList.toggle('open');

        if (menuBtn.classList.contains('open')) {
          spans[0].style.transform = 'rotate(45deg) translateY(10px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
        } else {
          spans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '1';
          });
        }
      });
    }

    return fragment;
  }
};

export { HeaderView };
