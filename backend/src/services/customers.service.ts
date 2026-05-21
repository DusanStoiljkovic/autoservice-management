import { AppDataSource } from "../config/db"
import { Customers } from "../entities/Customers"

const repo = AppDataSource.getRepository(Customers)

export class CustomerService {
    static async getAll() {
        return await repo.find()
    }

    static async create(customer: Customers) {
        return await repo.save(customer)
    }
}