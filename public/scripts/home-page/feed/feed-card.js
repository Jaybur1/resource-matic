import { createCommentsHTML } from "./comments.js";
import { checkIfLiked } from "./like.js";
import { checkIfRated } from "./rating.js";

const $feedCard = $(`
<article class="ui fluid card custom-big-card" >
  <div class="content">
    <div class="right floated meta"></div>
    <img class="ui avatar image" src=""> &nbsp <span class="custom-poster-name"></span>
  </div>
  <div class=" content custom-resource-area">
    <a class="custom-image-link" href="" target="_blank">
      <div class="custom-image-hover"></div>
      <img class="custom-resource-image" src="">
    </a>
    <div class="custom-resource-name">
      <a href="" target="_blank"></a>
      <span class="custom-resource-description"></span>
    </div>
    <div class=" custom-rating">
    <span>
    <span class="custom-resource-id"></span>
    <span class="custom-avg-rating"></span>
    &nbsp&nbsp<div class="ui yellow rating" data-rating="" data-max-rating="5">
    s</div>
  </span>
    </div>
  </div>
  <div class="content custom-resource-bottom">
    <span class="custom-resource-id"></span>
    <span class="right floated custom-like-count">
    </span>
    <span class="right floated">
      <i class="heart custom-like like icon"></i>
    </span>
    <i class="comment icon"></i>
  </div>
  <div class="content">
  <div class="ui content comments">
  </div>
  </div>
  <div class="extra content">
    <div class="ui large transparent left icon input custom-new-comment-container">
      <i class="comment outline icon"></i>
      <span class="custom-resource-id"></span>
      <textarea class="new-comment" type="text" placeholder="Add comment..."></textarea>
    </div>
  </div>
</article>
`);

// Function that creates single cards for feed
const feedCardCreator = async(resource) => {
  const $newFeedCard = $feedCard.clone();

  $newFeedCard.find(".content .meta").html($.timeago(resource.created));
  $newFeedCard.find(".content .avatar").attr("src", resource.poster_avatar);
  $newFeedCard.find(".content .custom-poster-name").html(resource.poster);

  $newFeedCard.find(".custom-image-link").attr("href", resource.content);
  $newFeedCard.find(".custom-resource-image").attr("src", resource.thumbnail_photo);

  $newFeedCard.find(".custom-resource-name a").attr("href", resource.content).html(resource.title);
  $newFeedCard.find(".custom-resource-description").html(resource.description);

  $newFeedCard.find(".custom-resource-id").html(resource.id);

  $newFeedCard.find(".custom-avg-rating").addClass(Number(resource.avg_ratings).toFixed(1) > 0 ? "rated" : "not-rated")
    .html(Number(resource.avg_ratings).toFixed(1) > 0 ? `Avg.&nbsp ${Number(resource.avg_ratings).toFixed(1)}` : "Not rated yet");
  $newFeedCard.find("div.rating").attr("data-rating", (await checkIfRated(resource.id) || 0));

  $newFeedCard.find(".custom-like-count").html(resource.likes || null);
  $newFeedCard.find(".custom-resource-bottom").append($(resource.comments ? `${resource.comments.length} ${resource.comments.length === 1 ? `comment` : `comments` }` : null));
  $newFeedCard.find(".custom-resource-bottom i").toggleClass("outline", !await checkIfLiked(resource.id));
  $newFeedCard.find(".comments").html(resource.comments.length > 0 ? createCommentsHTML(resource.comments) : "");

  return $newFeedCard;
};

export default feedCardCreator;
