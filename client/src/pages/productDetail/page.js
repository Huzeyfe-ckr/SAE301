import { DetailView } from "../../ui/detail/index.js";
import { getRequest } from "../../lib/api-request.js";
import { ProductData } from "../../data/product.js";
import { CartData } from "../../data/cart.js";

let M = {
  product: null,
};

let C = {};

let V = {};

C.init = async function (params) {
  const productId = params.id;
  
  if (!productId) {
    console.error("ID du produit manquant");
    return;
  }

  // Récupérer le produit depuis l'API
  const apiProduct = await getRequest(`products/${productId}`);
  
  if (apiProduct) {
    M.product = apiProduct;
  } else {
    // Fallback sur les données locales
    const allProducts = ProductData.getAll();
    M.product = allProducts.find(p => p.id === parseInt(productId));
  }
  
  if (!M.product) {
    console.error("Produit introuvable");
    return;
  }
};

V.dom = function () {
  if (!M.product) {
    return document.createDocumentFragment();
  }
  
  return DetailView.dom(M.product);
};

C.attachEventListeners = function () {
  setTimeout(() => {
    const addToCartBtn = document.querySelector('[data-add-to-cart]');
    
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(document.querySelector('[data-quantity]')?.value || 1);
        CartData.addItem(M.product, quantity);
        
        // Feedback visuel
        const originalText = addToCartBtn.textContent;
        addToCartBtn.textContent = '✓ Ajouté au panier';
        addToCartBtn.classList.add('added-to-cart');
        
        setTimeout(() => {
          addToCartBtn.textContent = originalText;
          addToCartBtn.classList.remove('added-to-cart');
        }, 2000);
      });
    }
    
    // Gérer les miniatures de la galerie après l'insertion dans le DOM
    const thumbs = document.querySelectorAll('[data-gallery-thumb]');
    thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        const mainImage = document.getElementById('main-image');
        if (mainImage && M.product.images && M.product.images[index]) {
          mainImage.src = M.product.images[index];
        }
        
        document.querySelectorAll('[data-gallery-thumb]').forEach(t => {
          t.classList.remove('border-blue-mid');
          t.classList.add('border-transparent');
        });
        thumb.classList.remove('border-transparent');
        thumb.classList.add('border-blue-mid');
      });
    });
  }, 0);
};

export async function ProductDetailPage(params = {}) {
  await C.init(params);
  const dom = V.dom();
  C.attachEventListeners();
  return dom;
}