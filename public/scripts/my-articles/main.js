const response = axios
  .get("/api/article/my-articles?page=1&pageSize=4")
  .then((response) => {
    console.log(response.data);
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
