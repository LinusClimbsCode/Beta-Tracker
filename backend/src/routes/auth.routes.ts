import { Router } from "express";
import { loginController, logoutController, refreshAccessTokenController, registerController } from '#controllers'

export const authRouter = Router()

authRouter.get('/login', loginController)

authRouter.post('/register', registerController)

authRouter.get('/logout', logoutController)

authRouter.get('/refresh', refreshAccessTokenController)
