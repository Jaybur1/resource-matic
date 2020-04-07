export const createCommentsHTML = (comments) => {
  let commentsHTML = `
  <div class="content">
    <div class="ui content comments">
      ${comments.length > 3 ? `<div class="custom-view-previous">View previous comments</div>` : ""}
      ${createFourCommentsHTML(comments)}
    </div>
  </div>
  `;

  return commentsHTML;
};

export const showMoreComments = () => {
  $(".custom-view-previous").on("click", function(e) {

    const parent = e.target.parentElement;
    const hiddenElements = parent.querySelectorAll(".custom-comment-hidden");

    console.log(hiddenElements);
    hiddenElements.forEach((el, index) => {


      if (index > hiddenElements.length - 4) {
        el.classList.remove("custom-comment-hidden");
      }

      hiddenElements.length < 4 ? e.target.classList.add("custom-previous-hidden") : null;
    });
  });
};

const createFourCommentsHTML = (comments) => {

  const sortedComments = comments.sort(function(x, y) {
    return new Date(x.timestamp) - new Date(y.timestamp);
  });

  let fourCommentsHTML = "";

  sortedComments.forEach((comment, index) => {
    index > sortedComments.length - 4
      ? fourCommentsHTML += singleCommentHTML(comment)
      : fourCommentsHTML += singleCommentHTML(comment, true);
  });

  return fourCommentsHTML || "";
};

const singleCommentHTML = (comment, hidden) => {
  const commentHTML = `
  <div class="comment ${hidden ? "custom-comment-hidden" : ""}">
    <div class="avatar">
      <img src="${comment.avatar}">
    </div>
    <div class="content">
      <span class="author">${comment.name}</span>
      <div class="metadata">
        <span class="date">${$.timeago(comment.timestamp)}</span>
      </div>
      <div class="text">
        <p>${comment.message}</p>
      </div>
    </div>
  </div>
  `;

  return commentHTML;
};
