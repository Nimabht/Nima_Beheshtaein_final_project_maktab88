const AVERAGE_READING_SPEED = 80;

function formatReadingTime(blocks) {
  let totalWords = 0;
  blocks.forEach((block) => {
    if (block.type === "paragraph") {
      const text = block.data.text || "";
      const words = text.trim().split(/\s+/).length;
      totalWords += words;
    }
  });

  const averageTime = totalWords / AVERAGE_READING_SPEED;

  if (averageTime < 1) {
    const seconds = Math.round(averageTime * 60);
    return `${seconds} sec`;
  } else if (averageTime < 120) {
    const minutes = Math.round(averageTime);
    return `${minutes} min`;
  } else {
    const hours = Math.floor(averageTime / 60);
    return `${hours} hours`;
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const currentYear = new Date().getFullYear();
  if (date.getFullYear() === currentYear) {
    const formattedDate = date.toLocaleString("default", {
      month: "short",
      day: "numeric",
    });
    return formattedDate;
  } else {
    const formattedDate = date.toLocaleString("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return formattedDate;
  }
}

const renderComments = async () => {
  const response = await axios.get(`/api/article/${articleId}`);
  const { comments } = response.data;
  $("#comments").empty();
  const countOfComments = comments.length;
  $("#drawer-navigation-label").text(`Comments (${countOfComments})`);
  $("#comment-count").text(` ${countOfComments}`);
  for (const comment of comments) {
    const {
      _id: commentId,
      content,
      article,
      user: { _id: userId, firstname, lastname, avatarFileName },
      createdAt,
      updatedAt,
    } = comment;
    const formattedDate = formatDate(updatedAt);
    const commentHtml = `<div id="${commentId}" class="w-[90%] flex flex-col p-5 shadow-xl my-5">
                <div class="flex flex-row mb-5">
                  <img class="w-10 h-10 rounded-full mr-2" src="/avatars/${avatarFileName}" />
                  <div>
                    <p class="text-black">${firstname} ${lastname}</p>
                    <p class="text-gray">${formattedDate} ${
      createdAt == updatedAt ? "" : "(edited)"
    }</p>
                  </div>
                </div>
                <div>
                  <p>
                   ${content}
                  </p>
                </div>
                <div class="mt-5">
                  <button
                    class="text-blue-600 bg-transparent border-none cursor-pointer edit-comment-btn ${
                      viewerId === userId ? "" : "hidden"
                    }">
                    Edit
                  </button>
                  <button
                    class="text-red-600 bg-transparent border-none cursor-pointer delete-comment-btn ${
                      viewerId === userId || viewerRole === "admin"
                        ? ""
                        : "hidden"
                    }">
                    Delete
                  </button>
                </div>
              </div>`;
    $("#comments").append(commentHtml);
  }
  $(".delete-comment-btn").on("click", async function () {
    try {
      const commentId = this.parentElement.parentElement.attributes.id.value;
      await axios.delete(`/api/comment/${commentId}`);
      polipop.add({
        type: "info",
        title: "Info",
        content: "Comment deleted successfully.",
      });
      renderComments();
    } catch (error) {
      //FIXME: should say unauthorized but bc of my backend global error handler i got wrong error
      polipop.add({
        type: "error",
        title: "Error",
        content: error.response.status,
      });
    }
  });
  $(".edit-comment-btn").on("click", async function () {
    await renderComments();
    try {
      const commentId = this.parentElement.parentElement.attributes.id.value;
      //------------------
      $(`#${commentId}`).empty();
      let response = await axios.get(`/api/comment/${commentId}`);
      const { content } = response.data;
      const newInnerHtml = `<div class="w-full flex flex-col">
                <form id="update-comment-form">
                  <div class="w-full mb-4 rounded-lg my-5 bg-white">
                    <div class="px-4 py-2 bg-white">
                      <label for="comment" class="sr-only">Your comment</label>
                      <textarea
                        id="comment-update-input"
                        rows="4"
                        minlength="3"
                        maxlength="500"
                        class="outline-0 resize-y w-full px-0 text-sm text-gray-900 bg-white border-0 focus:ring-0"
                        placeholder="Write a comment..."
                        required>${content}</textarea>
                    </div>
                    <div
                      class="flex bg-white items-center justify-between px-3 py-2 border-t mt-5">
                      <button
                        type="submit"
                        class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800">
                        Update comment
                      </button>
                      <button
                        type="button"
                        id="cancel-update-comment"
                        class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 hover:bg-red-800">
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>`;
      $(`#${commentId}`).append(newInnerHtml);

      $("#cancel-update-comment").on("click", () => {
        renderComments();
      });
      $("#update-comment-form").on("submit", async (e) => {
        e.preventDefault();
        const content = $("#comment-update-input").val();
        try {
          await axios.put(`/api/comment/${commentId}`, { content });
          polipop.add({
            type: "success",
            title: "Success",
            content: "Comment updated successfully.",
          });
          renderComments();
        } catch (error) {
          polipop.add({
            type: "error",
            title: "Error",
            content: error.response.data.message,
          });
        }
      });
      //------------------
    } catch (error) {
      //FIXME: should say unauthorized but bc of my backend global error handler i got wrong error
      polipop.add({
        type: "error",
        title: "Error",
        content: error.response.status,
      });
    }
  });
};
