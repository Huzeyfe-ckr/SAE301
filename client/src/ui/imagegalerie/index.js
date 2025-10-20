// Correction du code de la galerie
export default function renderImageGalerie({ images }) {
    console.log("[renderImageGalerie] images reçues :", images);

    const container = document.createElement('div');
    container.className = "max-w-xl mx-auto";

    const gallery = document.createElement('div');
    gallery.className = "flex space-x-2 mt-4";

    // Image principale (première image)
    const mainImageContainer = document.createElement('div');
    const mainImage = document.createElement('img');
    mainImage.src = `/assets/${images[0]}`;
    mainImage.className = "w-full h-64 object-cover rounded mb-4";
    mainImageContainer.appendChild(mainImage);
    container.appendChild(mainImageContainer);

    // Miniatures
    images.forEach((img, idx) => {
        const thumb = document.createElement('img');
        thumb.src = `/assets/${img}`; // img est déjà l'URL
        thumb.alt = `Miniature ${idx + 1}`;
        thumb.className = "w-16 h-16 object-cover rounded cursor-pointer border-2 border-transparent hover:border-blue-500";
        thumb.onclick = () => {
            mainImage.src = `/assets/${img}`;
            gallery.querySelectorAll('img').forEach(i => i.classList.remove('border-blue-500'));
            thumb.classList.add('border-blue-500');
        };
        gallery.appendChild(thumb);
    });

    container.appendChild(gallery);
    return container;
}