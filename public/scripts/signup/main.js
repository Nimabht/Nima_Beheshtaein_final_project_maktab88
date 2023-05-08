$(() => {
  $("form").submit(function (e) {
    e.preventDefault();
    const fields = {
      firstname: $("#firstname-input").val(),
      lastname: $("#lastname-input").val(),
      username: $("#username-input").val(),
      password: $("#password-input").val(),
      phoneNumber: $("#phoneNumber-input").val(),
      repeat_password: $("#repeat-password-input").val(),
    };
    if (!!$("#gender-input").val()) fields.gender = $("#gender-input").val();

    console.log(fields);
    let polipop = new Polipop("section", {
      layout: "popups",
      insert: "before",
      pool: 1,
      life: 7000,
      progressbar: true,
    });

    axios
      .post("/api/auth/signup", fields)
      .then((response) => {
        polipop.add({
          type: "success",
          title: "Success",
          content: "Created successfully!",
        });
        setTimeout(() => {
          window.location.href = `/login`;
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
