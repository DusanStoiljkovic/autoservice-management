export interface Customer {
    id: number,
    firstName: string,
    lastName: string,
    phone: string,
    email: string | null
    address: string | null
    notes: string | null
    createdAt: string
    updatedAt: string | null
    deletedAt: string | null
}

export interface CreateCustomer {
    firstName: string
    lastName: string
    phone: string
    email: string | null
    address: string | null 
    notes: string | null
}