// Function that creates all comments HTML including initially hidden ones
export const createCommentsHTML = (comments) => {
  // Comments section html
  let commentsHTML = `
      ${comments.length > 3 ? `<div class="custom-view-previous">View previous comments</div>` : ""}
      ${createThreeCommentsHTML(comments, 3)}
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

  let partCommentsHTML = "";

  // Create html for each comment (have only last given number of comments visible)
  sortedComments.forEach((comment, index) => {
    index >= sortedComments.length - numberOfComments
      ? partCommentsHTML += singleCommentHTML(comment)
      : partCommentsHTML += singleCommentHTML(comment, true);
  });

  return partCommentsHTML || "";
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

          // Update comment count
          const commentCountEl = $(this).parent().parent().parent().find(".custom-comment-count");
          const currentCommentCount = Number(commentCountEl.text().trim().split(" ")[0]);

          commentCountEl.text(`
          ${currentCommentCount + 1} ${currentCommentCount + 1 === 1 ? "comment" : "comments"}
          `);
          //

          // Turn on edit and delete comment
          $(".custom-edit-comment").off("click");
          $(".custom-delete-comment").off("click");
          editComment();
          deleteComment();
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

    // Text area is already open
    if ($(this).parent().prev().hasClass("custom-edit-input")) {

      // Current comment id
      const commentId = Number($(this).parent().next().text());

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
      messageEl.after(`<textarea type="text" autoFocus class="custom-edit-input">${currentMessage}</textarea>`);

      // Add keypress event listener
      $(".custom-edit-input").on("keyup", function(e) {

        // Current comment id
        const commentId = Number($(this).parent().next().text());
      
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

// Function that submits edit comment
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

// Function that deletes comment
export const deleteComment = () => {
  // Event listener for edit button
  $(".custom-delete-comment").on("click", function() {

    // Delete prompt html
    const deletePromptHTML = `
    <span class="custom-delete-comment-prompt">Are you sure you want to delete this comment?</span>
    <a class="reply custom-confirm-delete-comment">Delete</a>
    <a class="reply custom-cancel-delete-comment">Cancel</a>
    `;

    // Render prompt
    $(this).after(deletePromptHTML);

    // Hide delete and edit buttons
    $(this).prev().addClass("custom-default-hidden");
    $(this).addClass("custom-default-hidden");

    // Event listener for confirm delete
    $(".custom-confirm-delete-comment").on("click", function() {
      
      // Current comment id
      const commentId = Number($(this).parent().next().text());

      // Update comment count
      const commentCountEl = $(this).parent().parent().parent().parent().parent().parent().find(".custom-comment-count");
      const currentCommentCount = Number(commentCountEl.text().trim().split(" ")[0]);
      
      commentCountEl.text(`
      ${currentCommentCount - 1} ${currentCommentCount - 1 === 1 ? "comment" : "comments"}
      `);
      //
      
      // Submit delete request
      submitDeleteComment(commentId)
        .then(() => {
          // Remove comment element
          $(this).parent().parent().parent().remove();
        });
    });
    
    // Event listener for cancel delete
    $(".custom-cancel-delete-comment").on("click", function() {

      // Remove all prompt elements and show back edit and delete buttons
      $(this).prev().prev().prev().prev().removeClass("custom-default-hidden");
      $(this).prev().prev().prev().removeClass("custom-default-hidden");
      $(this).prev().prev().remove();
      $(this).prev().remove();
      $(this).remove();
      //
    });


  });
};

// Function that submits delete comment
const submitDeleteComment = (commentId) => {
  // AJAX PUT request
  return $.ajax({method: "DELETE",
    url: "/comment",
    data: {
      commentId,
    }
  })
    .then(resp => resp);
};