import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bycrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, //searching field
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true, //searching field
    },
    watchVideos: [],
    avatar: {
      type: String, //cloudinary Image profile
      required: true,
    },
    coverImage: {
      type: String, //cloudinary Image background
    },
    watchHostory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refToken: {
      type: String,
    },
  },
  { timeStamp: true }
);

//encrypt password before store intodb
userSchema.pre("save", async (next) => {
  if (!this.isModified("password")) return next();
  this.password = bycrypt.hash(this.password, 10);
  next();
});

//validating password
userSchema.methods.isPasspwordCorrect = async (password) => {
  return await bycrypt.compare(this.password, password);
};

userSchema.methods.generateAccessToken = () => {
  jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = () => {
  jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};
export const User = mongoose.model("User", userSchema);
