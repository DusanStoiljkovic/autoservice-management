import type { Service } from './services'

export interface RepairOrder {
    id: number
    customerId: number
    vehicleId: number
    appointmentId: number
    mechanicId: number
    status: RepairOrderStatus
    problemDescription: string | null
    services: Service[]
    diagnosis: string
    startedAt: string
    completedAt: string
    createdAt: string
    updatedAt: string
}

export enum RepairOrderStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}