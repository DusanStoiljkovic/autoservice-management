import { Router } from "express"
import { defineRequest } from "../utils"
import { CustomerService } from "../services/customers.service"

const CustomerRoute = Router()

CustomerRoute.get("/all", async (req, res) => {
  await defineRequest(res, async () => {
    return await CustomerService.getAll()
  })
})

CustomerRoute.get("/:id", async (req, res) => {
  const id = Number(req.params.id)

  await defineRequest(res, async () => {
    return await CustomerService.getById(id)
  })
})

CustomerRoute.post("/create", async (req, res) => {
  await defineRequest(res, async () => {
    return await CustomerService.create(req.body)
  })
})

CustomerRoute.patch("/:id", async (req, res) => {
  const id = Number(req.params.id)

  await defineRequest(res, async () => {
    return await CustomerService.edit(id, req.body)
  })
})

CustomerRoute.delete("/:id", async (req, res) => {
  const id = Number(req.params.id)

  await defineRequest(res, async () => {
    return await CustomerService.delete(id)
  })
})

export default CustomerRoute