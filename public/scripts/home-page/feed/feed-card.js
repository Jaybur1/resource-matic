import { createCommentsHTML } from "./comments.js";

// Function that sends an AJAX request to find if user has like current resource
const checkIfLiked = (id) => {
  // AJAX request
  return $.ajax({method: "GET",
    url: "/like",
    data: {resourceId: id}
  })
    .then(resp => resp.likedByCurrentUser);
};

// Function that creates single cards for feed
const feedCardCreator = async(resource) => {
  // Card html
  const  cardHTML = `
    <article class="ui fluid card" >
    <span class="custom-resource-id">${resource.id}</span>
    <div class="content">
      <div class="right floated meta">${$.timeago(resource.created)}</div>
      <img class="ui avatar image" src="${resource.poster_avatar}"> &nbsp <span class="custom-poster-name">${resource.poster}</span>
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
        <i class="heart ${await checkIfLiked(resource.id) ? "" : "outline"} like icon"></i>
        ${resource.likes || null}
      </span>
      <i class="comment icon"></i>
     ${resource.comments ? `${resource.comments.length} ${resource.comments.length === 1 ? `comment` : `comments` }` : null} 
    </div>
    ${resource.comments.length > 0 ? createCommentsHTML(resource.comments) : ""}
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