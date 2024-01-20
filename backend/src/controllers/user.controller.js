import { User } from "../models/user_models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password, fullName } = req.body;
  if (
    [userName, email, password, fullName].some((field) => field?.trim() === "")
  )
    throw new ApiError(400, "all fields must be required");
  const existedUser = await User.findOne({ $or: [{ userName }, { email }] });
  if (existedUser)
    throw new ApiError(
      409,
      "User already existed with this userName and email"
    );
  const avatarLocalPath =
    req.files && req.files?.avatar && req?.files?.avatar?.[0]?.path;
  const coverImageLocalPath =
    req.files && req.files?.coverImage && req?.files?.coverImage?.[0]?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage =
    coverImageLocalPath && (await uploadOnCloudinary(coverImageLocalPath));
  if (!avatar) throw new ApiError(500, "Avatar not uploaded");

  const user = await User.create({
    email,
    password,
    userName: userName.toLowerCase(),
    fullName,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) throw new ApiError(404, "User not found");
  return res
    .status(201)
    .json(new ApiResponse(200, "User created successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  //get user from request body
  const { userName, email, password } = req.body;
  //validating user
  if ([userName, email, password].some((field) => field?.trim() === ""))
    throw new ApiError(400, "all fileds must be required");
  //check user exist
  const isExistUser = await User.findOne({ $and: [{ email }, { userName }] });
  if (!isExistUser) throw new ApiError(404, "User not found");
  //check passsword is match
  const isPasspwordCorrect = await isExistUser.isPasspwordCorrect(password);
  if (!isPasspwordCorrect)
    throw new ApiError(404, "Invalid password credantial");
  //genderate accesstoken and refreshToken
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(isExistUser);
  //remove password and refreshToken to frontend
  const currentUser = await User.findById(isExistUser?._id).select(
    "-password -refreshToken"
  );
  //set cookie
  const options = { httpOnly: true, secure: true };
  //share response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User LoggedIn Successfully", {
        user: currentUser,
        accessToken,
        refreshToken,
      })
    );
});

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req?.user?.id;
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );
  const options = { httpOnly: true, secure: true };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logout successfully", {}));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incommingToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incommingToken) throw new ApiError(401, "Unauthorised request");
    const decodedToken = jwt.verify(
      incommingToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken._id);
    if (!user) throw new ApiError(404, "User not found");
    if (incommingToken !== user?.refreshToken)
      throw new ApiError(401, "Refresh token is expired or used");
    const options = { httpOnly: true, secure: true };
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(user);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "Action token refreshed", {
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    throw new ApiError(
      error?.code || 401,
      error?.message || "Invalid user token"
    );
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (oldPassword === newPassword)
    throw new ApiError(400, "Password should be different");
  const user = await User.findById(req?.user?._id);
  const isPasspwordCorrect = user.isPasspwordCorrect(oldPassword);
  if (!isPasspwordCorrect) throw new ApiError(400, "Invalid password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, "Password Updated successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "User fetched Succeessfully", req.user));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName } = req.body;
  if (!fullName) throw new ApiError(400, "All field must be required");
  const user = await User.findByIdAndUpdate(req.user?._id, {
    $set: {
      fullName: fullName,
    },
  }).select("-password");
  res
    .status(200)
    .json(new ApiResponse(200, "Account details updated succfully", user));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req?.file.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");
  const avatar = uploadOnCloudinary(avatarLocalPath);
  if (!avatar) throw new ApiError(400, "Error while uploading avatar");
  const user = await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $set: { avatar: avatar?.url || "" },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "Avatar updated Successfully", user));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req?.file.path;
  if (!coverImageLocalPath) throw new ApiError(400, "CoverImage is required");
  const coverImage = uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage) throw new ApiError(400, "Error while uploading cover Image");
  const user = await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $set: { coverImage: coverImage?.url || "" },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "CoverImage updated Successfully", user));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
};
