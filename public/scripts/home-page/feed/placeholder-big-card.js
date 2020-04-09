// placeholder-big-cards.js
//
// Placeholder cards support.

// Function that creates placeholder cards html elements
export const createPlaceholderBigCards = () => {
  let placeholderCardsHTML = "";

  // Create html content for placeholders
  for (let i = 0; i < 4; i++) {
    placeholderCardsHTML += `
    <article class="ui fluid card custom-big-card ">
    <div class="content">
<div class="ui placeholder">
 <div class="header custom-flex">
   <div class="short line"></div>
 </div>
</div>
</div>

<div class="content">
<div class="ui placeholder">
  <div class="image header">
    <div class="line"></div>
    <div class="line"></div>
  </div>
</div>

<div class="custom-resource-name">
<div class="ui placeholder">

</div>
</div>

</div>
<div class="content">
<div class="content">
 <div class="ui placeholder">
   <div class="header custom-flex">
     <div class="medium line"></div>
     <div class="very long line"></div>
   </div>
 </div>
</div>
</div>

<div class="extra content">
<div class="content">
<div class="ui placeholder">
  <div class="paragraph">
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
  </div>
  <div class="paragraph">
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
  </div>
</div>
</div>
</div>
  </article>
  
    `;
  }
  return placeholderCardsHTML;
};

