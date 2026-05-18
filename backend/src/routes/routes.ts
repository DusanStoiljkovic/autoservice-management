import { Router } from "express";

import usersRoutes from "../modules/users/users.routes";
// import authRoutes from "../modules/auth/auth.routes";
// import customersRoutes from "../modules/customers/customers.routes";
// import vehiclesRoutes from "../modules/vehicles/vehicles.routes";
// import appointmentsRoutes from "../modules/appointments/appointments.routes";
// import repairOrdersRoutes from "../modules/repair-orders/repair-orders.routes";
// import servicesRoutes from "../modules/services/services.routes";
// import invoicesRoutes from "../modules/invoices/invoices.routes";
// import dashboardRoutes from "../modules/dashboard/dashboard.routes";

const router = Router();

router.use("/users", usersRoutes);
// router.use("/auth", authRoutes);
// router.use("/customers", customersRoutes);
// router.use("/vehicles", vehiclesRoutes);
// router.use("/appointments", appointmentsRoutes);
// router.use("/repair-orders", repairOrdersRoutes);
// router.use("/services", servicesRoutes);
// router.use("/invoices", invoicesRoutes);
// router.use("/dashboard", dashboardRoutes);

export default router;