// landing-page.js
//
// Landing page support.

import * as placeholderCards from "./landing-page/placeholder-cards.js";
import * as resourceCards    from "./landing-page/resource-cards.js";

$(document).ready(() => {
  placeholderCards.renderPopular($("#popular-resources"));
  resourceCards.renderPopular($("#popular-resources"));
});
