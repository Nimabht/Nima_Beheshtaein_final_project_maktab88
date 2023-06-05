$(async () => {
  let result = await axios.get("/api/user");
  $("#total-user-out").text(result.data.total);
  result = await axios.get("/api/article");
  $("#total-article-out").text(result.data.total);
  result = await axios.get("/api/comment");
  $("#total-comment-out").text(result.data.total);
});
