import html from "./template.html?raw";
import { htmlToFragment } from "../../lib/utils.js";
import { CartIconView } from "../cart/index.js";

let HeaderView = {};

HeaderView.render = function() {
  return html;
};

HeaderView.init = function() {
  const cartSlot = document.querySelector('[data-slot="cart-icon"]');
  if (cartSlot) {
    cartSlot.innerHTML = CartIconView.render();
  }
  
  const categoryLinks = document.querySelectorAll('[data-category-filter]');
  
  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = e.currentTarget.dataset.categoryFilter;
      
      const event = new CustomEvent('filterProducts', { 
        detail: { category: category }
      });
      window.dispatchEvent(event);
      
      categoryLinks.forEach(l => l.classList.remove('active-filter'));
      e.currentTarget.classList.add('active-filter');
    });
  });
};

HeaderView.dom = async function() {
  let fragment = htmlToFragment(html);
  
  const cartSlot = fragment.querySelector('[data-slot="cart-icon"]');
  if (cartSlot) {
    cartSlot.innerHTML = CartIconView.render();
  }
  
  return fragment;
};

export { HeaderView };