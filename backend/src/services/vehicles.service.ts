import axios from "axios";
import { Vehicles } from "../entities/Vehicles";
import { AppDataSource } from "../config/db";

const client = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    headers: {
        'Accept': "application/json",
        'X-Name': 'PSEP_2026'
    },
    validateStatus: (status) => {
        return status == 200
    }
})

const repo = AppDataSource.getRepository(Vehicles)

export class VehicleService {
    static async getBrands() {
        const brands = await client.request({
            url: '/brands',
            method: 'GET',
        }) 
        return brands.data
    }

    static async getModels(brand: string) {
        const models = await client.request({
            url: `/brands/${brand}/models`,
            method: 'GET'
        })

        return models.data
    }

    static async getAll() {
        return await repo.find()
    }

    static async create(vehicle: Vehicles) {
        return await repo.save(vehicle)
    }
}