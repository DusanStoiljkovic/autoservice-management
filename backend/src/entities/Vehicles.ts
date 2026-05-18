import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointments } from "./Appointments";
import { RepairOrders } from "./RepairOrders";
import { Customers } from "./Customers";
import type { Relation } from "typeorm";


@Index("idx_vehicles_customer_id", ["customerId"], {})
@Index("idx_vehicles_license_plate", ["licensePlate"], {})
@Index("license_plate", ["licensePlate"], { unique: true })
@Index("vin", ["vin"], { unique: true })
@Entity("vehicles", { schema: "auto_service_management" })
export class Vehicles {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "customer_id" })
  customerId: number;

  @Column("varchar", { name: "make", length: 100 })
  make: string;

  @Column("varchar", { name: "model", length: 100 })
  model: string;

  @Column("int", { name: "production_year", nullable: true })
  productionYear: number | null;

  @Column("varchar", {
    name: "license_plate",
    nullable: true,
    unique: true,
    length: 30,
  })
  licensePlate: string | null;

  @Column("varchar", { name: "vin", nullable: true, unique: true, length: 50 })
  vin: string | null;

  @Column("int", { name: "mileage", default: () => "'0'" })
  mileage: number;

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

  @OneToMany(() => Appointments, (appointments) => appointments.vehicle)
  appointments: Appointments[];

  @OneToMany(() => RepairOrders, (repairOrders) => repairOrders.vehicle)
  repairOrders: RepairOrders[];

  @ManyToOne(() => Customers, (customers) => customers.vehicles, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "customer_id", referencedColumnName: "id" }])
  customer: Relation<Customers>;
}
