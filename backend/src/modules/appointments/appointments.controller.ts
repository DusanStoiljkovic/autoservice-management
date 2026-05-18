import { AppointmentService } from "./appointments.service"
import type { Request, Response } from "express"

export class AppointmentController {
    static async getAll(req: Request, res: Response) {
        try {
            const appointments = await AppointmentService.getAll()

            return res.status(200).json({
                success: true,
                data: appointments,
            })
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to get appointments',
            })
        }
    }
}