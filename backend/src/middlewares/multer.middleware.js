import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/temp"),
  filename: (req, file, cb) => {
    // const uniqueSuffix = Date.now() + "_" + Math.round(Math.random * 1e9);
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });