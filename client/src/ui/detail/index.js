import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let DetailView = {
  html: function (data) {
    let image = data.images[0];
    // template = template.replace("{{image}}", image);
    // console.log(image);
    // console.log(template);
    return genericRenderer(template, data);
  },

  dom: function (data) {
    return htmlToFragment(DetailView.html(data));
  }
};

export { DetailView };
