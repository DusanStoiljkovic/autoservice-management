import { Router } from "express"
import { defineRequest } from "../utils"
import { CustomerService } from "../services/customers.service"

const CustomerRoute = Router()


CustomerRoute.get('/all', async (req, res) => {
    await defineRequest(res, async () => {
        return await CustomerService.getAll()
    })
})

CustomerRoute.post('/create', async (req, res) => {
    await defineRequest(res, async () => {
        return await CustomerService.create(req.body)
    })
})

export default CustomerRoute