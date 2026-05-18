import { AppDataSource } from "../../config/db";
import { Appointments } from "../../entities/Appointments";


const appointmentRepository = AppDataSource.getRepository(Appointments)

export class AppointmentService {
    static async getAll() {
        const appointments = await appointmentRepository.find({
          select: {
            customer: true,
            repairOrders: true,
          },
          relations: {
            repairOrders: true
          }
        })
        return appointments
    }
}