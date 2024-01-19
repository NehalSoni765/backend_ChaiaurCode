import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB connected !! SB Host ${connectionInstance.connection.host}`
    );
  } catch (err) {
    // console.error("MongoDB connection error ", errr);
    // process.exit(1);

    throw err;
  }
};

export default connectDB;
