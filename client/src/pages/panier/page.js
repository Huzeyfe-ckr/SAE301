import template from "./template.html?raw";
import { CartData } from '../../data/cart.js';
import { CartItemView } from '../../ui/cart/item.js';
import { htmlToFragment } from "../../lib/utils.js";
import { postRequest } from "../../lib/api-request.js";
import { UserData } from "../../data/user.js";
import { router } from "../../main.js";


let M = {
  cartItems: []
};

let C = {};

let V = {};

C.init = function() {
  M.cartItems = CartData.getItems();
};

V.dom = function() {
  const fragment = htmlToFragment(template);
  
  const cartItemsContainer = fragment.querySelector('#cart-items');
  const emptyCart = fragment.querySelector('#empty-cart');
  const cartContent = fragment.querySelector('#cart-content');
  
  if (M.cartItems.length === 0) {
    if (emptyCart) emptyCart.classList.remove('hidden');
    if (cartContent) cartContent.classList.add('hidden');
  } else {
    if (emptyCart) emptyCart.classList.add('hidden');
    if (cartContent) cartContent.classList.remove('hidden');
    
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = M.cartItems
        .map(item => CartItemView.render(item))
        .join('');
    }
    V.updateTotals(fragment);
  }
  
  return fragment;
};

V.updateTotals = function(fragment) {
  const total = CartData.getTotal();
  const count = CartData.getCount();
  
  const subtotalEl = fragment.querySelector('#subtotal');
  const totalEl = fragment.querySelector('#total');
  const itemsCountEl = fragment.querySelector('#items-count');
  
  if (subtotalEl) subtotalEl.textContent = total.toFixed(2) + ' €';
  if (totalEl) totalEl.textContent = total.toFixed(2) + ' €';
  if (itemsCountEl) itemsCountEl.textContent = count;
};

C.attachEventListeners = function() {
  const cartItemsContainer = document.getElementById('cart-items');
  
  if (!cartItemsContainer) return;
  
  cartItemsContainer.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-remove]');
    const increaseBtn = e.target.closest('[data-increase]');
    const decreaseBtn = e.target.closest('[data-decrease]');
    
    if (removeBtn) {
      const id = parseInt(removeBtn.dataset.remove);
      CartData.removeItem(id);
      M.cartItems = CartData.getItems();
      C.rerender();
    }
    
    if (increaseBtn) {
      const id = parseInt(increaseBtn.dataset.increase);
      const item = M.cartItems.find(i => i.id === id);
      if (item) {
        CartData.updateQuantity(id, item.quantity + 1);
        M.cartItems = CartData.getItems();
        C.rerender();
      }
    }
    
    if (decreaseBtn) {
      const id = parseInt(decreaseBtn.dataset.decrease);
      const item = M.cartItems.find(i => i.id === id);
      if (item && item.quantity > 1) {
        CartData.updateQuantity(id, item.quantity - 1);
        M.cartItems = CartData.getItems();
        C.rerender();
      }
    }
  });
  
  cartItemsContainer.addEventListener('change', (e) => {
    if (e.target.dataset.quantity) {
      const id = parseInt(e.target.dataset.quantity);
      const newQty = Math.max(1, parseInt(e.target.value) || 1);
      CartData.updateQuantity(id, newQty);
      M.cartItems = CartData.getItems();
      C.rerender();
    }
  });
  
  const clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Voulez-vous vraiment vider votre panier ?')) {
        CartData.clear();
        M.cartItems = CartData.getItems();
        C.rerender();
      }
    });
  }
  
  const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    C.checkout();
  });
}

  
};

C.rerender = function() {
  const cartItemsContainer = document.getElementById('cart-items');
  const emptyCart = document.getElementById('empty-cart');
  const cartContent = document.getElementById('cart-content');
  
  if (M.cartItems.length === 0) {
    if (emptyCart) {
      emptyCart.style.display = 'block';
      emptyCart.classList.remove('hidden');
    }
    if (cartContent) {
      cartContent.style.display = 'none';
      cartContent.classList.add('hidden');
    }
  } else {
    if (emptyCart) {
      emptyCart.style.display = 'none';
      emptyCart.classList.add('hidden');
    }
    if (cartContent) {
      cartContent.style.display = 'grid';
      cartContent.classList.remove('hidden');
    }
    
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = M.cartItems
        .map(item => CartItemView.render(item))
        .join('');
    }
  }
  
  const total = CartData.getTotal();
  const count = CartData.getCount();
  
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');
  const itemsCountEl = document.getElementById('items-count');
  
  if (subtotalEl) subtotalEl.textContent = total.toFixed(2) + ' €';
  if (totalEl) totalEl.textContent = total.toFixed(2) + ' €';
  if (itemsCountEl) itemsCountEl.textContent = count;
};

C.checkout = async function() {
  // Vérifier si l'utilisateur est connecté
  const user = UserData.get();
  if (!user || !user.id) {
    alert('Veuillez vous connecter pour passer commande');
    router.navigate('/SAE301/compte');
    return;
  }

  if (M.cartItems.length === 0) {
    alert('Votre panier est vide');
    return;
  }

  // Préparer les données de la commande
  const orderData = {
    items: M.cartItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    })),
    total_amount: CartData.getTotal()
  };

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'Traitement en cours...';
  }

  // Envoyer la commande à l'API
  const order = await postRequest('orders', orderData);

  if (order && order.id) {
 // Vider le panier
    CartData.clear();
    
    // Rediriger vers la page de confirmation
    router.navigate(`/SAE301/confirmation/${order.id}`);
  } else {
    alert('Une erreur est survenue lors de la commande. Veuillez réessayer.');
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = 'Commander';
    }
  }
};

export async function PanierPage() {
  C.init();
  const dom = V.dom();
  
  setTimeout(() => {
    C.attachEventListeners();
  }, 0);
  
  return dom;
}