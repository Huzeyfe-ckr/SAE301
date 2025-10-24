import itemTemplate from "./item-template.html?raw";
import { genericRenderer } from "../../lib/utils.js";


var CartItemView = {};

CartItemView.render = function(item) {
  console.log('Item reçu:', item); // 🔍 DEBUG
  
  let imageUrl = "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Pas+d'image";
  
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    imageUrl = item.images[0];
  } else if (item.image) {
    imageUrl = item.image;
  }

  var data = {
    id: item.id,
    name: item.name,
    price: item.price.toFixed(2),
    quantity: item.quantity,
    total: (item.price * item.quantity).toFixed(2),
    image: imageUrl
  };
  
  console.log('Data final:', data); // 🔍 DEBUG

  return genericRenderer(itemTemplate, data);
};

export { CartItemView };