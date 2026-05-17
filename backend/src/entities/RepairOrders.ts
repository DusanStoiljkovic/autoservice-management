import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointments } from "./Appointments";
import { Customers } from "./Customers";
import { Users } from "./Users";
import { Vehicles } from "./Vehicles";

@Index("appointment_id", ["appointmentId"], { unique: true })
@Index("fk_repair_orders_customer", ["customerId"], {})
@Index("fk_repair_orders_mechanic", ["mechanicId"], {})
@Index("fk_repair_orders_vehicle", ["vehicleId"], {})
@Entity("repair_orders", { schema: "auto_service_management" })
export class RepairOrders {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "customer_id" })
  customerId: number;

  @Column("int", { name: "vehicle_id" })
  vehicleId: number;

  @Column("int", { name: "appointment_id", nullable: true, unique: true })
  appointmentId: number | null;

  @Column("int", { name: "mechanic_id", nullable: true })
  mechanicId: number | null;

  @Column("enum", {
    name: "status",
    enum: ["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
    default: () => "'OPEN'",
  })
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

  @Column("text", { name: "problem_description" })
  problemDescription: string;

  @Column("text", { name: "diagnosis", nullable: true })
  diagnosis: string | null;

  @Column("datetime", { name: "started_at", nullable: true })
  startedAt: Date | null;

  @Column("datetime", { name: "completed_at", nullable: true })
  completedAt: Date | null;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", {
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @OneToOne(() => Appointments, (appointments) => appointments.repairOrders, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "appointment_id", referencedColumnName: "id" }])
  appointment: Appointments;

  @ManyToOne(() => Customers, (customers) => customers.repairOrders, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "customer_id", referencedColumnName: "id" }])
  customer: Customers;

  @ManyToOne(() => Users, (users) => users.repairOrders, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "mechanic_id", referencedColumnName: "id" }])
  mechanic: Users;

  @ManyToOne(() => Vehicles, (vehicles) => vehicles.repairOrders, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "vehicle_id", referencedColumnName: "id" }])
  vehicle: Vehicles;
}
