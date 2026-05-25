import { Router, Request, Response } from "express"
import { InvoiceService } from "../services/invoices.service"

const InvoiceRoute = Router()

InvoiceRoute.get("/all", async (req: Request, res: Response) => {
  try {
    const invoices = await InvoiceService.getAll()

    res.json(invoices)
  } catch (error) {
    res.status(500).json({ message: "Failed to get invoices" })
  }
})

InvoiceRoute.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const invoice = await InvoiceService.getById(id)

    res.json(invoice)
  } catch (error) {
    res.status(404).json({ message: "Invoice not found" })
  }
})

InvoiceRoute.post("/", async (req: Request, res: Response) => {
  try {
    const invoice = await InvoiceService.create(req.body)

    res.status(201).json(invoice)
  } catch (error) {
    res.status(500).json({ message: "Failed to create invoice" })
  }
})

InvoiceRoute.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const invoice = await InvoiceService.edit(id, req.body)

    res.json(invoice)
  } catch (error) {
    res.status(500).json({ message: "Failed to update invoice" })
  }
})

InvoiceRoute.put("/:id/pay", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const invoice = await InvoiceService.markAsPaid(id)

    res.json(invoice)
  } catch (error) {
    res.status(500).json({ message: "Failed to mark invoice as paid" })
  }
})

InvoiceRoute.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const result = await InvoiceService.delete(id)

    res.json(result)
  } catch (error) {
    res.status(500).json({ message: "Failed to delete invoice" })
  }
})

export default InvoiceRoute