import winston from "winston";
import "winston-mongodb";

//option object for winston logger (file - console - db)
const options = {
  file: {
    level: "info",
    filename: "internalErrorInfo.log",
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 10,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.prettyPrint()
    ),
  },
  console: {
    level: "debug",
    handleExceptions: true,
    format: winston.format.combine(winston.format.simple()),
  },
  dataBase: {
    level: "error",
    db: process.env.DATABASE_URL,
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
    new winston.transports.MongoDB(options.dataBase),
  ],
  exitOnError: false,
});

export default (Error, req, res, next) => {
  // if (Error.statusCode === 401) {
  //   res.redirect("http://localhost:5050/login"); // Render login page for unauthorized user
  //   return;
  // }
  //logging server side errors (5XX)
  if (!Error.statusCode || Error.statusCode.toString().startsWith("5")) {
    logger.error(Error.message, { metadata: Error });
  }
  //handling server side errors (5XX || 4XX)
  res.status(Error.statusCode || 500);
  res.send({
    error: Error.status || "error",
    message: Error.statusCode.toString().startsWith("5")
      ? "Internal Server Error"
      : Error.message,
  });
};
