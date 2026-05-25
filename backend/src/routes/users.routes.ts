import { Router, Request, Response } from "express"
import { UserService } from "../services/user.service"

export const UserRoute = Router()

UserRoute.get("/all", async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAll()

    res.json(users)
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to get users.",
    })
  }
})

UserRoute.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const user = await UserService.getById(id)

    res.json(user)
  } catch (error: any) {
    res.status(404).json({
      message: error.message || "User not found.",
    })
  }
})

UserRoute.post("/create", async (req: Request, res: Response) => {
  try {
    const user = await UserService.create(req.body)

    res.status(201).json(user)
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to create user.",
    })
  }
})

UserRoute.patch("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const user = await UserService.edit(id, req.body)

    res.json(user)
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to update user.",
    })
  }
})

UserRoute.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const result = await UserService.delete(id)

    res.json(result)
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to delete user.",
    })
  }
})