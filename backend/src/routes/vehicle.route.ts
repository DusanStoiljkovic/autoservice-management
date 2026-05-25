import { response, Router } from 'express'
import { request } from 'node:http'
import { defineRequest } from '../utils'
import { VehicleService } from '../services/vehicles.service'

export const VehicleRoute = Router()

VehicleRoute.get('/all', async (request, response) => {
    await defineRequest(response, async () => {
        return await VehicleService.getAll()
    })
})

VehicleRoute.post('/create', async (request, response) => {
    await defineRequest(response, async () => {
        return await VehicleService.create(request.body)
    })
})
