import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshAccessTokenController,
  registerController,
} from "#controllers";
import { validateLogin, validateRegister } from "#middleware";

export const authRouter = Router();

authRouter.post("/login", validateLogin, loginController);

authRouter.post("/register", validateRegister, registerController);

authRouter.post("/logout", logoutController);

authRouter.post("/refresh", refreshAccessTokenController);
