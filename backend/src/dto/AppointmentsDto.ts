export interface CreateAppointmentDto {
  customerId: number
  vehicleId: number
  scheduledAt: string
  problemDescription?: string
  description?: string
  serviceIds?: number[]
}

export interface AppointmentResponse {
  id: number
  scheduledAt: string
  status: string
  customerId: number
  vehicleId: number
  customer: {
    firstName: string
    lastName: string
  }
  vehicle: {
    make: string,
    model: string,
    licensePlate: string
  }
}
