import { Router, Request, Response } from "express"
import { RepairOrderItemsService } from "../services/repair-order-items.service"

const RepairOrderItemsRoute = Router()

RepairOrderItemsRoute.get("/", async (req: Request, res: Response) => {
  try {
    const items = await RepairOrderItemsService.getAll()

    res.json(items)
  } catch (error) {
    res.status(500).json({ message: "Failed to get repair order items" })
  }
})

RepairOrderItemsRoute.get("/repair-order/:repairOrderId", async (req: Request, res: Response) => {
  try {
    const repairOrderId = Number(req.params.repairOrderId)
    const items = await RepairOrderItemsService.getByRepairOrderId(repairOrderId)

    res.json(items)
  } catch (error) {
    res.status(500).json({ message: "Failed to get items for repair order" })
  }
})

RepairOrderItemsRoute.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const item = await RepairOrderItemsService.getById(id)

    res.json(item)
  } catch (error) {
    res.status(404).json({ message: "Repair order item not found" })
  }
})

RepairOrderItemsRoute.post("/", async (req: Request, res: Response) => {
  try {
    const item = await RepairOrderItemsService.create(req.body)

    res.status(201).json(item)
  } catch (error) {
    res.status(500).json({ message: "Failed to create repair order item" })
  }
})

RepairOrderItemsRoute.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const item = await RepairOrderItemsService.edit(id, req.body)

    res.json(item)
  } catch (error) {
    res.status(500).json({ message: "Failed to update repair order item" })
  }
})

RepairOrderItemsRoute.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const result = await RepairOrderItemsService.delete(id)

    res.json(result)
  } catch (error) {
    res.status(500).json({ message: "Failed to delete repair order item" })
  }
})

export default RepairOrderItemsRoute