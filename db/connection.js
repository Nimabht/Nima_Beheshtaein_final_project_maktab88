const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/onyx-blog-db")
  .then(() => {
    console.log("[🌿] connected to onyx database!");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose.connection;
