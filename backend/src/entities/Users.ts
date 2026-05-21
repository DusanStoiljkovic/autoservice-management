import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn
} from "typeorm";
import { RepairOrders } from "./RepairOrders";

export enum UsersRole {
  ADMIN = "ADMIN",
  MAGANER = "MANAGER",
  MECHANIC = "MECHANIC",
  RECEPTIONIST = "RECEPTIONIST"
}

@Index("email", ["email"], { unique: true })
@Index("idx_users_is_active", ["isActive"], {})
@Index("idx_users_role", ["role"], {})
@Entity("users", { schema: "auto_service_management" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "first_name", length: 100 })
  firstName: string;

  @Column("varchar", { name: "last_name", length: 100 })
  lastName: string;

  @Column("varchar", { name: "email", unique: true, length: 150 })
  email: string;

  @Column("varchar", { name: "password_hash", length: 255 })
  passwordHash: string;

  @Column("int",{ name: "email_code"})
  emailCode: number

  @Column("enum", {
    name: "role",
    enum: UsersRole,
    default: UsersRole.RECEPTIONIST,
  })
  role!: UsersRole;

  @Column("tinyint", { name: "is_active", width: 1, default: () => "'1'" })
  isActive: boolean;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    name: "updated_at",
    type: "datetime",
    nullable: true,
  })
  updatedAt: Date;

  @Column({
    name: "verified_at",
    type: "datetime",
    nullable: true,
  })
  verifiedAt: Date;

  @DeleteDateColumn({
    name: "deleted_at",
    type: "datetime",
    nullable: true,
  })
  deletedAt: Date | null;

  @OneToMany(() => RepairOrders, (repairOrders) => repairOrders.mechanic)
  repairOrders: RepairOrders[];
}
