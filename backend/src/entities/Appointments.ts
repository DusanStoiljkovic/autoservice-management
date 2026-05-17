import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Customers } from "./Customers";
import { Vehicles } from "./Vehicles";
import { RepairOrders } from "./RepairOrders";

@Index("fk_appointments_customer", ["customerId"], {})
@Index("fk_appointments_vehicle", ["vehicleId"], {})
@Entity("appointments", { schema: "auto_service_management" })
export class Appointments {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "customer_id" })
  customerId: number;

  @Column("int", { name: "vehicle_id" })
  vehicleId: number;

  @Column("datetime", { name: "scheduled_at" })
  scheduledAt: Date;

  @Column("enum", {
    name: "status",
    enum: ["SCHEDULED", "CONFIRMED", "CANCELLED", "COMPLETED"],
    default: () => "'SCHEDULED'",
  })
  status: "SCHEDULED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

  @Column("text", { name: "description", nullable: true })
  description: string | null;

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

  @ManyToOne(() => Customers, (customers) => customers.appointments, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "customer_id", referencedColumnName: "id" }])
  customer: Customers;

  @ManyToOne(() => Vehicles, (vehicles) => vehicles.appointments, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "vehicle_id", referencedColumnName: "id" }])
  vehicle: Vehicles;

  @OneToOne(() => RepairOrders, (repairOrders) => repairOrders.appointment)
  repairOrders: RepairOrders;
}
