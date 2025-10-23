import html from "./template.html?raw";
import { CartData } from "../../data/cart.js";

let CartIconView = {};

CartIconView.render = function() {
  setTimeout(() => {
    CartData.refreshCounter();
  }, 0);
  
  return html;
};

export { CartIconView };