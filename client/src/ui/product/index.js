import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let ProductView = {
  html: function (data) {
    let htmlString = '<div class="grid grid-cols-2 lg:grid-cols-3 gap-6">';
    for (let obj of data) {
      htmlString  += genericRenderer(template, obj);
    }
    return htmlString + '</div>';
  },

  dom: function (data) {
    return htmlToFragment( ProductView.html(data) );
  }

};

export { ProductView };

{/* <div class="flex flex-col items-center gap-6 p-6"></div> */}