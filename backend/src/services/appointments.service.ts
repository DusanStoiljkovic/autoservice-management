import { In } from "typeorm"
import { AppDataSource } from "../config/db"
import { Appointments, AppointmentStatus } from "../entities/Appointments"
import type { CreateAppointmentDto } from "../dto/AppointmentsDto"
const repo = AppDataSource.getRepository(Appointments)


export class AppointmentService {
  static async getAll() {
    return await repo.find({
      select: {
        id: true,
        customerId: true,
        vehicleId: true,
        scheduledAt: true,
        status: true,
        description: true,
        repairOrders: {
          id: true,
          status: true,
          problemDescription: true,
          diagnosis: true,
          startedAt: true,
          completedAt: true,
        },
      },
      relations: {
        repairOrders: true,
      },
      order: {
        scheduledAt: "ASC",
      },
    })
  }

  static async getByCustomerId(customerId: number) {
    return await repo.find({
      select: {
        id: true,
        scheduledAt: true,
        status: true,
        description: true,
        repairOrders: {
          id: true,
          status: true,
          problemDescription: true,
          diagnosis: true,
          startedAt: true,
          completedAt: true,
        },
      },
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
      throw new Error("INVALID_APPOINTMENT_DATE")
    }

    const isTaken = await repo.exists({
      where: {
        scheduledAt,
        status: In(["SCHEDULED", "CONFIRMED"]),
      },
    })

    if (isTaken) {
      throw new Error("APPOINTMENT_ALREADY_TAKEN")
    }

    const appointment = repo.create({
      customerId: dto.customerId,
      vehicleId: dto.vehicleId,
      scheduledAt,
      status: AppointmentStatus.SCHEDULED,
      description: dto.problemDescription ?? dto.description ?? "",
    })

    return await repo.save(appointment)
  }
}