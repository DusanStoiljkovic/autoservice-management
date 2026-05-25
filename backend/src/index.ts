import 'reflect-metadata'
import { AppDataSource } from './config/db'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { configDotenv } from 'dotenv'
import { UserRoute } from './routes/user.route'
import CustomerRoute from './routes/customers.routes'
import { VehicleRoute } from './routes/vehicle.route'
import { AppointmentRoute } from './routes/appointments.routes'
import ServiceRoute from './routes/services.routes'
import OrderRoute  from './routes/repair-orders.routes'
import InvoiceRoute from './routes/invoices.routes'

const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('combined'))

app.get('/api/health', (req, res) => {
  res.json({
    status: "OK",
    app: "Auto Service Management API",
    timestamp: new Date(),
  })
})

// app.use(UserService.validateToken)
// app.use('/api/auth, AuthRoute)
app.use('/api/users', UserRoute)
app.use('/api/customers', CustomerRoute)
app.use('/api/vehicles', VehicleRoute)
app.use('/api/appointments', AppointmentRoute)
app.use('/api/services', ServiceRoute)
app.use('/api/repair-orders', OrderRoute)
app.use('/api/invoices', InvoiceRoute)


configDotenv()
const port = Number(process.env.SERVER_PORT)
AppDataSource.initialize().then(() => {
    console.log("Database connected");

    app.listen(port, () => {
      console.log(`Server running on port: http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });