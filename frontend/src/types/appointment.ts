export interface Appointment {
    id: number
    customerId: number
    vehicleId: number
    scheduledAt: string
    status: AppointmentStatus
    description: string
    createdAt: string
    updatedAt: string
    repairOrders: null
}

export enum AppointmentStatus {
    SCHEDULED = 'SCHEDULED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}