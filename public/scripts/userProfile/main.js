axios
  .get("/api/comment/my-comments")
  .then((res) => {
    const comments = res.data;
    $("#comment-count").text(`${comments.length}`);
  })
  .catch((error) => {
    console.log(error);
  });
