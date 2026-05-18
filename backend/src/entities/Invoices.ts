import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RepairOrders } from "./RepairOrders";
import type { Relation } from "typeorm";

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  ISSUED = "ISSUED",
  PAID = "PAID",
  CANCELLED = "CANCELLED"
}

@Index("idx_invoices_invoice_number", ["invoiceNumber"], {})
@Index("idx_invoices_repair_order_id", ["repairOrderId"], {})
@Index("idx_invoices_status", ["status"], {})
@Index("invoice_number", ["invoiceNumber"], { unique: true })
@Index("repair_order_id", ["repairOrderId"], { unique: true })
@Entity("invoices", { schema: "auto_service_management" })
export class Invoices {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "repair_order_id", unique: true })
  repairOrderId: number;

  @Column("varchar", { name: "invoice_number", unique: true, length: 50 })
  invoiceNumber: string;

  @Column({
    type: "enum",
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status!: InvoiceStatus;

  @Column("decimal", {
    name: "subtotal",
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  subtotal: string;

  @Column("decimal", {
    name: "tax_rate",
    precision: 5,
    scale: 2,
    default: () => "'20.00'",
  })
  taxRate: string;

  @Column("decimal", {
    name: "tax_amount",
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  taxAmount: string;

  @Column("decimal", {
    name: "total",
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  total: string;

  @Column("datetime", { name: "issued_at", nullable: true })
  issuedAt: Date | null;

  @Column("datetime", { name: "paid_at", nullable: true })
  paidAt: Date | null;

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

  @OneToOne(() => RepairOrders, (repairOrders) => repairOrders.invoices, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "repair_order_id", referencedColumnName: "id" }])
  repairOrder: Relation<RepairOrders>;
}
