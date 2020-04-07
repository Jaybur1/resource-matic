const feedCardCreator = (resource) => {
  console.log(resource);
  const  cardHTML = `
  <article class="ui fluid card" >
  <div class="content">
    <div class="right floated meta">${$.timeago(resource.created)}</div>
    <img class="ui avatar image" src="${resource.user_avatar}"> &nbsp ${resource.users}
  </div>
  <div class=" content custom-resource-area"> 
    <a class="custom-image-link" href="${resource.content}" target="_blank">
      <div class="custom-image-hover"></div>
      <img class="custom-resource-image" src="${resource.thumbnail_photo}">
    </a>
    <div class="custom-resource-name">
      <a href="${resource.content}" target="_blank">${resource.title}</a>
      <span class="custom-resource-description">${resource.description}</span>
    </div>
  </div>
  <div class="content">
    <span class="right floated">
      <i class="heart outline like icon"></i>
      ${resource.likes || null}
    </span>
    <i class="comment icon"></i>
   ${resource.likes ? `${resource.likes} comments` : null} 
  </div>
  
  <div class="extra content">
    <div class="ui large transparent left icon input">
      <i class="comment outline icon"></i>
      <input type="text" placeholder="Add comment...">
    </div>
  </div>
  </article>
`;

  return cardHTML;
};




export default feedCardCreator;


{/* <div class="content">
    <div class="ui content comments">
      <div class="custom-view-previous">View previous comments</div>
      <div class="comment">
        <div class="avatar">
          <img src="<%= user.avatar %>">
        </div>
        <div class="content">
          <span class="author">Matt</span>
          <div class="metadata">
            <span class="date">Today at 5:42PM</span>
          </div>
          <div class="text">
            How artistic!
          </div>
        </div>
      </div>
      <div class="comment">
        <div class="avatar">
          <img src="<%= user.avatar %>">
        </div>
        <div class="content">
          <span class="author">Elliot Fu</span>
          <div class="metadata">
            <span class="date">Yesterday at 12:30AM</span>
          </div>
          <div class="text">
            <p>This has been very useful for my research. Thanks as well!</p>
          </div>
        </div>
      </div>
      <div class="comment">
        <div class="avatar">
          <img src="<%= user.avatar %>">
        </div>
        <div class="content">
          <span class="author">Joe Henderson</span>
          <div class="metadata">
            <span class="date">5 days ago</span>
          </div>
          <div class="text">
            Dude, this is awesome. Thanks so much
          </div>
        </div>
      </div>
    </div>
  </div> */}