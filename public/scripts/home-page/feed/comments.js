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
  let fourCommentsHTML = "";

  for (let i = 0; i < 4 && i < comments.length; i++) {
    fourCommentsHTML += singleCommentHTML(comments[i]);
  }


  return fourCommentsHTML || "";
};

const singleCommentHTML = (comment) => {
  console.log(comment);
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
