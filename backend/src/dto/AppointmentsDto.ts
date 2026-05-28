export interface CreateAppointmentDto {
  customerId: number
  vehicleId: number
  scheduledAt: string
  problemDescription?: string
  description?: string
  customerNote?: string | null
  serviceType?: string
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
