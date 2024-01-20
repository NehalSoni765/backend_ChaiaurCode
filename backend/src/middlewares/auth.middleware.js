import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    //get token from cookies(access) or headers(authorization)
    const token =
      req?.cookies?.accessToken ||
      req?.headers?.authorization?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Unauthorized request");
    //decode token using jwt verify
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //get user by decodeToken id
    const user = await User.findById(decodeToken._id).select("-password -refreshToken");
    //validate user exist
    if (!user) throw new ApiError(404, "User not found");
    //set request to user
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      error?.code || 401,
      error?.message || "Invalid user token"
    );
  }
});
