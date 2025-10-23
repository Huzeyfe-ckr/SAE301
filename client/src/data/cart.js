let CartData = {};

let cart = {
  items: [],
  total: 0,
  count: 0
};

function initCart() {
  const savedCart = localStorage.getItem('ldlc_cart');
  if (savedCart) {
    cart.items = JSON.parse(savedCart);
    updateCartStats();
  }
  updateCartCounter();
}

function saveCartToStorage() {
  localStorage.setItem('ldlc_cart', JSON.stringify(cart.items));
  updateCartStats();
  updateCartCounter();
}

function updateCartStats() {
  cart.count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function updateCartCounter() {
  const counter = document.querySelector('[data-cart-count]');
  if (counter) {
    const count = cart.count;
    counter.textContent = count;
    if (count > 0) {
      counter.classList.remove('hidden');
    } else {
      counter.classList.add('hidden');
    }
  }
}

CartData.getItems = function() {
  return cart.items;
};

CartData.getTotal = function() {
  return cart.total;
};

CartData.getCount = function() {
  return cart.count;
};

CartData.addItem = function(product, quantity = 1) {
  if (!product || !product.id) {
    return false;
  }

  const existingItem = cart.items.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const newItem = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price) || 0,
      image: product.image || 'https://via.placeholder.com/400x300',
      quantity: quantity,
      description: product.description || ''
    };
    cart.items.push(newItem);
  }

  saveCartToStorage();
  return true;
};

CartData.removeItem = function(productId) {
  const index = cart.items.findIndex(item => item.id === productId);
  
  if (index !== -1) {
    cart.items.splice(index, 1);
    saveCartToStorage();
    return true;
  }
  
  return false;
};

CartData.updateQuantity = function(productId, quantity) {
  const item = cart.items.find(item => item.id === productId);
  
  if (!item) {
    return false;
  }

  if (quantity <= 0) {
    return CartData.removeItem(productId);
  }

  item.quantity = quantity;
  saveCartToStorage();
  return true;
};

CartData.clear = function() {
  cart.items = [];
  cart.total = 0;
  cart.count = 0;
  localStorage.removeItem('ldlc_cart');
  updateCartCounter();
  return true;
};

CartData.isInCart = function(productId) {
  return cart.items.some(item => item.id === productId);
};

CartData.getItem = function(productId) {
  return cart.items.find(item => item.id === productId);
};

CartData.getSummary = function() {
  return {
    items: cart.items,
    count: cart.count,
    total: cart.total,
    isEmpty: cart.items.length === 0
  };
};

CartData.refreshCounter = function() {
  updateCartCounter();
};

initCart();

export { CartData };