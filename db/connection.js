import mongoose from "mongoose";

mongoose
  .connect("mongodb://localhost:27017/onyx-blog-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("[🌿] connected to onyx database!");
  })
  .catch((err) => {
    console.log(err);
  });

export default mongoose.connection;
