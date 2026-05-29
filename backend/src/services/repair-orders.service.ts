import { AnyBulkWriteOperation } from "typeorm/browser"
import { AppDataSource } from "../config/db"
import { RepairOrders } from "../entities/RepairOrders"

export class OrderService {
  private static get repo() {
    return AppDataSource.getRepository(RepairOrders)
  }

  static async getAll(query: any) {
    const queryBuilder = this.repo.createQueryBuilder("order")
      .leftJoinAndSelect("order.customer", "customer")
      .leftJoinAndSelect("order.vehicle", "vehicle")
      .leftJoinAndSelect("order.mechanic", "mechanic")

    if(query.status) {
      queryBuilder.andWhere("order.status = :status", { status: query.status})
    }
    if(query.appointmentId) {
      queryBuilder.andWhere("order.appointmentId = :appointmentId", { appointmentId: query.appointmentId })
    }

    return await queryBuilder.getMany()
  }

  static async getById(id: number) {
    const order = await this.repo.findOne({
      where: { id },
      relations: {
        customer: true,
        vehicle: true,
        mechanic: true,
      }
    })

    if (!order) {
      throw new Error(`Repair order with id ${id} was not found.`)
    }

    return order
  }

  static async create(orderData: Partial<RepairOrders>) {
    if(orderData.appointmentId) {
      const existingOrder = await this.repo.findOne({
        where: { appointmentId: orderData.appointmentId}
      })

      if(existingOrder) {
        throw new Error(`Repair order for appointment with id ${orderData.appointmentId} already exists.`)
      }
    }

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