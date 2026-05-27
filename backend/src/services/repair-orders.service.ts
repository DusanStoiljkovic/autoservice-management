import { AppDataSource } from "../config/db"
import { RepairOrders } from "../entities/RepairOrders"

export class OrderService {
  private static get repo() {
    return AppDataSource.getRepository(RepairOrders)
  }

  static async getAll() {
    return await this.repo.find({
      select: {
        services: {
          name: true,
          price: true,
        },
      },
      order: {
        id: "ASC",
      },
      relations: {
        services: true,
      }
    })
  }

  static async getById(id: number) {
    const order = await this.repo.findOne({
      where: { id },
    })

    if (!order) {
      throw new Error(`Repair order with id ${id} was not found.`)
    }

    return order
  }

  static async create(orderData: Partial<RepairOrders>) {
    const order = this.repo.create(orderData)

    return await this.repo.save(order)
  }

  static async edit(id: number, orderData: Partial<RepairOrders>) {
    const order = await this.getById(id)

    Object.assign(order, orderData)

    return await this.repo.save(order)
  }

  static async delete(id: number) {
    const order = await this.getById(id)

    await this.repo.remove(order)

    return {
      message: `Repair order with id ${id} was deleted successfully.`,
    }
  }
}