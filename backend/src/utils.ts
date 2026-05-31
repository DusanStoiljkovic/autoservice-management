import type { Response, Request } from "express"

export function generateVerificationCode() {
    const num = Math.floor(Math.random() * 100000)
    return Number(String(num).padStart(6, '0')) 
}

export async function defineRequest(res: Response, callback: Function) {
    try {
        const data = await callback()
        if (data == null) {
            res.status(204).send()
            return
        }
        res.json(data)
    } catch (error: any) {
        const code = error.message == 'NOT_FOUND' ? 404 : 500
        res.status(code).json({
            message: error.message ?? 'SERVER_ERROR',
            timestamp: new Date(),
        })
        console.log(error)
    }
}
