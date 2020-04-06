// placeholder-cards.js
//
// Resource cards support.

const $placeholder = $(`
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
  </div>
`);



// renderPopular fills the parent element with placeholder cards.

export const renderPopular = ($parentElement) => {
  for (let i = 0; i < 8; i++) {
    $parentElement.append($placeholder);
  }
};



