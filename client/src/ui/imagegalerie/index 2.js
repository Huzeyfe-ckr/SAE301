import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let ImageGaleryView = {
    html: function (data) {
        const templateData = {
            mainImage: data.images && data.images.length > 0 ? data.images[0] : ''
        };
        
        return genericRenderer(template, templateData);
    },
    
    dom: function (data) {
        let fragment = htmlToFragment(ImageGaleryView.html(data));
        
        // Récupérer le conteneur des miniatures
        const thumbnailsContainer = fragment.querySelector('#thumbnails-container');
        const mainImage = fragment.querySelector('#main-image');
        
        // Créer les miniatures
        if (data.images && data.images.length > 0) {
            data.images.forEach((img, index) => {
                const thumb = document.createElement('img');
                thumb.src = `/assets/${img}`;
                thumb.alt = `Miniature ${index + 1}`;
                
                // Gérer le clic sur la miniature
                thumb.onclick = () => {
                    mainImage.src = `/assets/${img}`;
                    // Retirer la classe active de toutes les miniatures
                    thumbnailsContainer.querySelectorAll('img').forEach(t => 
                        t.classList.remove('active')
                    );
                    // Ajouter la classe active à la miniature cliquée
                    thumb.classList.add('active');
                };
                
                // Ajouter la classe active à la première miniature
                if (index === 0) {
                    thumb.classList.add('active');
                }
                
                thumbnailsContainer.appendChild(thumb);
            });
        }
        
        return fragment;
    }
};

export default ImageGaleryView;