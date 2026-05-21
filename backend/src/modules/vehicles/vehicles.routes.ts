import { Router } from "express"
import { UserController } from "../users/users.controller"
import { VehicleController } from "./vehicles.controller"

const router = Router()

router.get('/brands', VehicleController.getAllBrands)
router.get('/brands/:brand/models', VehicleController.getAllModels)

export default router