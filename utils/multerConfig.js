import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/avatars");
  },
  filename: function (req, file, cb) {
    if (
      file.originalname === "female-anonymous.png" ||
      file.originalname === "male-anonymous.png"
    )
      cb(new Error("Bad file name!"), null);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
    }
  },
  limits: {
    files: 1,
    fileSize: 1 * 1024 * 1024,
  },
});
