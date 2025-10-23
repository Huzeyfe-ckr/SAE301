import html from "./template.html?raw";
import { genericRenderer } from "../../lib/utils.js";

let ProductView = {};

ProductView.render = function(data) {
  if (!data) {
    return "";
  }

  // ✅ Gérer le cas où images est un tableau
  let imageUrl = "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Pas+d'image";
  
  if (data.images && Array.isArray(data.images) && data.images.length > 0) {
    imageUrl = data.images[0];
  } else if (data.image) {
    imageUrl = data.image;
  }

  const productData = {
    id: data.id || 0,
    name: data.name || "Produit sans nom",
    price: typeof data.price === 'number' ? data.price.toFixed(2) : "0.00",
    image: imageUrl,
    description: data.description || "Pas de description disponible"
  };

  return genericRenderer(html, productData);
};

export { ProductView };