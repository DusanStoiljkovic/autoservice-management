import { Router, Request, Response } from "express"
import { OrderService } from "../services/repair-orders.service"

const OrderRoute = Router()

OrderRoute.get("/all", async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.getAll(req.query)

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders" })
  }
})

OrderRoute.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const order = await OrderService.getById(id)

    res.json(order)
  } catch (error) {
    res.status(404).json({ message: "Order not found" })
  }
})

OrderRoute.post("/", async (req: Request, res: Response) => {
  try {
    const order = await OrderService.create(req.body)

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: "Failed to create order" })
  }
})

OrderRoute.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const order = await OrderService.edit(id, req.body)

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" })
  }
})

OrderRoute.patch("/:id", async (request: Request, response: Response) => {
  try {
    const id = Number(request.params.id)
    const order = await OrderService.editPartial(id, request.body)
    response.json(order)
  } catch (error) {
    response.status(500).json({ message: "Failed to update order" })
  }
})

OrderRoute.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const result = await OrderService.delete(id)

    res.json(result)
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order" })
  }
})

export default OrderRoute