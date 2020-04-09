// placeholder-cards.js
//
// Resource cards support.

// Function that renders placeholder cards to page
const renderPlaceholderCards = () => {
  // Add elements to page
  $("#popular-resources").append(createPlaceholderCards());
};

// Function that creates placeholder cards html elements
export const createPlaceholderCards = () => {
  let placeholderCardsHTML = "";

  // Create html content for placeholders
  for (let i = 0; i < 8; i++) {
    placeholderCardsHTML += `
    <div class="ui card">
      <div class="image">
        <div class="ui placeholder">
          <div class="square image"></div>
        </div>
      </div>
      <div class="content">
        <div class="ui placeholder">
          <div class="header custom-flex">
            <div class="medium line"></div>
          </div>
        </div>
      </div>
    </div>
    `;
  }
  return placeholderCardsHTML;
};

export default renderPlaceholderCards;