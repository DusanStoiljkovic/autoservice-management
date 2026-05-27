import { In } from "typeorm"
import { AppDataSource } from "../config/db"
import { Appointments, AppointmentStatus } from "../entities/Appointments"
import type { CreateAppointmentDto } from "../dto/AppointmentsDto"

export class AppointmentService {
  private static get repo() {
    return AppDataSource.getRepository(Appointments)
  }

  static async getAll(query: any) {
    const queryBuilder = this.repo.createQueryBuilder("appointment")
    if (query.status) {
      queryBuilder.andWhere("appointment.status = :status", { status: query.status })
    }
    if (query.dateFrom) {
      queryBuilder.andWhere("appointment.scheduledAt >= :dateFrom", { dateFrom: query.dateFrom })
    }
    if (query.dateTo) {
      queryBuilder.andWhere("appointment.scheduledAt <= :dateTo", { dateTo: query.dateTo })
    }
    if (query.customerId) {
      queryBuilder.andWhere("appointment.customerId = :customerId", { customerId: query.customerId})
    }
    if (query.vehicleId) {
      queryBuilder.andWhere("appointment.vehicleId = :vehicleId", { vehicleId: query.vehicleId })
    }

    return await queryBuilder.getMany()
  }

  static async getById(id: number) {
    const appointment = await this.repo.findOne({
      where: { id },
      relations: {
        repairOrders: true,
      },
    })

    if (!appointment) {
      throw new Error(`Appointment with id ${id} was not found.`)
    }

    return appointment
  }

  static async getByCustomerId(customerId: number) {
    return await this.repo.find({
      where: {
        customerId,
      },
      relations: {
        repairOrders: true,
      },
      order: {
        scheduledAt: "ASC",
      },
    })
  }

  static async create(dto: CreateAppointmentDto) {
    const scheduledAt = new Date(dto.scheduledAt)

    if (Number.isNaN(scheduledAt.getTime())) {
      throw new Error("Invalid appointment date.")
    }

    const existingAppointment = await this.repo.findOne({
      where: {
        scheduledAt,
        status: In([
          AppointmentStatus.SCHEDULED,
          AppointmentStatus.CONFIRMED,
        ]),
      },
    })

    if (existingAppointment) {
      throw new Error("Appointment term is already taken.")
    }

    const appointment = this.repo.create({
      customerId: dto.customerId,
      vehicleId: dto.vehicleId,
      scheduledAt,
      status: AppointmentStatus.SCHEDULED,
      description: dto.problemDescription ?? dto.description ?? "",
    })

    return await this.repo.save(appointment)
  }

  static async edit(id: number, appointmentData: Partial<Appointments>) {
    const appointment = await this.getById(id)

    Object.assign(appointment, appointmentData)

    return await this.repo.save(appointment)
  }

  static async changeStatus(id: number, status: AppointmentStatus) {
    const appointment = await this.getById(id)

    appointment.status = status

    return await this.repo.save(appointment)
  }

  static async delete(id: number) {
    const appointment = await this.getById(id)

    await this.repo.remove(appointment)

    return {
      message: `Appointment with id ${id} was deleted successfully.`,
    }
  }
}