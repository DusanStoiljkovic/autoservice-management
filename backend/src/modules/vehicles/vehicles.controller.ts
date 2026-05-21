import type {Request, Response} from 'express'
import { VehicleService } from './vehicles.service'
import { parseParam, writeJSON } from '../../utils'

export class VehicleController {
    static async getAllBrands(req: Request, res: Response) {
        await writeJSON(res, VehicleService.getBrands)
    }

    static async getAllModels(req: Request, res: Response) {
        const brand = parseParam(req, "brand")
        console.log("brand: ", brand)
        return writeJSON(res, () => VehicleService.getModels(String(brand)))
    }
}