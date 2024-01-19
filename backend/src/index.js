import express from "express";
import dotenv from "dotenv";
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";

const app = express();
dotenv.config();

connectDB();

// //cleaning before this line
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (err) => {
//       console.log("Error ", err);
//       // throw err;
//     });
//     app.listen(process.env.PORT, () =>
//       console.log("Listening on port " + process.env.PORT)
//     );
//   } catch (err) {
//     throw err;
//   }
// })();
