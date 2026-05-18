import { AppDataSource } from "../../config/db"
import { Users } from "../../entities/Users"

const userRepository = AppDataSource.getRepository(Users)

function removePassword(user: Users) {
    const { passwordHash, ...safeUser } = user
    return safeUser
}

export class UserService {
    static async getAllUsers() {
        const users = await userRepository.find({
            order: {
                createdAt: "DESC",
            },
        })
        
        return users.map(removePassword)
    }
}