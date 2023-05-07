$(() => {
  let polipop = new Polipop("section", {
    layout: "popups",
    insert: "before",
    pool: 5,
    life: 2000,
    progressbar: true,
  });
  $("form").submit(function (e) {
    e.preventDefault();
    const loginInfo = {
      username: $("#username-input").val(),
      password: $("#password-input").val(),
    };
    axios
      .post("/api/auth/login", loginInfo)
      .then((response) => {
        polipop.add({
          type: "success",
          title: "Success",
          content: "Login successfully!",
        });
        setTimeout(() => {
          window.location.href = `/dashboard`;
        }, 2000);
      })
      .catch((error) => {
        polipop.add({
          type: "error",
          title: "Error",
          content: error.response.data.message,
        });
      });
  });
});
