import express from "express";
import cookiePraser from "cookie-parser";
import cors from "cors";

const app = express();

//cors issue
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

//config or set middleware
app.use(express.json({ limit: "16kb" }));

//url encoded config and extended for nested purpose
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//access public folder
app.use(express.static("public"));

//cookieparse
app.use(cookiePraser());

export { app };
