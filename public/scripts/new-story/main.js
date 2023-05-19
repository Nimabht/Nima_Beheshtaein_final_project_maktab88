let polipop = new Polipop("section", {
  layout: "popups",
  insert: "before",
  pool: 1,
  life: 5000,
  progressbar: true,
});

// const quill = new Quill("#editor", {
//   theme: "snow",
//   modules: {
//     toolbar: [
//       [{ size: [] }],
//       [{ font: [] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       [{ align: [] }],
//       ["link"],
//       ["code-block", "clean"],
//     ],
//   },
// });

const editor = new EditorJS({
  holder: "editorjs",
  placeholder: "Tell your story...",
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

$("#submit-btn").on("click", async () => {
  const formData = new FormData();
  const title = $("#title-input").val();
  const sketch = $("#sketch-input").val();
  const content = await editor.save();
  const fileInput = $("input[type=file]")[0];
  const thumbnail = fileInput.files[0];

  formData.append("title", title);
  formData.append("sketch", sketch);
  formData.append("content", JSON.stringify(content));
  formData.append("thumbnail", thumbnail);

  try {
    await axios.post("/api/article", formData);
    polipop.add({
      type: "success",
      title: "Success",
      content: "Created successfully!",
    });
  } catch (error) {
    polipop.add({
      type: "error",
      title: "Error",
      content: error.response.data.message,
    });
  }
});