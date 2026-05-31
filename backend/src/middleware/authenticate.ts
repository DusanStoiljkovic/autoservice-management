import jwt from 'jsonwebtoken'

export function authenticate(req: any, res: any, next: any) {
    const header = req.headers['authorization']

    if(!header) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    if(!header.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    try {
        const token = header.split(' ')[1]
        const secret = process.env.JWT_SECRET
        if (!secret) {
            return res.status(500).json({message: 'Server JWT secret is not configured.'})
        }
        const payload = jwt.verify(token, secret)
        req.user = payload
        next()
    } catch {
        return res.status(401).json({message: 'Token nije validam ili je istekao.'})
    }
}