import axios from "axios"
import { AppDataSource } from "../config/db"
import { Vehicles } from "../entities/Vehicles"

const client = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    Accept: "application/json",
    "X-Name": "PSEP_2026",
  },
  validateStatus: (status) => {
    return status >= 200 && status < 300
  },
})

export class VehicleService {
  private static get repo() {
    return AppDataSource.getRepository(Vehicles)
  }

  static async getBrands() {
    const response = await client.get("/brands")

    return response.data
  }

  static async getModels(brand: string) {
    const response = await client.get(`/brands/${encodeURIComponent(brand)}/models`)

    return response.data
  }

  static async getAll() {
    return await this.repo.find({
      order: {
        id: "ASC",
      },
    })
  }

  static async getById(id: number) {
    const vehicle = await this.repo.findOne({
      where: { id },
    })

    if (!vehicle) {
      throw new Error(`Vehicle with id ${id} was not found.`)
    }

    return vehicle
  }

  static async create(vehicleData: Partial<Vehicles>) {
    const existingVehicle = await this.repo.findOne({
      where: [
        { make: vehicleData.make },
        { model: vehicleData.model },
        { licensePlate: vehicleData.licensePlate },
      ]
    })

    if (existingVehicle) {
      return existingVehicle
    }
    
    const vehicle = this.repo.create(vehicleData)

    return await this.repo.save(vehicle)
  }

  static async edit(id: number, vehicleData: Partial<Vehicles>) {
    const vehicle = await this.getById(id)

    Object.assign(vehicle, vehicleData)

    return await this.repo.save(vehicle)
  }

  static async delete(id: number) {
    const vehicle = await this.getById(id)

    await this.repo.remove(vehicle)

    return {
      message: `Vehicle with id ${id} was deleted successfully.`,
    }
  }
}