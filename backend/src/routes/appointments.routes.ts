import { response, Router } from "express"
import { request } from "node:http"
import { defineRequest } from "../utils"
import { AppointmentService } from "../services/appointments.service"

export const AppointmentRoute = Router()

AppointmentRoute.get('/all', async (request, response) => {
    await defineRequest(response, async () => {
        return await AppointmentService.getAll()
    })
})

AppointmentRoute.post('/create', async (request, response) => {
    await defineRequest(response, async () => {
        return await AppointmentService.create(request.body)
    })
})

export default AppointmentRoute