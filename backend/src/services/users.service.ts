import { IsNull, Not } from "typeorm"
import { AppDataSource } from "../config/db"
import { Users } from "../entities/Users"
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"
import { generateVerificationCode } from "../utils"
import { access } from "node:fs"
import { Timestamp } from "typeorm/browser"
import type {Response, Request} from 'express'
import { MailService } from "./mail.service"

const repo = AppDataSource.getRepository(Users)
const JWT_SECRET = process.env.JWT_SECRET ?? ''

export class UserService {
    static async createAccount(obj: any) {
        if (await repo.existsBy({email: obj.email}))
            throw Error('USER_EXISTS')

        const hashed = bcrypt.hashSync(obj.password, 12)
        const code = generateVerificationCode()

        MailService.send(obj.email, 'Email verification code', 
            `<h3>Hi &{obj.firstName}, welcome to our app!</h3>
            <p>Your verification code is: <strong>${code}</strong></p> 
            `
        )

        await repo.save({
            firstName: obj.firstName,
            lastName: obj.lastName,
            email: obj.email,
            passwordHash: hashed,
            emailCode: code,
            createdAt: new Date(),
        })
    }

    static async verifyAccount(code: number) {
        const acc = await repo.findOneBy({
            emailCode: code,
            deletedAt: IsNull(),
            verifiedAt: IsNull(),
        })

        if (acc == null) {
            throw new Error('NOT_FOUND')
        }

        acc.verifiedAt = new Date()
        await repo.save(acc)
    }

    static async login(obj: any) {
        const user = await this.getUserByEmail(obj.email)

        if(!bcrypt.compare(obj.passwordHash, user.passwordHash)) {
            throw new Error('USER_NOT_FOUND')
        }

        return {
            access: jwt.sign({email: user.email}, JWT_SECRET, {expiresIn: '15s'}),
            refresh: jwt.sign({email: user.email}, JWT_SECRET, {expiresIn: '3d'}),
            email: user.email
        }
    }

    static async refreshToken(token: string) {
        const decoded: any = jwt.verify(token, JWT_SECRET)
        const user = await this.getUserByEmail(decoded.email)

        return {
            access: jwt.sign({email: user.email}, JWT_SECRET, {expiresIn: '15s'}),
            refresh: token,
            email: user.email       
        }
    }

    static async validateToken(req: any, res: Response, next: Function) {
        const whitelisted = [
            '/api/user/login',
            '/api/user/refresh',
            '/api/user/signup',
            '/api/user/verify',
            '/api/movie',
        ]

        if (whitelisted.find(w => req.path.startsWith(w))) {
            next()
            return
        }

        const auth = req.headers['authorization']
        const token = auth && auth.split[' '][1]

        if (token == undefined) {
            res.status(401).json({
                message: 'NO_TOKEN_FOUND',
                timestamp: new Date(),
            })
            return
        }

        jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
            if (err) {
                res.status(403).json({
                    message: 'INVALID_TOKEN',
                    timestamp: new Date(),
                })
                return
            }
            req.user = user
            next()
        })
    }

    static async getUserByEmail(email: string) {
        const user = await repo.findOneBy({email: email, verifiedAt: Not(IsNull()), deletedAt: IsNull()})

        if(user == null) {
            throw new Error('USER_NOT_FOUND')
        }

        return user
    }

    static async getUserProfile(email: string) {
        return await repo.findOneOrFail({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                repairOrders: {
                   id: true,
                   vehicle: {
                    make: true,
                    model: true,
                   },
                   appointment: {
                    scheduledAt: true,
                   },
                   mechanic: {
                    firstName: true,
                    lastName: true,
                   },
                   status: true,
                   problemDescription: true,
                   diagnosis: true,
                }
            },
            where: {
                email,
                deletedAt: IsNull(),
            },
            relations: {
                repairOrders: {
                    repairOrderItems: true
                }
            }
        })
    }

    static async getUsers() {
        return await repo.find()
    }

}