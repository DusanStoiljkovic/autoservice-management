import { AppDataSource } from "../config/db"
import { Customers } from "../entities/Customers"

export class CustomerService {
  private static get repo() {
    return AppDataSource.getRepository(Customers)
  }

  static async getAll() {
    return await this.repo.find({
      order: {
        id: "ASC",
      },
    })
  }

  static async getById(id: number) {
    const customer = await this.repo.findOne({
      where: { id },
    })

    if (!customer) {
      throw new Error(`Customer with id ${id} was not found.`)
    }

    return customer
  }

  static async create(customerData: Partial<Customers>) {
    const customer = this.repo.create(customerData)

    return await this.repo.save(customer)
  }

  static async edit(id: number, customerData: Partial<Customers>) {
    const customer = await this.getById(id)

    Object.assign(customer, customerData)

    return await this.repo.save(customer)
  }

  static async delete(id: number) {
    const customer = await this.getById(id)

    await this.repo.remove(customer)

    return {
      message: `Customer with id ${id} was deleted successfully.`,
    }
  }
}