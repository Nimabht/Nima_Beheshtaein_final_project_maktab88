const userId = $("#mydiv").attr("user_id");
let polipop = new Polipop("polipop", {
  layout: "popups",
  insert: "before",
  pool: 5,
  life: 4000,
  progressbar: true,
});
$("#update-information-btn").on("click", async () => {
  let updatedUser = {
    firstname: $("#firstname-input").val(),
    lastname: $("#lastname-input").val(),
    username: $("#username-input").val().trim(),
  };

  const genderValue = $("#gender-input").val();

  if (genderValue !== "") {
    updatedUser.gender = genderValue;
  }

  try {
    await axios.put(`/api/user/${userId}`, updatedUser);
    polipop.add({
      type: "success",
      title: "Success",
      content: "Updated successfully!",
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    polipop.add({
      type: "error",
      title: "Error",
      content: error.response.data.message,
    });
  }
});

$("#reset-password-btn").on("click", async () => {
  let information = {
    currentPassword: $("#current-password-input").val(),
    newPassword: $("#new-password-input").val(),
  };

  try {
    await axios.patch(`/api/auth/resetpassword/${userId}`, information);
    polipop.add({
      type: "success",
      title: "Success",
      content: "Password changed successfully!",
    });
    setTimeout(() => {
      window.location.href = "http://localhost:1010/login";
    }, 2000);
  } catch (error) {
    polipop.add({
      type: "error",
      title: "Error",
      content: error.response.data.message,
    });
  }
});

// Add an event listener to the "Update avatar" button
$("#update-avatar-btn").on("click", async function () {
  try {
    const fileInput = $("input[type=file]")[0];
    const file = fileInput.files[0];

    const formData = new FormData();

    formData.append("avatar", file);
    await axios.patch(`/api/user/update-avatar/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    polipop.add({
      type: "success",
      title: "Success",
      content: "Avatar changed successfully!",
    });
  } catch (error) {
    polipop.add({
      type: "error",
      title: "Error",
      content: error.response.data.message,
    });
  }
});

$("#delete-account-btn").on("click", async () => {
  try {
    await axios.delete(`/api/user/${userId}`);
    await axios.get("/api/auth/logout");
    polipop.add({
      type: "info",
      title: "Deleted!",
      content: "User deleted successfully!",
    });
    setTimeout(() => {
      window.location.href = `http://localhost:1010/login`;
    }, 2000);
  } catch (error) {
    polipop.add({
      type: "error",
      title: "Error",
      content: "Something is wrong!!!",
    });
  }
});
