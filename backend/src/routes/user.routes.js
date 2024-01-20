import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

// router.get("/register", registerUser());
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").patch(verifyJwt,changeCurrentPassword);
router.route("/current-user").get(verifyJwt,getCurrentUser);
router.route("/update-account-details").get(verifyJwt,updateAccountDetails);
router.route("/update-avatar").patch(verifyJwt,updateUserAvatar);
router.route("/update-cover-image").patch(verifyJwt,updateUserCoverImage);


export default router;
