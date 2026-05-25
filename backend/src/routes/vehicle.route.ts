import { Router } from "express"
import { defineRequest } from "../utils"
import { VehicleService } from "../services/vehicles.service"

export const VehicleRoute = Router()

VehicleRoute.get("/brands", async (req, res) => {
  await defineRequest(res, async () => {
    return await VehicleService.getBrands()
  })
})

VehicleRoute.get("/brands/:brand/models", async (req, res) => {
  const brand = req.params.brand

  await defineRequest(res, async () => {
    return await VehicleService.getModels(brand)
  })
})

VehicleRoute.get("/all", async (req, res) => {
  await defineRequest(res, async () => {
    return await VehicleService.getAll()
  })
})

VehicleRoute.get("/:id", async (req, res) => {
  const id = Number(req.params.id)

  await defineRequest(res, async () => {
    return await VehicleService.getById(id)
  })
})

VehicleRoute.post("/create", async (req, res) => {
  await defineRequest(res, async () => {
    return await VehicleService.create(req.body)
  })
})

VehicleRoute.patch("/:id", async (req, res) => {
  const id = Number(req.params.id)

  await defineRequest(res, async () => {
    return await VehicleService.edit(id, req.body)
  })
})

VehicleRoute.delete("/:id", async (req, res) => {
  const id = Number(req.params.id)

  await defineRequest(res, async () => {
    return await VehicleService.delete(id)
  })
})