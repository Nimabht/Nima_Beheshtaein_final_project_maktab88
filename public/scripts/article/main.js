let polipop = new Polipop("section", {
  layout: "popups",
  insert: "before",
  pool: 1,
  life: 5000,
  progressbar: true,
});
const editor = new EditorJS({
  holder: "editorjs",
  readOnly: true,
  tools: {
    header: {
      class: Header,
      config: {
        levels: [1, 2, 3],
        defaultLevel: 2,
      },
    },
    list: {
      class: List,
      inlineToolbar: true,
    },
    image: {
      class: ImageTool,
      config: {
        endpoints: {
          byFile: "/api/article/uploadImage", // Your backend file uploader endpoint
          byUrl: "/articleImages", // Your endpoint that provides uploading by Url
        },
      },
    },
    embed: {
      class: Embed,
      services: {
        youtube: true,
        coub: true,
      },
      inlineToolbar: true,
    },

    code: {
      class: CodeTool,
      config: {
        placeholder: "Enter code here...",
      },
    },
    inlineCode: {
      class: InlineCode,
      shortcut: "CMD+SHIFT+M",
    },
    marker: {
      class: Marker,
      shortcut: "CMD+SHIFT+H",
    },
    underline: {
      class: Underline,
      shortcut: "CMD+SHIFT+U",
    },
    table: {
      class: Table,
      inlineToolbar: true,
    },
    delimiter: Delimiter,
  },
});
const articleId = window.location.pathname.split("/").pop();
axios
  .get(`/api/article/${articleId}`)
  .then((response) => {
    const {
      _id,
      author,
      content,
      createdAt,
      sketch,
      thumbnailFileName,
      title,
      viewsCount,
    } = response.data;
    document.title = sketch;
    $("#article-sketch-out").text(sketch);
    $("#article-title-out").text(title);
    $("#author-name-out").text(`${author.firstname} ${author.lastname} . `);
    //FIXME: fix profile url must have username in author object
    // $("#author-profile-out").attr("href", `/profile/${author.username}`);
    const readTime = formatReadingTime(JSON.parse(content).blocks);
    const date = formatDate(createdAt);
    $("#article-time-out").text(`${readTime} read . ${date}`);
    $("#article-views-out").text(`Views: ${viewsCount}`);
    $("#article-thumbnail-out").attr("src", `/thumbnails/${thumbnailFileName}`);
    $("#edit-url").attr("href", `/edit-article/${_id}`);
    editor.isReady
      .then(() => {
        console.log("Editor.js is ready to work!");
        editor.render(JSON.parse(content));
      })
      .catch((reason) => {
        console.log(`Editor.js initialization failed because of ${reason}`);
      });
  })
  .catch((error) => {
    polipop.add({
      type: "error",
      title: "Error",
      content: error.response.data.message,
    });
  });

$("#delete-btn").on("click", async () => {
  try {
    await axios.delete(`/api/article/${articleId}`);
    polipop.add({
      type: "info",
      title: "Success",
      content: "Article deleted successfully!",
    });
    //FIXME: should redirect back to my articles
  } catch (error) {
    polipop.add({
      type: "error",
      title: "Error",
      content: error.response.data.message,
    });
  }
});
