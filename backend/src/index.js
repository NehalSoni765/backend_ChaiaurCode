import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log("Listening on port: " + process.env.PORT)
    );
  })
  .catch((err) => console.log("Mongodb connection failed: ", err));

// //cleaning before this line (immidiate function invoke)
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
