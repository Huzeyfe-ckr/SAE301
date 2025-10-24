import template from "./template.html?raw";
import { getRequest } from "../../lib/api-request.js";
import { ProductData } from "../../data/product.js";
import { ProductView } from "../../ui/product/index.js";
import { CartData } from "../../data/cart.js";
import { htmlToFragment } from "../../lib/utils.js";

let M = {
  products: [],
  filteredProducts: [],
  currentCategory: null,
};

let C = {};

let V = {};

// Ajout du paramètre params pour récupérer l'ID de catégorie
C.init = async function (params = {}) {
  const apiProducts = await getRequest("products");
  
  if (apiProducts && Array.isArray(apiProducts) && apiProducts.length > 0) {
    M.products = apiProducts;
  } else {
    M.products = ProductData.getAll();
  }
  
  // Si params.id existe (route /category/:id), filtrer par catégorie
  if (params.id) {
    C.filterByCategory(params.id);
  } else {
    M.filteredProducts = M.products;
    M.currentCategory = null;
  }
};

C.filterByCategory = function(categoryId) {
  const catId = parseInt(categoryId);
  
  if (catId === 3) {
    // Nouveautés = 10 derniers produits
    M.filteredProducts = [...M.products].reverse().slice(0, 10);
    M.currentCategory = 3;
  } else if (catId === 1 || catId === 2) {
    M.filteredProducts = M.products.filter(p => p.category === catId);
    M.currentCategory = catId;
  } else {
    // Tous les produits
    M.filteredProducts = M.products;
    M.currentCategory = null;
  }
};

V.dom = function () {
  const fragment = htmlToFragment(template);
  
  const slot = fragment.querySelector('slot[name="products"]');
  
  if (!slot) {
    return fragment;
  }

  if (!M.filteredProducts || M.filteredProducts.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'w-full text-center py-12';
    emptyDiv.innerHTML = '<p class="text-gray text-xl">Aucun produit disponible pour le moment</p>';
    slot.replaceWith(emptyDiv);
    return fragment;
  }

  // Utiliser flex au lieu de grid
  const productsDiv = document.createElement('div');
  productsDiv.className = 'flex flex-wrap gap-6 w-full max-w-7xl justify-center';
  productsDiv.id = 'products-grid';
  productsDiv.innerHTML = M.filteredProducts
    .map((product) => ProductView.render(product))
    .join("");
  
  slot.replaceWith(productsDiv);
  
  V.updateProductCount(fragment);
  
  return fragment;
};

V.updateProductCount = function(fragment) {
  const countElement = fragment.querySelector('#nbrarticle');
  if (countElement) {
    const categoryNames = {
      1: 'COMPOSANTS',
      2: 'PC PORTABLES',
      3: 'NOUVEAUTÉS'
    };
    
    const categoryText = M.currentCategory ? ` - ${categoryNames[M.currentCategory]}` : '';
    countElement.textContent = `${M.filteredProducts.length} PRODUIT${M.filteredProducts.length > 1 ? 'S' : ''} CORRESPONDENT${categoryText}`;
  }
};

C.attachEventListeners = function () {
  setTimeout(() => {
    const buttons = document.querySelectorAll('[data-add-to-cart]');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.currentTarget.dataset.addToCart);
        const product = M.products.find(p => p.id === productId);
        
        if (product) {
          CartData.addItem(product, 1);
          
          const originalText = btn.textContent;
          btn.textContent = '✓ Ajouté';
          btn.classList.add('added-to-cart');
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('added-to-cart');
          }, 1500);
        }
      });
    });
  }, 0);
};

// ProductsPage doit accepter params en argument
export async function ProductsPage(params = {}) {
  await C.init(params);
  const dom = V.dom();
  C.attachEventListeners();
  return dom;
}