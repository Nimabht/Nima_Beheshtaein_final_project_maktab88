import pkg from "mongoose";
const connect = pkg.connect;
const connection = pkg.connection;

const connectToDatabase = async () => {
  try {
    await connect(process.env.DATABASE_URL);
  } catch (error) {
    console.log("[-] database connection error:", error);
    console.info("[i] process terminated.");
    process.exit(1);
  }
};

connection.once("connected", () => {
  console.log("[🌿] connected to onyx database!");
});

connection.on("error", (error) => {
  console.error("[-] database connection error:", error);
});

export default connectToDatabase;
