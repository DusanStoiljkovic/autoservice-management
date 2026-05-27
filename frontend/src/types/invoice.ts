export interface Invoice {
    id: number
    repairOrderId: number
    invoiceNumber: string
    status: InvoiceStatus
    subtotal: string
    taxRate: string
    taxAmount: string
    total: string
    issuedAt: string
    paidAt: string
    createdAt: string
    updatedAt: string
}

export enum InvoiceStatus {
    PAID = 'PAID',
    UNPAID = 'UNPAID',
    CANCELLED = 'CANCELLED'
}