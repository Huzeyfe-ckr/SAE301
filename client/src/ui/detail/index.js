import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import ImageGaleryView from "../../ui/imagegalerie/index.js";

let DetailView = {
  html: function (data) {
    let image = data.images[0];
    let htmlContent = template;
    htmlContent = htmlContent.replace("{{image}}", image);
    return genericRenderer(htmlContent, data);
  },

  dom: function (data) {
    let fragment = htmlToFragment(DetailView.html(data));
    
    // Créer la galerie d'images
    if (data.images && data.images.length > 0) {
      const galerieDOM = ImageGaleryView.dom(data);
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