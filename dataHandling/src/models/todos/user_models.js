import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      //mongoose
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password must be required"],
    },
  },
  { timestamps: true } //created,update date
);

export const User = mongoose.model("User", userSchema);
