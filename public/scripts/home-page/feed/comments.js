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

const createFourCommentsHTML = (comments) => {

  const sortedComments = comments.sort(function(x, y) {
    return new Date(x.timestamp) - new Date(y.timestamp);
  });

  let fourCommentsHTML = "";

  // console.log();

  for (let i = 0; i < 3 && i < comments.length; i++) {
    fourCommentsHTML += singleCommentHTML(sortedComments[i]);
  }


  return fourCommentsHTML || "";
};

const singleCommentHTML = (comment) => {
  const commentHTML = `
  <div class="comment">
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
