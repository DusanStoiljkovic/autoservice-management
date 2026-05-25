import 'reflect-metadata'
import bcrypt from 'bcrypt'

import { AppDataSource } from './config/db'

import { Users, UsersRole } from './entities/Users'
import { Customers } from './entities/Customers'
import { Vehicles } from './entities/Vehicles'
import { Services } from './entities/Services'
import { Appointments, AppointmentStatus } from './entities/Appointments'
import { RepairOrders, RepairOrderStatus } from './entities/RepairOrders'
import { RepairOrderItems } from './entities/RepairOrderItems'
import { Invoices, InvoiceStatus } from './entities/Invoices'

const SALT_ROUNDS = 10

async function resetDatabase() {
  const queryRunner = AppDataSource.createQueryRunner()

  await queryRunner.connect()

  try {
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0')

    await queryRunner.query('TRUNCATE TABLE invoices')
    await queryRunner.query('TRUNCATE TABLE repair_order_items')
    await queryRunner.query('TRUNCATE TABLE repair_orders')
    await queryRunner.query('TRUNCATE TABLE appointments')
    await queryRunner.query('TRUNCATE TABLE vehicles')
    await queryRunner.query('TRUNCATE TABLE customers')
    await queryRunner.query('TRUNCATE TABLE services')
    await queryRunner.query('TRUNCATE TABLE users')

    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1')
  } finally {
    await queryRunner.release()
  }
}

