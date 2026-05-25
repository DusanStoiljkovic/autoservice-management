import bcrypt from "bcrypt"
import { IsNull } from "typeorm"

import { AppDataSource } from "../config/db"
import { Users, UsersRole } from "../entities/Users"

export class UserService {
  private static get repo() {
    return AppDataSource.getRepository(Users)
  }

  private static userResponse(user: Users) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      verifiedAt: user.verifiedAt,
    }
  }

  static async getAll() {
    const users = await this.repo.find({
      where: {
        deletedAt: IsNull(),
      },
      order: {
        id: "ASC",
      },
    })

    return users.map((user) => this.userResponse(user))
  }

  static async getById(id: number) {
    const user = await this.repo.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    })

    if (!user) {
      throw new Error(`User with id ${id} was not found.`)
    }

    return this.userResponse(user)
  }

  static async create(userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    role?: UsersRole
  }) {
    const existingUser = await this.repo.findOne({
      where: {
        email: userData.email,
        deletedAt: IsNull(),
      },
    })

    if (existingUser) {
      throw new Error("User with this email already exists.")
    }

    const passwordHash = await bcrypt.hash(userData.password, 10)

    const user = this.repo.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      passwordHash,
      emailCode: 0,
      role: userData.role || UsersRole.RECEPTIONIST,
      verifiedAt: new Date(),
      updatedAt: new Date(),
    })

    const savedUser = await this.repo.save(user)

    return this.userResponse(savedUser)
  }

  static async edit(
    id: number,
    userData: {
      firstName?: string
      lastName?: string
      email?: string
      password?: string
      role?: UsersRole
    },
  ) {
    const user = await this.repo.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    })

    if (!user) {
      throw new Error(`User with id ${id} was not found.`)
    }

    if (userData.email && userData.email !== user.email) {
      const existingUser = await this.repo.findOne({
        where: {
          email: userData.email,
          deletedAt: IsNull(),
        },
      })

      if (existingUser) {
        throw new Error("User with this email already exists.")
      }
    }

    if (userData.firstName !== undefined) {
      user.firstName = userData.firstName
    }

    if (userData.lastName !== undefined) {
      user.lastName = userData.lastName
    }

    if (userData.email !== undefined) {
      user.email = userData.email
    }

    if (userData.role !== undefined) {
      user.role = userData.role
    }

    if (userData.password !== undefined && userData.password.trim() !== "") {
      user.passwordHash = await bcrypt.hash(userData.password, 10)
    }

    user.updatedAt = new Date()

    const savedUser = await this.repo.save(user)

    return this.userResponse(savedUser)
  }

  static async delete(id: number) {
    const user = await this.repo.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    })

    if (!user) {
      throw new Error(`User with id ${id} was not found.`)
    }

    await this.repo.softRemove(user)

    return {
      message: `User with id ${id} was deleted successfully.`,
    }
  }
}