import { Router } from "express"
import { defineRequest } from "../utils"
import { AppointmentService } from "../services/appointments.service"

export const AppointmentRoute = Router()

AppointmentRoute.get("/all", async (req, res) => {
  await defineRequest(res, async () => {
    return await AppointmentService.getAll()
  })
})

AppointmentRoute.get("/customer/:customerId", async (req, res) => {
  const customerId = Number(req.params.customerId)

  await defineRequest(res, async () => {
    return await AppointmentService.getByCustomerId(customerId)
  })
})

AppointmentRoute.get("/:id", async (req, res) => {
  const id = Number(req.params.id)

  await defineRequest(res, async () => {
    return await AppointmentService.getById(id)
  })
})

AppointmentRoute.post("/create", async (req, res) => {
  await defineRequest(res, async () => {
    return await AppointmentService.create(req.body)
  })
})

AppointmentRoute.patch("/:id", async (req, res) => {
  const id = Number(req.params.id)

  await defineRequest(res, async () => {
    return await AppointmentService.edit(id, req.body)
  })
})

AppointmentRoute.patch("/:id/status", async (req, res) => {
  const id = Number(req.params.id)
  const { status } = req.body

  await defineRequest(res, async () => {
    return await AppointmentService.changeStatus(id, status)
  })
})

AppointmentRoute.delete("/:id", async (req, res) => {
  const id = Number(req.params.id)

  await defineRequest(res, async () => {
    return await AppointmentService.delete(id)
  })
})