async function seed() {
  await AppDataSource.initialize()

  try {
    console.log('Connected to database')
    console.log('Resetting database...')

    await resetDatabase()

    const usersRepository = AppDataSource.getRepository(Users)
    const customersRepository = AppDataSource.getRepository(Customers)
    const vehiclesRepository = AppDataSource.getRepository(Vehicles)
    const servicesRepository = AppDataSource.getRepository(Services)
    const appointmentsRepository = AppDataSource.getRepository(Appointments)
    const repairOrdersRepository = AppDataSource.getRepository(RepairOrders)
    const repairOrderItemsRepository = AppDataSource.getRepository(RepairOrderItems)
    const invoicesRepository = AppDataSource.getRepository(Invoices)

    const defaultPasswordHash = await bcrypt.hash('Password123!', SALT_ROUNDS)

    console.log('Seeding users...')

    const users = await usersRepository.save([
      usersRepository.create({
        firstName: 'Admin',
        lastName: 'AutoServis',
        email: 'admin@autoservice.rs',
        passwordHash: defaultPasswordHash,
        emailCode: 111111,
        role: UsersRole.ADMIN,
        isActive: true,
        verifiedAt: new Date(),
        updatedAt: new Date(),
      }),
      usersRepository.create({
        firstName: 'Milan',
        lastName: 'Mehanicar',
        email: 'milan@autoservice.rs',
        passwordHash: defaultPasswordHash,
        emailCode: 222222,
        role: UsersRole.MECHANIC,
        isActive: true,
        verifiedAt: new Date(),
        updatedAt: new Date(),
      }),
      usersRepository.create({
        firstName: 'Jovana',
        lastName: 'Recepcija',
        email: 'jovana@autoservice.rs',
        passwordHash: defaultPasswordHash,
        emailCode: 333333,
        role: UsersRole.RECEPTIONIST,
        isActive: true,
        verifiedAt: new Date(),
        updatedAt: new Date(),
      }),
    ])

    const mechanic = users.find((user) => user.email === 'milan@autoservice.rs')

    if (!mechanic) {
      throw new Error('Mechanic user was not created.')
    }

    console.log('Seeding customers...')

    const customers = await customersRepository.save([
      customersRepository.create({
        firstName: 'Marko',
        lastName: 'Markovic',
        phone: '+38164111222',
        email: 'marko.markovic@example.com',
        address: 'Bulevar kralja Aleksandra 100, Beograd',
        notes: 'Redovna musterija. Preferira jutarnje termine.',
      }),
      customersRepository.create({
        firstName: 'Nikola',
        lastName: 'Nikolic',
        phone: '+38164222333',
        email: 'nikola.nikolic@example.com',
        address: 'Nemanjina 12, Beograd',
        notes: 'Potrebno obavestiti dan ranije.',
      }),
      customersRepository.create({
        firstName: 'Ana',
        lastName: 'Jovanovic',
        phone: '+38164333444',
        email: 'ana.jovanovic@example.com',
        address: 'Cara Dusana 45, Nis',
        notes: 'Novi klijent.',
      }),
    ])

    const [marko, nikola, ana] = customers

    if (!marko || !nikola || !ana) {
      throw new Error('Customers were not created.')
    }

    console.log('Seeding vehicles...')

    const vehicles = await vehiclesRepository.save([
      vehiclesRepository.create({
        customerId: marko.id,
        make: 'Volkswagen',
        model: 'Golf 7',
        productionYear: 2016,
        licensePlate: 'BG-123-AA',
        vin: 'WVWZZZAUZGW000001',
        mileage: 182000,
      }),
      vehiclesRepository.create({
        customerId: nikola.id,
        make: 'Audi',
        model: 'A4',
        productionYear: 2018,
        licensePlate: 'BG-456-BB',
        vin: 'WAUZZZF40JA000002',
        mileage: 136500,
      }),
      vehiclesRepository.create({
        customerId: ana.id,
        make: 'Toyota',
        model: 'Yaris',
        productionYear: 2020,
        licensePlate: 'NI-789-CC',
        vin: 'JTDBT923001000003',
        mileage: 64200,
      }),
    ])

    const [golf, audi, yaris] = vehicles

    if (!golf || !audi || !yaris) {
      throw new Error('Vehicles were not created.')
    }

    console.log('Seeding services...')

    const services = await servicesRepository.save([
      servicesRepository.create({
        name: 'Mali servis',
        description: 'Zamena ulja, filtera ulja, filtera vazduha i osnovna kontrola vozila.',
        price: '8500.00',
        estimatedDurationMinutes: 90,
        isActive: true,
      }),
      servicesRepository.create({
        name: 'Veliki servis',
        description: 'Zamena zupcastog kaisa, spanera, vodene pumpe i pratecih delova.',
        price: '42000.00',
        estimatedDurationMinutes: 360,
        isActive: true,
      }),
      servicesRepository.create({
        name: 'Dijagnostika',
        description: 'Racunarska dijagnostika vozila i citanje gresaka.',
        price: '3000.00',
        estimatedDurationMinutes: 45,
        isActive: true,
      }),
      servicesRepository.create({
        name: 'Zamena kocnica',
        description: 'Zamena diskova i plocica uz proveru kocionog sistema.',
        price: '18000.00',
        estimatedDurationMinutes: 120,
        isActive: true,
      }),
    ])

    const [minorService, majorService, diagnostics, brakes] = services

    if (!minorService || !majorService || !diagnostics || !brakes) {
      throw new Error('Services were not created.')
    }

    console.log('Seeding appointments...')

    const appointments = await appointmentsRepository.save([
      appointmentsRepository.create({
        customerId: marko.id,
        vehicleId: golf.id,
        scheduledAt: new Date('2026-06-03T09:00:00'),
        status: AppointmentStatus.CONFIRMED,
        description: 'Mali servis i provera klime.',
      }),
      appointmentsRepository.create({
        customerId: nikola.id,
        vehicleId: audi.id,
        scheduledAt: new Date('2026-06-04T11:30:00'),
        status: AppointmentStatus.SCHEDULED,
        description: 'Cuje se zvuk pri kocenju.',
      }),
      appointmentsRepository.create({
        customerId: ana.id,
        vehicleId: yaris.id,
        scheduledAt: new Date('2026-06-01T13:00:00'),
        status: AppointmentStatus.COMPLETED,
        description: 'Dijagnostika lampice check engine.',
      }),
    ])

    const [markoAppointment, nikolaAppointment, anaAppointment] = appointments

    if (!markoAppointment || !nikolaAppointment || !anaAppointment) {
      throw new Error('Appointments were not created.')
    }

    console.log('Seeding repair orders...')

    const repairOrders = await repairOrdersRepository.save([
      repairOrdersRepository.create({
        customerId: marko.id,
        vehicleId: golf.id,
        appointmentId: markoAppointment.id,
        mechanicId: mechanic.id,
        status: RepairOrderStatus.IN_PROGRESS,
        problemDescription: 'Redovan mali servis i provera klime.',
        diagnosis: 'Potrebna zamena ulja i filtera. Klima zahteva dopunu freona.',
        startedAt: new Date('2026-06-03T09:15:00'),
        completedAt: null,
      }),
      repairOrdersRepository.create({
        customerId: ana.id,
        vehicleId: yaris.id,
        appointmentId: anaAppointment.id,
        mechanicId: mechanic.id,
        status: RepairOrderStatus.COMPLETED,
        problemDescription: 'Upaljena check engine lampica.',
        diagnosis: 'Neispravna lambda sonda. Izvrsena zamena i brisanje gresaka.',
        startedAt: new Date('2026-06-01T13:15:00'),
        completedAt: new Date('2026-06-01T15:00:00'),
      }),
    ])

    const [markoRepairOrder, anaRepairOrder] = repairOrders

    if (!markoRepairOrder || !anaRepairOrder) {
      throw new Error('Repair orders were not created.')
    }

    console.log('Seeding repair order items...')

    await repairOrderItemsRepository.save([
      repairOrderItemsRepository.create({
        repairOrderId: markoRepairOrder.id,
        serviceId: minorService.id,
        itemType: 'SERVICE',
        description: 'Mali servis',
        quantity: 1,
        unitPrice: '8500.00',
        totalPrice: '8500.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: markoRepairOrder.id,
        serviceId: null,
        itemType: 'PART',
        description: 'Motorno ulje 5W-30',
        quantity: 1,
        unitPrice: '5200.00',
        totalPrice: '5200.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: anaRepairOrder.id,
        serviceId: diagnostics.id,
        itemType: 'SERVICE',
        description: 'Dijagnostika',
        quantity: 1,
        unitPrice: '3000.00',
        totalPrice: '3000.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: anaRepairOrder.id,
        serviceId: null,
        itemType: 'PART',
        description: 'Lambda sonda',
        quantity: 1,
        unitPrice: '16500.00',
        totalPrice: '16500.00',
      }),
    ])

    console.log('Seeding invoices...')

    await invoicesRepository.save([
      invoicesRepository.create({
        repairOrderId: anaRepairOrder.id,
        invoiceNumber: 'INV-2026-0001',
        status: InvoiceStatus.PAID,
        subtotal: '19500.00',
        taxRate: '20.00',
        taxAmount: '3900.00',
        total: '23400.00',
        issuedAt: new Date('2026-06-01T15:10:00'),
        paidAt: new Date('2026-06-01T15:20:00'),
      }),
    ])

    console.log('')
    console.log('Seed completed successfully.')
    console.log('')
    console.log('Test accounts:')
    console.log('Admin:       admin@autoservice.rs / Password123!')
    console.log('Mechanic:    milan@autoservice.rs / Password123!')
    console.log('Reception:   jovana@autoservice.rs / Password123!')
    console.log('')
  } catch (error) {
    console.error('Seed failed:', error)
    process.exitCode = 1
  } finally {
    await AppDataSource.destroy()
  }
}

seed()