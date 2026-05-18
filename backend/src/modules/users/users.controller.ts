import type { Request, Response } from 'express'
import { UserService } from './users.service'

export class UserController {
    static async getAllUsers(req: Request, res: Response) {
        try {   
            const users = await UserService.getAllUsers()

            return res.status(200).json({
                success: true,
                data: users,
            })
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to get users."
            })
        }
    }
}