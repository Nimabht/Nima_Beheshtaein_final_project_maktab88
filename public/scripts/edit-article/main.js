$("#thumbnail-input").on("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    $("#thumbnail-out").attr("src", reader.result);
  };
  reader.readAsDataURL(file);
});

let polipop = new Polipop("section", {
  layout: "popups",
  insert: "before",
  pool: 1,
  life: 5000,
  progressbar: true,
});
const editor = new EditorJS({
  holder: "editorjs",
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
    $("#title-input").val(title);
    $("#sketch-input").val(sketch);
    $("#thumbnail-out").attr("src", `/thumbnails/${thumbnailFileName}`);
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
      content: error,
    });
  });

$("#submit-btn").on("click", async () => {
  const title = $("#title-input").val();
  const sketch = $("#sketch-input").val();
  const content = await editor.save();
  const fileInput = $("input[type=file]")[0];
  const thumbnail = fileInput.files[0];
  try {
    await axios.put(`/api/article/${articleId}`, {
      title,
      sketch,
      content: JSON.stringify(content),
    });
    if (!!thumbnail) {
      const thumbNailFormData = new FormData();
      thumbNailFormData.append("thumbnail", thumbnail);
      await axios.patch(
        `/api/article/update-thumbnail/${articleId}`,
        thumbNailFormData
      );
    }
    polipop.add({
      type: "success",
      title: "Success",
      content: "Updated successfully!",
    });
    window.location.href = `/article/${articleId}`;
  } catch (error) {
    polipop.add({
      type: "error",
      title: "Error",
      content: error.response.data.message,
    });
  }
});
