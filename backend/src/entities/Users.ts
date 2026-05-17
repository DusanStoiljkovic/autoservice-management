import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RepairOrders } from "./RepairOrders";

@Index("email_UNIQUE", ["email"], { unique: true })
@Entity("users", { schema: "auto_service_management" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "first_name", length: 45 })
  firstName: string;

  @Column("varchar", { name: "last_name", length: 45 })
  lastName: string;

  @Column("varchar", { name: "email", unique: true, length: 45 })
  email: string;

  @Column("varchar", { name: "password", length: 45 })
  password: string;

  @Column("int", { name: "email_code", nullable: true })
  emailCode: number | null;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "verified_at", nullable: true })
  verifiedAt: Date | null;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @Column("tinyint", { name: "is_active", nullable: true })
  isActive: number | null;

  @OneToMany(() => RepairOrders, (repairOrders) => repairOrders.mechanic)
  repairOrders: RepairOrders[];
}
