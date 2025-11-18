import { Router } from "express";
import { loginController, logoutController, refreshAccessTokenController, registerController, getMeController } from '#controllers'
import { validateLogin, validateRegister } from "#middleware/validate.auth";
import { requireAuth } from "#middleware/auth.middleware";

export const authRouter = Router()

authRouter.get('/login', validateLogin, loginController)

authRouter.post('/register', validateRegister, registerController)

authRouter.get('/logout', logoutController)

authRouter.get('/refresh', refreshAccessTokenController)

authRouter.get('/me', requireAuth, getMeController)
