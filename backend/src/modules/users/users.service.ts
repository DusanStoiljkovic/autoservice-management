import { IsNull } from "typeorm"
import { AppDataSource } from "../../config/db"
import { Users } from "../../entities/Users"
import axios from "axios"

const userRepository = AppDataSource.getRepository(Users)

export class UserService {
    static async getAllUsers() {
        const users = await userRepository.find({
            select: {
                firstName: true,
                lastName: true,
                email: true,
                repairOrders: true,
            },
        })

        return users
    }
}