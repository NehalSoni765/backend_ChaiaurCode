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
  } catch (errr) {
    console.error("MongoDB connection error ", errr);
    process.exit(1);
  }
};

export default connectDB;
