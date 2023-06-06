const response = axios
  .get("/api/article?page=1&pageSize=6")
  .then((response) => {
    const { data, total, page } = response.data;
    renderTable(data, total, page);
  })
  .catch((error) => {
    polipop.add({
      type: "error",
      title: "Error",
      content: error.response.data.message,
    });
  });
