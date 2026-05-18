import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { DataSource } from 'typeorm'
import { Users } from './entities/Users'
import { Customers } from './entities/Customers'
import { Appointments } from './entities/Appointments'
import { RepairOrders } from './entities/RepairOrders'
import { Services } from './entities/Services'
import { Vehicles } from './entities/Vehicles'
import axios from 'axios'
import "reflect-metadata"
import { RepairOrderItems } from './entities/RepairOrderItems'
import { Invoices } from './entities/Invoices'

const app = express()
app.use(cors())
app.use(morgan('combined'))

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "auto_service_management",
    synchronize: true,
    logging: true,
    entities: [Invoices, Users, Customers, Appointments, RepairOrders, Services, Vehicles, RepairOrderItems],
    subscribers: [],
    migrations: [],
})

app.get('/', async (req, res) => {
    
})

AppDataSource.initialize().then(() => {
    console.log('Connected to database')
    app.listen(3300, () => {
        console.log("Application started")
    })
}) 