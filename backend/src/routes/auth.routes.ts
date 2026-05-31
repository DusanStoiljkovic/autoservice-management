import { Router, Request, Response } from "express"
import { AuthService } from "../services/auth.service"
import { authenticate } from "../middleware/authenticate"
import { authorize } from "../middleware/authorize"
import { UsersRole } from "../entities/Users"
import { defineRequest } from "../utils"

const AuthRoute = Router()

AuthRoute.post("/register", authenticate, authorize(UsersRole.ADMIN), async (req: Request, res: Response) => {
  try {
    const result = await AuthService.register(req.body)

    res.status(201).json(result)
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to register user.",
    })
  }
})

AuthRoute.post("/login", async (req: Request, res: Response) => {
  try {
    const result = await AuthService.login(req.body)

    res.json(result)
  } catch (error: any) {
    res.status(401).json({
      message: error.message || "Failed to login.",
    })
  }
})

AuthRoute.post("/refresh", authenticate, async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required." })
      return
    }

    const result = await AuthService.refresh(refreshToken)

    res.json(result)
  } catch (error: any) {
    res.status(403).json({
      message: error.message || "Failed to refresh token.",
    })
  }
})

AuthRoute.get("/profile", authenticate, AuthService.authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    const profile = await AuthService.profile(user.id)

    res.json(profile)
  } catch (error: any) {
    res.status(404).json({
      message: error.message || "Profile not found.",
    })
  }
})

export default AuthRoute