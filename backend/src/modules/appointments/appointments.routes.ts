import { Router } from "express"
import { AppointmentController } from "./appointments.controller"

const router = Router()

router.get('/', AppointmentController.getAll)

export default router