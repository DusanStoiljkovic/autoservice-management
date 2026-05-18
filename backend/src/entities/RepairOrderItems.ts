import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RepairOrders } from "./RepairOrders";
import { Services } from "./Services";
import type { Relation } from "typeorm";


@Index("idx_repair_order_items_item_type", ["itemType"], {})
@Index("idx_repair_order_items_repair_order_id", ["repairOrderId"], {})
@Index("idx_repair_order_items_service_id", ["serviceId"], {})
@Entity("repair_order_items", { schema: "auto_service_management" })
export class RepairOrderItems {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "repair_order_id" })
  repairOrderId: number;

  @Column("int", { name: "service_id", nullable: true })
  serviceId: number | null;

  @Column("enum", { name: "item_type", enum: ["SERVICE", "PART", "CUSTOM"] })
  itemType: "SERVICE" | "PART" | "CUSTOM";

  @Column("varchar", { name: "description", length: 255 })
  description: string;

  @Column("int", { name: "quantity", default: () => "'1'" })
  quantity: number;

  @Column("decimal", {
    name: "unit_price",
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  unitPrice: string;

  @Column("decimal", {
    name: "total_price",
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  totalPrice: string;

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

  @ManyToOne(
    () => RepairOrders,
    (repairOrders) => repairOrders.repairOrderItems,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "repair_order_id", referencedColumnName: "id" }])
  repairOrder: Relation<RepairOrders>;

  @ManyToOne(() => Services, (services) => services.repairOrderItems, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "service_id", referencedColumnName: "id" }])
  service: Services;
}
