import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import ImageGaleryView from "../imagegalerie/index.js";

let DetailView = {
  html: function (data) {
    // ✅ Gérer le cas où images est un tableau
    let imageUrl = "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Pas+d'image";
    
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      imageUrl = `/SAE301/assets/${data.images[0]}`;
    } else if (data.image) {
      imageUrl = `/SAE301/assets/${data.image}`;
    }

    const detailData = {
      id: data.id || 0,
      name: data.name || "Produit sans nom",
      price: typeof data.price === 'number' ? data.price.toFixed(2) : "0.00",
      image: imageUrl,
      description: data.description || "Pas de description disponible",
      category: data.category || "",
      stock: data.stock || 0
    };

    return genericRenderer(template, detailData);
  },

  dom: function (data) {
    let fragment = htmlToFragment(DetailView.html(data));
    
    // Créer la galerie d'images
    if (data.images && data.images.length > 0) {
      const galerieDOM = ImageGaleryView.dom({ images: data.images });
      // Remplacer le slot par la galerie
      const slot = fragment.querySelector('slot[name="image-galerie"]');
      if (slot) {
        slot.replaceWith(galerieDOM);
      }
    }
    
    return fragment;
  }
};

export { DetailView };