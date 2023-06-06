let polipop = new Polipop("polipop", {
  layout: "popups",
  insert: "before",
  pool: 5,
  life: 4000,
  progressbar: true,
});

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

const renderContainer = async (
  articles,
  totalArticles,
  currentPage,
  searchQuery
) => {
  if (!searchQuery) searchQuery = "";
  $("#articles").empty();
  try {
    for (const article of articles) {
      let {
        _id,
        author,
        content,
        createdAt,
        sketch,
        thumbnailFileName,
        title,
        viewsCount,
      } = article;
      content = JSON.parse(content);
      const formattedDate = formatDate(article.createdAt);
      const formattedReadingTime = formatReadingTime(content.blocks);

      const articleHtml = ` <div class="border-t p-8 border-gray-300 flex my-2">
              <div class="w-[70%]">        
                <h2 class="text-3xl font-semibold">${title}</h2>
                <p class="text-gray-500 my-3">
                  ${sketch}
                </p>
                <span class="text-gray-500 mr-5">${formattedDate} · ${formattedReadingTime} read</span>
                <a href="/article/${_id}" class="block my-2 text-teal-400	">Read more -></a>
              </div>
              <div>
                <img
                  src="/thumbnails/${thumbnailFileName}"
                  class="object-contain w-96 h-36" />
              </div>
            </div>`;
      $("#articles").append(articleHtml);
    }
    //Pagination part
    $("#pagination").empty();
    const pagination = $("#pagination");
    totalPages = Math.ceil(totalArticles / 4);
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
        `/api/article?page=${page}&pageSize=4&${searchQuery}`
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

$("#search-form").on("submit", async (e) => {
  e.preventDefault();
  const searchQuery = $("#default-search").val();
  const response = await axios.get(
    `/api/article?page=1&pageSize=4&search=${searchQuery}`
  );
  let { data, total, page } = response.data;
  renderContainer(data, total, Number(page), searchQuery);
});
