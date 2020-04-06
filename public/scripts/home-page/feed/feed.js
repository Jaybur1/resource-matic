import feedCardCreator from "./feed-card.js";

const feedCreator = () => {
  const resources = [1, 2, 3, 4];

  
  const feedHTML = `
  <div class="custom-feed">
    ${resources.map(resource => feedCardCreator(resource)).join(" ")}
  </div>`;

  return feedHTML;
};

const feedRenderer = () => {
  $("#home-page").empty();
  $("#home-page").append(feedCreator());
};



export default feedRenderer;