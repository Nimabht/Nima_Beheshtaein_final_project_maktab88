let polipop = new Polipop("polipop", {
  layout: "popups",
  insert: "before",
  pool: 5,
  life: 4000,
  progressbar: true,
});

const renderTable = async (
  articles,
  totalArticles,
  currentPage,
  searchQuery
) => {
  if (!searchQuery) searchQuery = "";
  $("tbody").empty();
  try {
    for (const article of articles) {
      let {
        _id,
        title,
        thumbnailFileName,
        author: { firstname, lastname },
        viewsCount,
      } = article;

      const tableRowHtml = `<tr class="bg-white border-b hover:bg-gray-50">
              <th
                scope="row"
                class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                <img
                  class="w-10"
                  src="/thumbnails/${thumbnailFileName}" />
                <div class="pl-3">
                  <div class="text-base font-semibold">${title}</div>
                </div>
              </th>
              <td class="px-6 py-4">${firstname} ${lastname}</td>
              <td class="px-6 py-4">
                <div class="flex items-center">${viewsCount}</div>
              </td>
              <td class="px-6 py-4">
                <a
                  href="/article/${_id}"
                  class="block font-medium text-blue-600 hover:underline"
                  >View article</a
                >
                <button type="button" class="font-medium text-red-600 hover:underline inline-block bg-transparent border-0" onclick="deleteArticle('${_id}')">
                  Delete article
                </button>
              </td>
            </tr>`;
      $("tbody").append(tableRowHtml);
    }
    // Pagination part
    $("#pagination").empty();
    const pagination = $("#pagination");
    totalPages = Math.ceil(totalArticles / 6);
    for (let i = 1; i <= totalPages; i++) {
      let li = $('<li class="cursor-pointer"></li>');
      if (i === currentPage) {
        li.append(
          `<a id="${i}" class="page-link z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">${i}</a>`
        );
      } else {
        li.append(
          `<a id="${i}" class="page-link px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">${i}</a>`
        );
      }
      pagination.append(li);
    }
    $(".page-link").on("click", async function () {
      const page = this.id;
      const response = await axios.get(
        `/api/user?page=${page}&pageSize=6&${searchQuery}`
      );
      let { data, total } = response.data;
      renderContainer(data, total, Number(page), searchQuery);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  } catch (error) {
    polipop.add({
      type: "error",
      title: "Error",
      content: error.response.data.message,
    });
  }
};

$("#search-input").on("keyup", async () => {
  const searchQuery = $("#search-input").val();
  const response = await axios.get(
    `/api/article?page=1&pageSize=6&search=${searchQuery}`
  );
  let { data, total, page } = response.data;
  renderTable(data, total, Number(page), searchQuery);
});

const deleteArticle = async (id) => {
  try {
    await axios.delete(`/api/article/${id}`);
    const response = await axios.get("/api/article?page=1&pageSize=6");
    const { data, total, page } = response.data;
    renderTable(data, total, page);
    polipop.add({
      type: "info",
      title: "Success",
      content: "User deleted successfully!",
    });
  } catch (error) {}
};
