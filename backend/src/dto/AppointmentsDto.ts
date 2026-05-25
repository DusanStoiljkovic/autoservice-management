export type CreateAppointmentDto = {
  customerId: number
  vehicleId: number
  scheduledAt: string
  problemDescription?: string
  description?: string
  customerNote?: string | null
  serviceType?: string
}
