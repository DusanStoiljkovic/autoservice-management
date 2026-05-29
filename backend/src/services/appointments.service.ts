import { In } from "typeorm"
import { AppDataSource } from "../config/db"
import { Appointments, AppointmentStatus } from "../entities/Appointments"
import type { CreateAppointmentDto } from "../dto/AppointmentsDto"
import { RepairOrders, RepairOrderStatus } from "../entities/RepairOrders"

export class AppointmentService {
  private static get repo() {
    return AppDataSource.getRepository(Appointments)
  }

  static async getAll(query: any) {
    const queryBuilder = this.repo.createQueryBuilder("appointment")
      .leftJoinAndSelect("appointment.customer", "customer")
      .leftJoinAndSelect("appointment.vehicle", "vehicle")
      .leftJoinAndSelect("appointment.services", "services")
      .leftJoinAndSelect("appointment.repairOrders", "repairOrders")

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

    queryBuilder.orderBy("appointment.scheduledAt", "DESC")

    return await queryBuilder.getMany()
  }

  static async getById(id: number) {
    const appointment = await this.repo.findOne({
      where: { id },
      relations: {
        repairOrders: true,
        customer: true,
        vehicle: true,
        services: true,
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

    if (!dto.serviceIds || dto.serviceIds.length === 0) {
      throw new Error("At least one service must be selected.")
    }

    const services = await AppDataSource.getRepository("Service").findBy(
      {
        id: In(dto.serviceIds),
      }
    )

    if (services.length !== dto.serviceIds.length) {
      throw new Error("One or more selected services are invalid.")
    }

    const appointment = this.repo.create({
      customerId: dto.customerId,
      vehicleId: dto.vehicleId,
      scheduledAt,
      status: AppointmentStatus.SCHEDULED,
      description: dto.problemDescription ?? dto.description ?? "",
      services,
    })

    return await this.repo.save(appointment)
  }

  static async edit(id: number, appointmentData: Partial<Appointments>) {
    const appointment = await this.getById(id)

    Object.assign(appointment, appointmentData)

    return await this.repo.save(appointment)
  }

  static async changeStatus(id: number, status: AppointmentStatus) {
    return await AppDataSource.manager.transaction(async (manager) => {
      const appointment = await manager.findOne(Appointments, {
        where: { id },
        relations: { customer: true, vehicle: true, services: true },
      })

      if (!appointment) {
        throw new Error(`Appointment with id ${id} was not found.`)
      }

      appointment.status = status

      const existingOrder = await manager.findOne(RepairOrders, {
        where: { appointmentId: appointment.id },
      })

      if (status === AppointmentStatus.CONFIRMED && !existingOrder) {
        const repairOrder = manager.create(RepairOrders, {
          customerId: appointment.customerId,
          vehicleId: appointment.vehicleId,
          appointmentId: appointment.id,
          mechanicId: null,
          status: RepairOrderStatus.IN_PROGRESS,
          problemDescription: appointment.description ?? "",
          diagnosis: null,
          startedAt: new Date(),
          completedAt: null,
        })

        await manager.save(repairOrder)
      }

      if (status === AppointmentStatus.CANCELLED && existingOrder) {
        existingOrder.status = RepairOrderStatus.CANCELLED
        existingOrder.completedAt = new Date()
        await manager.save(existingOrder)
      }

      return await manager.save(appointment)
    })
  }

  static async delete(id: number) {
    const appointment = await this.getById(id)

    await this.repo.remove(appointment)

    return {
      message: `Appointment with id ${id} was deleted successfully.`,
    }
  }
}