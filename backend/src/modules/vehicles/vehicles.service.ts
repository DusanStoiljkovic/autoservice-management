import axios from "axios";

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
}