import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let ProductView = {
  html: function (data) {
    let htmlString = '<div class="grid grid-cols-2 lg:grid-cols-3 gap-6">';
    
    // La boucle doit être avant d'essayer d'accéder aux images
    for (let obj of data) {
      // Vérification que obj.images existe et contient au moins un élément
      if (obj.images && obj.images.length > 0) {
        obj.image = obj.images[0]; // Créer une propriété image pour le template
      } else {
        obj.image = 'default.jpg'; // Image par défaut si pas d'images
      }
      htmlString += genericRenderer(template, obj);
    }
    return htmlString + '</div>';
  },

  dom: function (data) {
    return htmlToFragment(ProductView.html(data));
  }
};

export { ProductView };