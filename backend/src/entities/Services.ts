import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import type { Relation } from "typeorm";
import { RepairOrders } from "./RepairOrders";

@Index("idx_services_is_active", ["isActive"], {})
@Entity("services", { schema: "auto_service_management" })
export class Services {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 150 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("decimal", {
    name: "price",
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  price: string;

  @Column("int", { name: "estimated_duration_minutes", nullable: true })
  estimatedDurationMinutes: number | null;

  @Column("tinyint", { name: "is_active", width: 1, default: () => "'1'" })
  isActive: boolean;

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

  @ManyToMany(() => RepairOrders, (repairOrder) => repairOrder.services)
  repairOrders: Relation<RepairOrders[]>;
}