import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

mongoose
  .connect(process.env.DATABASE_URL, {
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
