import { Router } from "express";
import { loginController, logoutController, refreshAccessTokenController, registerController } from '#controllers'
import { validateLogin, validateRegister } from "#middleware/validate.auth";

export const authRouter = Router()

authRouter.get('/login', validateLogin, loginController)

authRouter.post('/register', validateRegister, registerController)

authRouter.get('/logout', logoutController)

authRouter.get('/refresh', refreshAccessTokenController)
