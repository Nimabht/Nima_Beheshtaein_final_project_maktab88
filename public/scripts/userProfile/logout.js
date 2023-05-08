let polipop = new Polipop("polipop", {
  layout: "popups",
  insert: "before",
  pool: 1,
  life: 7000,
  progressbar: true,
});
$("#logout-btn").on("click", () => {
  axios
    .get("/api/auth/logout")
    .then((response) => {
      polipop.add({
        type: "success",
        title: "Success",
        content: "Logout successfully!",
      });
      setTimeout(() => {
        window.location.href = `/login`;
      }, 2000);
    })
    .catch((error) => {
      polipop.add({
        type: "error",
        title: "Error",
        content: "Something went wrong!!!",
      });
    });
});
