import { request, response, Router } from "express"
import { defineRequest } from "../utils"
import { ServicesService } from "../services/services.service"

const ServiceRoute = Router()

ServiceRoute.get('/all', async (request, response) => {
    await defineRequest(response, async () => {
        return await ServicesService.getAll()
    })
})

ServiceRoute.get('/:id', async (request, response) => {
    const id = Number(request.params.id)
    await defineRequest(response, async () => {
        return await ServicesService.getById(id)
    })
})

ServiceRoute.post('/create', async (request, response) => {
    await defineRequest(response, async () => {
        return await ServicesService.create(request.body)
    })
})

ServiceRoute.patch('/:id', async (request, response) => {
    const id = Number(request.params.id)
    await defineRequest(response, async () => {
        return await ServicesService.edit(id, request.body)
    })
})

ServiceRoute.delete('/:id', async (request, response) => {
    const id = Number(request.params.id)
    await defineRequest(response, async () => {
        return await ServicesService.delete(id)
    })
})

export default ServiceRoute