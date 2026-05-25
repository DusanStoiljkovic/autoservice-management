import { Users, UsersRole } from "../entities/Users";
import jwt from 'jsonwebtoken'
import { IsNull } from "typeorm"
import bcrypt from 'bcrypt'
import { AppDataSource } from "../config/db";

const repo = AppDataSource.getRepository(Users)

const JWT_SECRET = process.env.JWT_SECRET || "superSecret"
const ACCESS_TOKEN_EXPIRES_IN = "30m"
const REFRESH_TOKEN_EXPIRES_IN = "7d"

export class AuthService {
    static generateToken(user: Users) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        }

        const accessToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN
        })

        const refreshToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN
        })

        return {
            accessToken,
            refreshToken
        }
    }

    static userResponse(user: Users) {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            }
        }


    static async register(data: any) {
        const existingUser = await repo.findOne({
            where: {
                email: data.email,
                deletedAt: IsNull()
            }
        })

        if (existingUser) {
            throw new Error("User with this email already existed")
        }

        const passwordHash = await bcrypt.hash(data.password, 10)

        const user = repo.create({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            passwordHash,
            emailCode: 0,
            role: data.role || UsersRole.RECEPTIONIST,
            verifiedAt: new Date(),
            updatedAt: new Date(),
        })

        const savedUser = await repo.save(user)
        const tokens = this.generateToken(savedUser)

        return {
            user: this.userResponse(savedUser),
            ...tokens
        }
    } 

    static async login(data: any) {
        const user = await repo.findOne({
            where: {
                email: data.email,
                deletedAt: IsNull(),
            },
        })

        if (!user) {
            throw new Error("Invalid email or password")
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash)

        if (!isPasswordValid) {
            throw new Error("Invalid email or password")
        }

        const tokens = this.generateToken(user)

        return {
            user: this.userResponse(user),
            ...tokens
        }

    }

    static async refresh(refreshToken: string) {
        const decoded = jwt.verify(refreshToken, JWT_SECRET) as any

        const user = await repo.findOne({
            where: {
                id: decoded.id,
                deletedAt: IsNull(),
            }
        })

        if(!user) {
            throw new Error("User not found.")
        }

        const tokens = this.generateToken(user)

        return {
            user: this.userResponse(user),
            ...tokens
        }
    }

    static async profile(userId: number) {
        const user = await repo.findOne({
            where: {
                id: userId,
                deletedAt: IsNull(),
            }
        })

        if(!user) {
            throw new Error("User not found.")
        }

        return this.userResponse(user)
    }

    static authenticate(req: any, res: any, next: any) {
        const authHeader = req.headers.authorization

        if(!authHeader) {
            return res.status(401).json({
                message: "Authorization header is missing."
            })
        }

        const token = authHeader.split(" ")[1]

        if(!token) {
            return res.status(401).json({
                message: "Access token is missing."
            })
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) 
            req.user = decoded
            next()
        } catch (error) {
            return res.status(403).json({
                message: "Invalid or expired token."
            })
        }
    }


}