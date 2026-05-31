import { Router } from "express"
import { defineRequest } from "../utils"
import { AppointmentService } from "../services/appointments.service"
import { authenticate } from "../middleware/authenticate"
import { authorize } from "../middleware/authorize"

export const AppointmentRoute = Router()

AppointmentRoute.get("/all", authenticate, async (req, res) => {
  // query -> status, dateFrom, dateTo, customerId, vehicleId
  const query = req.query
  await defineRequest(res, async () => {
    return await AppointmentService.getAll(query)
  })
})

AppointmentRoute.get("/customer/:customerId", authenticate, authorize("admin", "mechanic"), async (req, res) => {
  const customerId = Number(req.params.customerId)

  await defineRequest(res, async () => {
    return await AppointmentService.getByCustomerId(customerId)
  })
})

AppointmentRoute.get("/:id", authenticate, async (req, res) => {
  const id = Number(req.params.id)

  await defineRequest(res, async () => {
    return await AppointmentService.getById(id)
  })
})

AppointmentRoute.post("/create", authenticate, async (req, res) => {
  await defineRequest(res, async () => {
    return await AppointmentService.create(req.body)
  })
})

AppointmentRoute.patch("/:id", authenticate, async (req, res) => {
  const id = Number(req.params.id)

  await defineRequest(res, async () => {
    return await AppointmentService.edit(id, req.body)
  })
})

AppointmentRoute.patch("/:id/status", authenticate, async (req, res) => {
  const id = Number(req.params.id)
  const { status } = req.body

  await defineRequest(res, async () => {
    return await AppointmentService.changeStatus(id, status)
  })
})

AppointmentRoute.delete("/:id", authenticate, async (req, res) => {
  const id = Number(req.params.id)

  await defineRequest(res, async () => {
    return await AppointmentService.delete(id)
  })
})