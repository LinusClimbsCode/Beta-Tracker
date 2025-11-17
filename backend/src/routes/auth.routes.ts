import { Router } from "express";
import { loginController, registerController } from '#controllers'

export const authRouter = Router()

authRouter.get('/login', loginController)

authRouter.post('/register', registerController)
