import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let ProfilView = {
  html: function () {
    return template;
  },

  dom: function () {
    const fragment = htmlToFragment(template);
    return fragment;
  }
};

export { ProfilView };
