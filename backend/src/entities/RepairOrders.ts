import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Invoices } from "./Invoices";
import { Appointments } from "./Appointments";
import { Customers } from "./Customers";
import { Users } from "./Users";
import { Vehicles } from "./Vehicles";
import type { Relation } from "typeorm";
import { Services } from "./Services";

export enum RepairOrderStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS", 
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

@Index("appointment_id", ["appointmentId"], { unique: true })
@Index("idx_repair_orders_appointment_id", ["appointmentId"], {})
@Index("idx_repair_orders_customer_id", ["customerId"], {})
@Index("idx_repair_orders_mechanic_id", ["mechanicId"], {})
@Index("idx_repair_orders_status", ["status"], {})
@Index("idx_repair_orders_vehicle_id", ["vehicleId"], {})
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
    enum: RepairOrderStatus,
    default: RepairOrderStatus.OPEN,
  })
  status!: RepairOrderStatus;

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

  @OneToOne(() => Invoices, (invoices) => invoices.repairOrder)
  invoices: Invoices;

  @OneToOne(() => Appointments, (appointments) => appointments.repairOrders, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "appointment_id", referencedColumnName: "id" }])
  appointment: Relation<Appointments>;

  @ManyToOne(() => Customers, (customers) => customers.repairOrders, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "customer_id", referencedColumnName: "id" }])
  customer: Relation<Customers>;

  @ManyToOne(() => Users, (users) => users.repairOrders, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "mechanic_id", referencedColumnName: "id" }])
  mechanic: Relation<Users>;

  @ManyToOne(() => Vehicles, (vehicles) => vehicles.repairOrders, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "vehicle_id", referencedColumnName: "id" }])
  vehicle: Vehicles;

  @OneToMany(() => Services, (services) => services.repairOrder)
  services: Relation<Services>[];
}
