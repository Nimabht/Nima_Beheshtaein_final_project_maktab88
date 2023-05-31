const response = axios
  .get("/api/article?page=1&pageSize=4")
  .then((response) => {
    const { data, total, page } = response.data;
    renderContainer(data, total, page);
  })
  .catch((error) => {
    polipop.add({
      type: "error",
      title: "Error",
      content: error.response.data.message,
    });
  });
