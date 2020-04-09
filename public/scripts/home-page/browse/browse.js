const retrieveBrowseResources = () => {
  $("#home-page").empty();

  const browsePageHtml = `
  <div class="ui segment custom-browse-top">
    <h4>
      Categories:
    </h4>
  <div class="ui clearable multiple selection dropdown custom-category-dropdown">
    <input type="hidden" name="language" value="dutch,english,french">
    <i class="dropdown icon"></i>
    <div class="default text">Select Languages</div>
        <div class="menu">
          <div class="item">Arabic</div>
          <div class="item">Chinese</div>
          <div class="item">Danish</div>
          <div class="item">Dutch</div>
          <div class="item">English</div>
          <div class="item">French</div>
          <div class="item">German</div>
          <div class="item">Greek</div>
          <div class="item">Hungarian</div>
          <div class="item">Italian</div>
          <div class="item">Japanese</div>
          <div class="item">Korean</div>
          <div class="item">Lithuanian</div>
          <div class="item">Persian</div>
          <div class="item">Polish</div>
          <div class="item">Portuguese</div>
          <div class="item">Russian</div>
          <div class="item">Spanish</div>
          <div class="item">Swedish</div>
          <div class="item">Turkish</div>
          <div class="item">Vietnamese</div>
        </div>
    </div>
  </div>
  </div>
  <div class="ui bottom attached tab segment active">
    <div
      class="user-resources ui special cards custom-resources custom-grid-resources"
    ></div>
  </div>
  `;

  $("#home-page").append(browsePageHtml);

  $('.custom-category-dropdown.ui.dropdown')
    .dropdown({
      allowAdditions: true
    })
  ;
};

const renderBrowseCards = (categories) => {
  
};

export default retrieveBrowseResources;