import { AppDataSource } from "../config/db"
import { Invoices, InvoiceStatus } from "../entities/Invoices"

const repo = AppDataSource.getRepository(Invoices)

export class InvoiceService {
  static async getAll() {
    return await repo.find({
      order: {
        id: "ASC",
      },
    })
  }

  static async getById(id: number) {
    const invoice = await repo.findOne({
      where: { id },
    })

    if (!invoice) {
      throw new Error(`Invoice with id ${id} was not found.`)
    }

    return invoice
  }

  static async create(invoiceData: Partial<Invoices>) {
    const invoice = repo.create(invoiceData)

    return await repo.save(invoice)
  }

  static async edit(id: number, invoiceData: Partial<Invoices>) {
    const invoice = await this.getById(id)

    Object.assign(invoice, invoiceData)

    return await repo.save(invoice)
  }

  static async markAsPaid(id: number) {
    const invoice = await this.getById(id)

    invoice.status = InvoiceStatus.PAID
    invoice.paidAt = new Date()

    return await repo.save(invoice)
  }

  static async delete(id: number) {
    const invoice = await this.getById(id)

    await repo.remove(invoice)

    return {
      message: `Invoice with id ${id} was deleted successfully.`,
    }
  }
}