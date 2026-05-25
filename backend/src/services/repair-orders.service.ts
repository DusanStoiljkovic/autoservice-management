import { AppDataSource } from "../config/db"
import { RepairOrders } from "../entities/RepairOrders"

const repo = AppDataSource.getRepository(RepairOrders)

export class OrderService {
  static async getAll() {
    return await repo.find({
      order: {
        id: "ASC",
      },
    })
  }

  static async getById(id: number) {
    const order = await repo.findOne({
      where: { id },
    })

    if (!order) {
      throw new Error(`Order with id ${id} was not found.`)
    }

    return order
  }

  static async create(orderData: Partial<RepairOrders>) {
    const order = repo.create(orderData)

    return await repo.save(order)
  }

  static async edit(id: number, orderData: Partial<RepairOrders>) {
    const order = await this.getById(id)

    Object.assign(order, orderData)

    return await repo.save(order)
  }

  static async delete(id: number) {
    const order = await this.getById(id)

    await repo.remove(order)

    return {
      message: `Order with id ${id} was deleted successfully.`,
    }
  }
}