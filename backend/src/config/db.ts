
import { DataSource } from "typeorm";
import { Appointments } from "../entities/Appointments";
import { Customers } from "../entities/Customers";
import { Invoices } from "../entities/Invoices";
import { RepairOrders } from "../entities/RepairOrders";
import { Services } from "../entities/Services";
import { Users } from "../entities/Users";
import { Vehicles } from "../entities/Vehicles";
import { configDotenv } from "dotenv";

configDotenv()
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [Invoices, Users, Customers, Appointments, RepairOrders, Services, Vehicles],
    ssl: { rejectUnauthorized: false },
})