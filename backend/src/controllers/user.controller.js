import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user_models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user from request
  const { userName, email, password, fullName, watchHistory, refToken } =
    req.body;
  //check validation
  //if(!fullName) throw new ApiError(400,"Fullname is required")
  if (
    [fullName, userName, email, password].some((field) => field?.trim() === "")
  )
    throw new ApiError(400, "All fields are required");
  // user email or userName exist
  const existedUser = User.findOne({ $or: [{ userName }, { email }] });
  if (existedUser) throw new ApiError(409, "User with email or userName exist");
  // avatar exist
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");
  //then upload cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage =
    coverImageLocalPath && (await uploadOnCloudinary(coverImageLocalPath));
  //check avatar
  if (!avatar) throw new ApiError(400, "Avatar image is required");
  // add into user object
  const user = User.create({
    userName: userName.toLowerCase(),
    email,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
  });
  //check user created and remove passowrd and reftoken
  const createdUser = User.findById(user._id).select("-password -refToken");
  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering the user");

  return res
    .status(201)
    .json(new ApiResponse(200, "User registered successfully", createdUser));
});
export { registerUser };
