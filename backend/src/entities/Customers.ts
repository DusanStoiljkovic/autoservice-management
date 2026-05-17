import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Appointments } from "./Appointments";
import { RepairOrders } from "./RepairOrders";
import { Vehicles } from "./Vehicles";

@Entity("customers", { schema: "auto_service_management" })
export class Customers {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "first_name", length: 255 })
  firstName: string;

  @Column("varchar", { name: "last_name", length: 255 })
  lastName: string;

  @Column("varchar", { name: "phone", length: 30 })
  phone: string;

  @Column("varchar", { name: "email", nullable: true, length: 150 })
  email: string | null;

  @Column("varchar", { name: "address", nullable: true, length: 255 })
  address: string | null;

  @Column("text", { name: "notes", nullable: true })
  notes: string | null;

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

  @OneToMany(() => Appointments, (appointments) => appointments.customer)
  appointments: Appointments[];

  @OneToMany(() => RepairOrders, (repairOrders) => repairOrders.customer)
  repairOrders: RepairOrders[];

  @OneToMany(() => Vehicles, (vehicles) => vehicles.customer)
  vehicles: Vehicles[];
}
