import { AppDataSource } from "../config/db"
import { RepairOrderItems } from "../entities/RepairOrderItems"

export class RepairOrderItemsService {
  private static get repo() {
    return AppDataSource.getRepository(RepairOrderItems)
  }

  static async getAll() {
    return await this.repo.find({
      order: {
        id: "ASC",
      },
    })
  }

  static async getById(id: number) {
    const item = await this.repo.findOne({
      where: { id },
    })

    if (!item) {
      throw new Error(`Repair order item with id ${id} was not found.`)
    }

    return item
  }

  static async getByRepairOrderId(repairOrderId: number) {
    return await this.repo.find({
      where: {
        repairOrderId,
      },
      order: {
        id: "ASC",
      },
    })
  }

  static async create(itemData: Partial<RepairOrderItems>) {
    const item = this.repo.create(itemData)

    return await this.repo.save(item)
  }

  static async edit(id: number, itemData: Partial<RepairOrderItems>) {
    const item = await this.getById(id)

    Object.assign(item, itemData)

    return await this.repo.save(item)
  }

  static async delete(id: number) {
    const item = await this.getById(id)

    await this.repo.remove(item)

    return {
      message: `Repair order item with id ${id} was deleted successfully.`,
    }
  }
}