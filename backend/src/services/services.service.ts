import { AppDataSource } from "../config/db";
import { Services } from "../entities/Services";

const repo = AppDataSource.getRepository(Services)

export class ServicesService {
    private static get repo() {
        return AppDataSource.getRepository(Services)
    }

  static async getAll() {
    return await this.repo.find({
        order: {
            id: "ASC",
        }
    })
  }

  static async getById(id: number) {
    if(!id || Number.isNaN(id)) {
        throw new Error("Service id is required.")
    }

    const service = await this.repo.findOne({
        where: { id }
    })

    if (!service) {
        throw new Error(`Service with id ${id} was not found.`)
    }

    return service
  }

  static async create(serviceData: Partial<Services>) {
    const service = this.repo.create(serviceData)

    return await this.repo.save(service)
  }

  static async edit(id: number, serviceData: Partial<Services>) {
    const service = await this.getById(id)

    Object.assign(service, serviceData)

    return await this.repo.save(service)
  }

  static async delete(id: number): Promise<{ message: string}> {
    const service = await this.getById(id)

    await this.repo.remove(service)

    return {
        message: `Service with id ${id} was deleted successfully.`,
    }
  } 


}