// Function that creates all comments HTML including initially hidden ones
export const createCommentsHTML = (comments) => {
  // Comments section html
  let commentsHTML = `
  <div class="content">
    <div class="ui content comments">
      ${comments.length > 3 ? `<div class="custom-view-previous">View previous comments</div>` : ""}
      ${createThreeCommentsHTML(comments, 3)}
    </div>
  </div>
  `;

  return commentsHTML;
};

// Function that adds an event listener for clicking show previous comments and displays given number of comments
export const showMoreComments = (numberOfComments) => {
  // On click of show previous comments button
  $(".custom-view-previous").on("click", function(e) {

    // Select all elements in that post that have a hidden comment class
    const parent = e.target.parentElement;
    const hiddenElements = parent.querySelectorAll(".custom-comment-hidden");

    // Remove hidden class for last three elements and hide show previous comments button when no more can be displayed
    hiddenElements.forEach((el, index) => {
      if (index >= hiddenElements.length - numberOfComments) {
        el.classList.remove("custom-comment-hidden");
      }

      // Hide button conditional
      hiddenElements.length <= numberOfComments ? e.target.classList.add("custom-previous-hidden") : null;
    });
  });
};

// Function the creates html for passed number of comments only
const createThreeCommentsHTML = (comments, numberOfComments) => {

  // Sort comments by date
  const sortedComments = comments.sort(function(x, y) {
    return new Date(x.timestamp) - new Date(y.timestamp);
  });

  let fourCommentsHTML = "";

  // Create html for each comment (have only last given number of comments visible)
  sortedComments.forEach((comment, index) => {
    index >= sortedComments.length - numberOfComments
      ? fourCommentsHTML += singleCommentHTML(comment)
      : fourCommentsHTML += singleCommentHTML(comment, true);
  });

  return fourCommentsHTML || "";
};

// Function that creates single comment with hidden or not as input
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
      ${comment.owned ? (
    `
        <div class="actions">
        <a class="reply custom-edit-comment">Edit</a>
        <a class="reply custom-delete-comment">Delete</a>
      </div>
      <span class="custom-comment-id">${comment.id}</span>

        `
  ) : ""}
    </div>
  </div>
  `;

  return commentHTML;
};

// Function that adds event listener to new comment submit
export const newComment = () => {
  $(".new-comment").on("keyup", function(e) {
    // Prevent any default
    e.preventDefault();
    
    const message = $(this).val();

    // If enter is pressed
    if (e.keyCode === 13 && !e.shiftKey && message.trim().length > 0) {
      const resourceId = Number($(this).prev().html());
      const name = $(".custom-user").text();
      const avatar = $(".custom-user").find("img").attr("src");
      const commentsContainer = $(this).parent().parent().prev().find(".comments");

      // AJAX POST request
      $.ajax({method: "POST",
        url: "/comment",
        data: {
          resourceId,
          content: message
        }
      })
        .then((resp) => {
          // New comment HTML
          const newCommentHTML = singleCommentHTML({
            id: resp.newCommentId,
            timestamp: new Date(),
            message,
            name,
            avatar,
            hidden : false,
            owned: true
          });

          // Append new comment
          commentsContainer.append(newCommentHTML);

          // Clear input field but doesn't blur
          $(this).val("");
        });
    }
  });
};

// Function that retrieves comments for resource indicating if owned by user
const retrieveCommentsIndicateUser = (resourceId) => {
  // AJAX GET request
  return $.ajax({method: "GET",
    url: "/comment/list",
    data: {resourceId}
  })
    .then(resp => resp);
};

export const updateCommentsWithOwned = async(comments, resourceId) => {
  const commentsIndicatorArray = await retrieveCommentsIndicateUser(resourceId);
  let newCommentsArray = await comments;

  for (let i in newCommentsArray) {
    for (let x in commentsIndicatorArray) {
      if (newCommentsArray[i].id === commentsIndicatorArray[x].id) {
        newCommentsArray[i].owned = commentsIndicatorArray[x].currentuser;
      }
    }
  }

  return newCommentsArray;
};


// Function that adds event listener for edit comment
export const editComment = () => {
  // Event listener for edit button
  $(".custom-edit-comment").on("click", function() {

    // Current comment id
    const commentId = Number($(this).parent().next().text());

    // Text area is already open
    if ($(this).parent().prev().hasClass("custom-edit-input")) {

      const inputEl = $(this).parent().prev();
      const newMessage = inputEl.val().trim();

      // Submit new comment
      submitEditedComment(newMessage, commentId)
        .then(() => {
          // Remove text area
          inputEl.remove();

          // Show comment element
          $(this).parent().prev().removeClass("custom-message-hidden");
          // Update comment text with new comment
          $(this).parent().prev().text(newMessage);
        });
    // Text area is closed
    } else {
      const messageEl = $(this).parent().prev();
      const currentMessage = messageEl.text().trim();

      // Hide comment element
      messageEl.addClass("custom-message-hidden");

      // Render text area with current message
      messageEl.after(`<textarea type="text" class="custom-edit-input">${currentMessage}</textarea>`);
  
      // Add keypress event listener
      $(".custom-edit-input").on("keyup", function(e) {

        const newMessage = $(this).val().trim();

        // If shift is not pressed with enter
        if (e.keyCode === 13 && !e.shiftKey) {
          // Submit new comment
          submitEditedComment(newMessage, commentId)
            .then(() => {
              // Remove text area
              $(this).remove();
              // Show comment element
              messageEl.removeClass("custom-message-hidden");
              // Update comment text with new comment
              messageEl.text(newMessage);
            });
        }
      });
    }
  });
};


const submitEditedComment = (message, commentId) => {
  // AJAX PUT request
  return $.ajax({method: "PUT",
    url: "/comment",
    data: {
      commentId,
      content: message
    }
  })
    .then(resp => resp);
};