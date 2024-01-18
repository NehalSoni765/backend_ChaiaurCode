import express from "express";
import dotenv from "dotenv";

const app = express();
const port = 8000;
dotenv.config();

app.get("/", (req, res) => {
  console.log("Hello World");
});

app.listen(process.env.PORT || port, () =>
  console.log("Listening the port " + process.env.PORT || port)
);
