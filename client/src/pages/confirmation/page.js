import template from "./template.html?raw";
import { getRequest } from "../../lib/api-request.js";
import { htmlToFragment, genericRenderer } from "../../lib/utils.js";
import { router } from "../../main.js";

let M = {
  order: null
};

let C = {};

let V = {};

C.init = async function(params) {
  if (!params.id) {
    router.navigate("/SAE301/");
    return;
  }

  M.order = await getRequest(`orders/${params.id}`);
  
  if (!M.order) {
    router.navigate("/SAE301/");
  }
};

V.dom = function() {
  if (!M.order) {
    return document.createDocumentFragment();
  }

  const data = {
    orderNumber: M.order.order_number,
    totalAmount: parseFloat(M.order.total_amount).toFixed(2),
    itemsCount: M.order.items ? M.order.items.length : 0,
    createdAt: new Date(M.order.created_at).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  const renderedTemplate = genericRenderer(template, data);
  const fragment = htmlToFragment(renderedTemplate);

  // Injecter les items
  const itemsContainer = fragment.querySelector('#order-items');
  if (itemsContainer && M.order.items) {
    itemsContainer.innerHTML = M.order.items.map(item => V.renderItem(item)).join('');
  }

  return fragment;
};

V.renderItem = function(item) {
  const image = item.product_image ? `/SAE301/assets/${item.product_image}` : '';
  return `
    <div class="flex items-center gap-4 py-4 border-b border-gray-200">
      <img src="${image}" alt="${item.product_name}" class="w-16 h-16 object-contain" />
      <div class="flex-1">
        <h3 class="font-semibold text-blue-dark">${item.product_name}</h3>
        <p class="text-sm text-gray">Quantité: ${item.quantity}</p>
      </div>
      <p class="font-bold text-blue-mid">${parseFloat(item.price).toFixed(2)} €</p>
    </div>
  `;
};

export async function ConfirmationPage(params = {}) {
  await C.init(params);
  return V.dom();
}