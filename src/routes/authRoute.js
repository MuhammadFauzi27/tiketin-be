import { Router } from "express";
import { loginController, registerController } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);

export {
  authRouter
}