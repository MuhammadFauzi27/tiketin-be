import {loginService, registerService, loginGoogleService} from "../services/authService.js";

export const registerController = async (req, res, next) => {
  try {
    const payload = req.body;
    await registerService(payload);

    res.status(201).json({
      message: 'Register Success',
      data: {}
    })
  } catch (error) {
    next(error)
  }
}

export const loginController = async (req, res, next) => {
  try {
    const payload = req.body;
    const token = await loginService(payload);

    res.json({
      message: 'Login Success',
      data: {
        token
      }
    })
  } catch (error) {
    next(error)
  }
}

export const loginGoogleController = async (req, res, next) => {
  try {
    const payload = req.body;
    const token = await loginGoogleService(payload);

    res.json({
      message: 'Login Success',
      data: {
        token
      }
    })
  } catch (error) {
    next(error)
  }
}