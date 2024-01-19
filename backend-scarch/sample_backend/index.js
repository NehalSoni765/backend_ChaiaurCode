const expres = require("express");
// import express from "express";
require("dotenv").config();
// require("dotenv").config("./env");

const app = expres();
const port = 3000;

const gitHubApiResponse = async () => {
  const data = await fetch("https://api.github.com/users");
  return await data.json();
};
app.get("/", (req, res) => res.send("<h1>Hello world</h1>"));
app.get("/twitter", (req, res) => res.send("<h1>twitter clone</h1>"));
app.get("/github", (req, res) => res.json(gitHubApiResponse()));
app.listen(process.env.PORT, () => console.log("Listening on port: " + port));
