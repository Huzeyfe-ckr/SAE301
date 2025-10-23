import itemTemplate from "./item-template.html?raw";
import { genericRenderer } from "../../lib/utils.js";

const DEFAULT_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%233B82F6" width="150" height="150"/%3E%3Ctext fill="%23fff" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EProduit%3C/text%3E%3C/svg%3E';

let CartItemView = {};

CartItemView.render = function(item) {
  let imageUrl = DEFAULT_IMAGE;
  
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    imageUrl = item.images[0];
  } else if (item.image) {
    imageUrl = item.image;
  }

  const data = {
    id: item.id,
    name: item.name,
    price: item.price.toFixed(2),
    quantity: item.quantity,
    total: (item.price * item.quantity).toFixed(2),
    image: imageUrl,
    defaultImage: DEFAULT_IMAGE
  };

  return genericRenderer(itemTemplate, data);
};

export { CartItemView };