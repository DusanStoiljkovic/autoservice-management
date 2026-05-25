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

function calculateTax(subtotal: number) {
  const taxRate = 20
  const taxAmount = subtotal * 0.2
  const total = subtotal + taxAmount

  return {
    subtotal: subtotal.toFixed(2),
    taxRate: taxRate.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    total: total.toFixed(2),
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
        verifiedAt: new Date(),
        updatedAt: new Date(),
      }),
      usersRepository.create({
        firstName: 'Jovana',
        lastName: 'Petrovic',
        email: 'jovana@autoservice.rs',
        passwordHash: defaultPasswordHash,
        emailCode: 222222,
        role: UsersRole.RECEPTIONIST,
        verifiedAt: new Date(),
        updatedAt: new Date(),
      }),
      usersRepository.create({
        firstName: 'Milan',
        lastName: 'Mehanicar',
        email: 'milan@autoservice.rs',
        passwordHash: defaultPasswordHash,
        emailCode: 333333,
        role: UsersRole.MECHANIC,
        verifiedAt: new Date(),
        updatedAt: new Date(),
      }),
      usersRepository.create({
        firstName: 'Aleksandar',
        lastName: 'Stanic',
        email: 'aleksandar@autoservice.rs',
        passwordHash: defaultPasswordHash,
        emailCode: 444444,
        role: UsersRole.MECHANIC,
        verifiedAt: new Date(),
        updatedAt: new Date(),
      }),
      usersRepository.create({
        firstName: 'Stefan',
        lastName: 'Ristic',
        email: 'stefan@autoservice.rs',
        passwordHash: defaultPasswordHash,
        emailCode: 555555,
        role: UsersRole.MECHANIC,
        verifiedAt: new Date(),
        updatedAt: new Date(),
      }),
      usersRepository.create({
        firstName: 'Jelena',
        lastName: 'Ilic',
        email: 'jelena@autoservice.rs',
        passwordHash: defaultPasswordHash,
        emailCode: 666666,
        role: UsersRole.RECEPTIONIST,
        verifiedAt: new Date(),
        updatedAt: new Date(),
      }),
    ])

    const milan = users.find((user) => user.email === 'milan@autoservice.rs')
    const aleksandar = users.find((user) => user.email === 'aleksandar@autoservice.rs')
    const stefan = users.find((user) => user.email === 'stefan@autoservice.rs')

    if (!milan || !aleksandar || !stefan) {
      throw new Error('Mechanic users were not created.')
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
      customersRepository.create({
        firstName: 'Petar',
        lastName: 'Petrovic',
        phone: '+38164444555',
        email: 'petar.petrovic@example.com',
        address: 'Kralja Milana 22, Beograd',
        notes: 'Flotno vozilo firme. Racun ide na firmu.',
      }),
      customersRepository.create({
        firstName: 'Ivana',
        lastName: 'Stojanovic',
        phone: '+38164555666',
        email: 'ivana.stojanovic@example.com',
        address: 'Bulevar Oslobodjenja 77, Novi Sad',
        notes: 'Vozilo koristi svakodnevno za posao.',
      }),
      customersRepository.create({
        firstName: 'Dejan',
        lastName: 'Pavlovic',
        phone: '+38164666777',
        email: 'dejan.pavlovic@example.com',
        address: 'Vojvode Stepe 155, Beograd',
        notes: 'Trazi procenu troskova pre popravke.',
      }),
      customersRepository.create({
        firstName: 'Milica',
        lastName: 'Kostic',
        phone: '+38164777888',
        email: 'milica.kostic@example.com',
        address: 'Kneza Mihaila 18, Kragujevac',
        notes: 'Preferira kontakt putem telefona.',
      }),
      customersRepository.create({
        firstName: 'Sasa',
        lastName: 'Djordjevic',
        phone: '+38164888999',
        email: 'sasa.djordjevic@example.com',
        address: 'Sindjeliceva 9, Nis',
        notes: 'Cesto radi vece servise.',
      }),
      customersRepository.create({
        firstName: 'Marija',
        lastName: 'Milosevic',
        phone: '+38164999000',
        email: 'marija.milosevic@example.com',
        address: 'Cara Lazara 34, Cacak',
        notes: 'Novi klijent preko preporuke.',
      }),
      customersRepository.create({
        firstName: 'Goran',
        lastName: 'Simic',
        phone: '+38163123123',
        email: 'goran.simic@example.com',
        address: 'Bulevar Evrope 50, Novi Sad',
        notes: 'Vodi racuna o redovnim servisima.',
      }),
      customersRepository.create({
        firstName: 'Tijana',
        lastName: 'Lazic',
        phone: '+38163234234',
        email: 'tijana.lazic@example.com',
        address: 'Zmaj Jovina 12, Subotica',
        notes: 'Potrebno proveriti garanciju delova.',
      }),
      customersRepository.create({
        firstName: 'Vladimir',
        lastName: 'Radovic',
        phone: '+38163345345',
        email: 'vladimir.radovic@example.com',
        address: 'Toplicka 6, Leskovac',
        notes: 'Vozilo koristi za duza putovanja.',
      }),
    ])

    console.log('Seeding vehicles...')

    const vehicles = await vehiclesRepository.save([
      vehiclesRepository.create({
        customerId: customers[0].id,
        make: 'Volkswagen',
        model: 'Golf 7',
        productionYear: 2016,
        licensePlate: 'BG-123-AA',
        vin: 'WVWZZZAUZGW000001',
        mileage: 182000,
      }),
      vehiclesRepository.create({
        customerId: customers[0].id,
        make: 'Opel',
        model: 'Astra K',
        productionYear: 2018,
        licensePlate: 'BG-321-MK',
        vin: 'W0LBD6EC5J8000001',
        mileage: 126000,
      }),
      vehiclesRepository.create({
        customerId: customers[1].id,
        make: 'Audi',
        model: 'A4',
        productionYear: 2018,
        licensePlate: 'BG-456-BB',
        vin: 'WAUZZZF40JA000002',
        mileage: 136500,
      }),
      vehiclesRepository.create({
        customerId: customers[2].id,
        make: 'Toyota',
        model: 'Yaris',
        productionYear: 2020,
        licensePlate: 'NI-789-CC',
        vin: 'JTDBT923001000003',
        mileage: 64200,
      }),
      vehiclesRepository.create({
        customerId: customers[3].id,
        make: 'BMW',
        model: '320d',
        productionYear: 2017,
        licensePlate: 'BG-777-PP',
        vin: 'WBA8C31090A000004',
        mileage: 174000,
      }),
      vehiclesRepository.create({
        customerId: customers[4].id,
        make: 'Renault',
        model: 'Clio',
        productionYear: 2019,
        licensePlate: 'NS-555-IV',
        vin: 'VF1RJA001K0000005',
        mileage: 81000,
      }),
      vehiclesRepository.create({
        customerId: customers[5].id,
        make: 'Skoda',
        model: 'Octavia',
        productionYear: 2016,
        licensePlate: 'BG-808-DP',
        vin: 'TMBJG7NE0G0000006',
        mileage: 211000,
      }),
      vehiclesRepository.create({
        customerId: customers[6].id,
        make: 'Opel',
        model: 'Corsa',
        productionYear: 2015,
        licensePlate: 'KG-404-MK',
        vin: 'W0L0SDL68F0000007',
        mileage: 153500,
      }),
      vehiclesRepository.create({
        customerId: customers[7].id,
        make: 'Mercedes-Benz',
        model: 'C220 CDI',
        productionYear: 2014,
        licensePlate: 'NI-222-SD',
        vin: 'WDD2040021A000008',
        mileage: 245000,
      }),
      vehiclesRepository.create({
        customerId: customers[8].id,
        make: 'Peugeot',
        model: '308',
        productionYear: 2018,
        licensePlate: 'CA-019-MM',
        vin: 'VF3LBHNYHJS000009',
        mileage: 118000,
      }),
      vehiclesRepository.create({
        customerId: customers[9].id,
        make: 'Volkswagen',
        model: 'Passat B8',
        productionYear: 2017,
        licensePlate: 'NS-902-GS',
        vin: 'WVWZZZ3CZHE000010',
        mileage: 194000,
      }),
      vehiclesRepository.create({
        customerId: customers[10].id,
        make: 'Kia',
        model: 'Sportage',
        productionYear: 2021,
        licensePlate: 'SU-331-TL',
        vin: 'U5YPG81ABML000011',
        mileage: 57000,
      }),
      vehiclesRepository.create({
        customerId: customers[11].id,
        make: 'Ford',
        model: 'Focus',
        productionYear: 2016,
        licensePlate: 'LE-700-VR',
        vin: 'WF0PXXGCHPG000012',
        mileage: 167300,
      }),
    ])

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
      servicesRepository.create({
        name: 'Zamena akumulatora',
        description: 'Provera punjenja alternatora i zamena akumulatora.',
        price: '2500.00',
        estimatedDurationMinutes: 30,
        isActive: true,
      }),
      servicesRepository.create({
        name: 'Servis klime',
        description: 'Provera sistema, vakumiranje i dopuna freona.',
        price: '6500.00',
        estimatedDurationMinutes: 75,
        isActive: true,
      }),
      servicesRepository.create({
        name: 'Reglaza trapa',
        description: 'Podesavanje geometrije prednjeg i zadnjeg trapa.',
        price: '4000.00',
        estimatedDurationMinutes: 60,
        isActive: true,
      }),
      servicesRepository.create({
        name: 'Zamena amortizera',
        description: 'Zamena prednjih ili zadnjih amortizera i kontrola oslanjanja.',
        price: '12000.00',
        estimatedDurationMinutes: 150,
        isActive: true,
      }),
      servicesRepository.create({
        name: 'Zamena kvacila',
        description: 'Demontaza menjaca i zamena seta kvacila.',
        price: '35000.00',
        estimatedDurationMinutes: 420,
        isActive: true,
      }),
      servicesRepository.create({
        name: 'Zamena svecica',
        description: 'Zamena svecica i provera rada motora.',
        price: '4500.00',
        estimatedDurationMinutes: 60,
        isActive: true,
      }),
      servicesRepository.create({
        name: 'Zamena sijalica',
        description: 'Zamena sijalica i provera svetlosne signalizacije.',
        price: '1500.00',
        estimatedDurationMinutes: 25,
        isActive: true,
      }),
      servicesRepository.create({
        name: 'Pregled pred kupovinu',
        description: 'Detaljan pregled vozila pre kupovine sa izvestajem.',
        price: '7000.00',
        estimatedDurationMinutes: 90,
        isActive: true,
      }),
    ])

    const getService = (name: string) => {
      const service = services.find((item) => item.name === name)

      if (!service) {
        throw new Error(`Service ${name} was not created.`)
      }

      return service
    }

    const maliServis = getService('Mali servis')
    const velikiServis = getService('Veliki servis')
    const dijagnostika = getService('Dijagnostika')
    const kocnice = getService('Zamena kocnica')
    const akumulator = getService('Zamena akumulatora')
    const klima = getService('Servis klime')
    const trap = getService('Reglaza trapa')
    const amortizeri = getService('Zamena amortizera')
    const kvacilo = getService('Zamena kvacila')
    const svecice = getService('Zamena svecica')
    const sijalice = getService('Zamena sijalica')
    const pregled = getService('Pregled pred kupovinu')

    console.log('Seeding appointments...')

    const appointments = await appointmentsRepository.save([
      appointmentsRepository.create({
        customerId: customers[0].id,
        vehicleId: vehicles[0].id,
        scheduledAt: new Date('2026-06-01T09:00:00'),
        status: AppointmentStatus.COMPLETED,
        description: 'Mali servis i provera klime pre puta.',
      }),
      appointmentsRepository.create({
        customerId: customers[4].id,
        vehicleId: vehicles[5].id,
        scheduledAt: new Date('2026-06-01T11:30:00'),
        status: AppointmentStatus.COMPLETED,
        description: 'Dijagnostika zbog lampice check engine.',
      }),
      appointmentsRepository.create({
        customerId: customers[1].id,
        vehicleId: vehicles[2].id,
        scheduledAt: new Date('2026-06-02T09:30:00'),
        status: AppointmentStatus.CONFIRMED,
        description: 'Cuje se zvuk pri kocenju.',
      }),
      appointmentsRepository.create({
        customerId: customers[2].id,
        vehicleId: vehicles[3].id,
        scheduledAt: new Date('2026-06-02T13:00:00'),
        status: AppointmentStatus.SCHEDULED,
        description: 'Redovan mali servis.',
      }),
      appointmentsRepository.create({
        customerId: customers[3].id,
        vehicleId: vehicles[4].id,
        scheduledAt: new Date('2026-06-03T08:30:00'),
        status: AppointmentStatus.COMPLETED,
        description: 'Veliki servis i kontrola rashladnog sistema.',
      }),
      appointmentsRepository.create({
        customerId: customers[5].id,
        vehicleId: vehicles[6].id,
        scheduledAt: new Date('2026-06-03T12:00:00'),
        status: AppointmentStatus.CONFIRMED,
        description: 'Vibracije pri brzini preko 100 km/h.',
      }),
      appointmentsRepository.create({
        customerId: customers[6].id,
        vehicleId: vehicles[7].id,
        scheduledAt: new Date('2026-06-04T10:00:00'),
        status: AppointmentStatus.COMPLETED,
        description: 'Zamena akumulatora i provera punjenja.',
      }),
      appointmentsRepository.create({
        customerId: customers[7].id,
        vehicleId: vehicles[8].id,
        scheduledAt: new Date('2026-06-04T14:00:00'),
        status: AppointmentStatus.SCHEDULED,
        description: 'Pregled oslanjanja i amortizera.',
      }),
      appointmentsRepository.create({
        customerId: customers[8].id,
        vehicleId: vehicles[9].id,
        scheduledAt: new Date('2026-06-05T09:00:00'),
        status: AppointmentStatus.CONFIRMED,
        description: 'Servis klime i zamena sijalice.',
      }),
      appointmentsRepository.create({
        customerId: customers[9].id,
        vehicleId: vehicles[10].id,
        scheduledAt: new Date('2026-06-05T11:30:00'),
        status: AppointmentStatus.COMPLETED,
        description: 'Zamena seta kvacila.',
      }),
      appointmentsRepository.create({
        customerId: customers[10].id,
        vehicleId: vehicles[11].id,
        scheduledAt: new Date('2026-06-06T09:30:00'),
        status: AppointmentStatus.SCHEDULED,
        description: 'Pregled pred put i mali servis.',
      }),
      appointmentsRepository.create({
        customerId: customers[11].id,
        vehicleId: vehicles[12].id,
        scheduledAt: new Date('2026-06-06T12:30:00'),
        status: AppointmentStatus.CONFIRMED,
        description: 'Dijagnostika i provera potrosnje goriva.',
      }),
      appointmentsRepository.create({
        customerId: customers[0].id,
        vehicleId: vehicles[1].id,
        scheduledAt: new Date('2026-06-07T10:00:00'),
        status: AppointmentStatus.SCHEDULED,
        description: 'Pregled pred kupovinu za drugo vozilo.',
      }),
    ])

    console.log('Seeding repair orders...')

    const repairOrders = await repairOrdersRepository.save([
      repairOrdersRepository.create({
        customerId: customers[0].id,
        vehicleId: vehicles[0].id,
        appointmentId: appointments[0].id,
        mechanicId: milan.id,
        status: RepairOrderStatus.COMPLETED,
        problemDescription: 'Redovan mali servis i slabije hladjenje klime.',
        diagnosis: 'Uradjena zamena ulja i filtera. Klima dopunjena freonom.',
        startedAt: new Date('2026-06-01T09:10:00'),
        completedAt: new Date('2026-06-01T11:00:00'),
      }),
      repairOrdersRepository.create({
        customerId: customers[4].id,
        vehicleId: vehicles[5].id,
        appointmentId: appointments[1].id,
        mechanicId: aleksandar.id,
        status: RepairOrderStatus.COMPLETED,
        problemDescription: 'Upaljena check engine lampica.',
        diagnosis: 'Pronadjena greska lambda sonde. Izvrsena zamena i brisanje gresaka.',
        startedAt: new Date('2026-06-01T11:40:00'),
        completedAt: new Date('2026-06-01T14:20:00'),
      }),
      repairOrdersRepository.create({
        customerId: customers[1].id,
        vehicleId: vehicles[2].id,
        appointmentId: appointments[2].id,
        mechanicId: stefan.id,
        status: RepairOrderStatus.IN_PROGRESS,
        problemDescription: 'Cuje se skripanje pri kocenju.',
        diagnosis: 'Prednje plocice istrosene. Diskovi imaju ivicu i preporucena je zamena.',
        startedAt: new Date('2026-06-02T09:45:00'),
        completedAt: null,
      }),
      repairOrdersRepository.create({
        customerId: customers[3].id,
        vehicleId: vehicles[4].id,
        appointmentId: appointments[4].id,
        mechanicId: milan.id,
        status: RepairOrderStatus.COMPLETED,
        problemDescription: 'Veliki servis po kilometrazi.',
        diagnosis: 'Zamenjen set zupcastog kaisa, vodena pumpa i rashladna tecnost.',
        startedAt: new Date('2026-06-03T08:45:00'),
        completedAt: new Date('2026-06-03T15:30:00'),
      }),
      repairOrdersRepository.create({
        customerId: customers[5].id,
        vehicleId: vehicles[6].id,
        appointmentId: appointments[5].id,
        mechanicId: aleksandar.id,
        status: RepairOrderStatus.IN_PROGRESS,
        problemDescription: 'Vibracije vozila na vecim brzinama.',
        diagnosis: 'Potrebna reglaza trapa i balansiranje tockova.',
        startedAt: new Date('2026-06-03T12:20:00'),
        completedAt: null,
      }),
      repairOrdersRepository.create({
        customerId: customers[6].id,
        vehicleId: vehicles[7].id,
        appointmentId: appointments[6].id,
        mechanicId: stefan.id,
        status: RepairOrderStatus.COMPLETED,
        problemDescription: 'Auto tesko pali ujutru.',
        diagnosis: 'Akumulator slab. Alternator puni ispravno. Akumulator zamenjen.',
        startedAt: new Date('2026-06-04T10:10:00'),
        completedAt: new Date('2026-06-04T10:55:00'),
      }),
      repairOrdersRepository.create({
        customerId: customers[8].id,
        vehicleId: vehicles[9].id,
        appointmentId: appointments[8].id,
        mechanicId: milan.id,
        status: RepairOrderStatus.IN_PROGRESS,
        problemDescription: 'Klima slabije hladi i ne radi desno kratko svetlo.',
        diagnosis: 'Klima treba dopunu freona. Sijalica pregorela.',
        startedAt: new Date('2026-06-05T09:15:00'),
        completedAt: null,
      }),
      repairOrdersRepository.create({
        customerId: customers[9].id,
        vehicleId: vehicles[10].id,
        appointmentId: appointments[9].id,
        mechanicId: aleksandar.id,
        status: RepairOrderStatus.COMPLETED,
        problemDescription: 'Kvacilo proklizava pri ubrzanju.',
        diagnosis: 'Set kvacila istrosen. Zamenjen set kvacila i provereno curenje ulja.',
        startedAt: new Date('2026-06-05T11:45:00'),
        completedAt: new Date('2026-06-05T18:00:00'),
      }),
    ])

    console.log('Seeding repair order items...')

    await repairOrderItemsRepository.save([
      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[0].id,
        serviceId: maliServis.id,
        itemType: 'SERVICE',
        description: 'Mali servis',
        quantity: 1,
        unitPrice: '8500.00',
        totalPrice: '8500.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[0].id,
        serviceId: klima.id,
        itemType: 'SERVICE',
        description: 'Servis klime',
        quantity: 1,
        unitPrice: '6500.00',
        totalPrice: '6500.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[0].id,
        serviceId: null,
        itemType: 'PART',
        description: 'Motorno ulje 5W-30 5L',
        quantity: 1,
        unitPrice: '5200.00',
        totalPrice: '5200.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[0].id,
        serviceId: null,
        itemType: 'PART',
        description: 'Filter kabine',
        quantity: 1,
        unitPrice: '1800.00',
        totalPrice: '1800.00',
      }),

      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[1].id,
        serviceId: dijagnostika.id,
        itemType: 'SERVICE',
        description: 'Racunarska dijagnostika',
        quantity: 1,
        unitPrice: '3000.00',
        totalPrice: '3000.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[1].id,
        serviceId: null,
        itemType: 'PART',
        description: 'Lambda sonda',
        quantity: 1,
        unitPrice: '16500.00',
        totalPrice: '16500.00',
      }),

      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[2].id,
        serviceId: kocnice.id,
        itemType: 'SERVICE',
        description: 'Zamena prednjih diskova i plocica',
        quantity: 1,
        unitPrice: '18000.00',
        totalPrice: '18000.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[2].id,
        serviceId: null,
        itemType: 'PART',
        description: 'Prednji diskovi set',
        quantity: 1,
        unitPrice: '22000.00',
        totalPrice: '22000.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[2].id,
        serviceId: null,
        itemType: 'PART',
        description: 'Prednje plocice set',
        quantity: 1,
        unitPrice: '9500.00',
        totalPrice: '9500.00',
      }),

      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[3].id,
        serviceId: velikiServis.id,
        itemType: 'SERVICE',
        description: 'Veliki servis',
        quantity: 1,
        unitPrice: '42000.00',
        totalPrice: '42000.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[3].id,
        serviceId: null,
        itemType: 'PART',
        description: 'Set zupcastog kaisa',
        quantity: 1,
        unitPrice: '28500.00',
        totalPrice: '28500.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[3].id,
        serviceId: null,
        itemType: 'PART',
        description: 'Vodena pumpa',
        quantity: 1,
        unitPrice: '8700.00',
        totalPrice: '8700.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[3].id,
        serviceId: null,
        itemType: 'PART',
        description: 'Rashladna tecnost',
        quantity: 2,
        unitPrice: '1200.00',
        totalPrice: '2400.00',
      }),

      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[4].id,
        serviceId: trap.id,
        itemType: 'SERVICE',
        description: 'Reglaza trapa',
        quantity: 1,
        unitPrice: '4000.00',
        totalPrice: '4000.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[4].id,
        serviceId: null,
        itemType: 'PART',
        description: 'Balans tegovi',
        quantity: 4,
        unitPrice: '350.00',
        totalPrice: '1400.00',
      }),

      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[5].id,
        serviceId: akumulator.id,
        itemType: 'SERVICE',
        description: 'Zamena akumulatora',
        quantity: 1,
        unitPrice: '2500.00',
        totalPrice: '2500.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[5].id,
        serviceId: null,
        itemType: 'PART',
        description: 'Akumulator 60Ah',
        quantity: 1,
        unitPrice: '14500.00',
        totalPrice: '14500.00',
      }),

      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[6].id,
        serviceId: klima.id,
        itemType: 'SERVICE',
        description: 'Servis klime',
        quantity: 1,
        unitPrice: '6500.00',
        totalPrice: '6500.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[6].id,
        serviceId: sijalice.id,
        itemType: 'SERVICE',
        description: 'Zamena sijalice',
        quantity: 1,
        unitPrice: '1500.00',
        totalPrice: '1500.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[6].id,
        serviceId: null,
        itemType: 'PART',
        description: 'H7 sijalica',
        quantity: 1,
        unitPrice: '900.00',
        totalPrice: '900.00',
      }),

      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[7].id,
        serviceId: kvacilo.id,
        itemType: 'SERVICE',
        description: 'Zamena kvacila',
        quantity: 1,
        unitPrice: '35000.00',
        totalPrice: '35000.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[7].id,
        serviceId: null,
        itemType: 'PART',
        description: 'Set kvacila',
        quantity: 1,
        unitPrice: '52000.00',
        totalPrice: '52000.00',
      }),
      repairOrderItemsRepository.create({
        repairOrderId: repairOrders[7].id,
        serviceId: null,
        itemType: 'PART',
        description: 'Ulje menjaca',
        quantity: 2,
        unitPrice: '1800.00',
        totalPrice: '3600.00',
      }),
    ])

    console.log('Seeding invoices...')

    const invoice1 = calculateTax(22000)
    const invoice2 = calculateTax(19500)
    const invoice3 = calculateTax(81600)
    const invoice4 = calculateTax(17000)
    const invoice5 = calculateTax(90600)

    await invoicesRepository.save([
      invoicesRepository.create({
        repairOrderId: repairOrders[0].id,
        invoiceNumber: 'INV-2026-0001',
        status: InvoiceStatus.PAID,
        subtotal: invoice1.subtotal,
        taxRate: invoice1.taxRate,
        taxAmount: invoice1.taxAmount,
        total: invoice1.total,
        issuedAt: new Date('2026-06-01T11:10:00'),
        paidAt: new Date('2026-06-01T11:20:00'),
      }),
      invoicesRepository.create({
        repairOrderId: repairOrders[1].id,
        invoiceNumber: 'INV-2026-0002',
        status: InvoiceStatus.PAID,
        subtotal: invoice2.subtotal,
        taxRate: invoice2.taxRate,
        taxAmount: invoice2.taxAmount,
        total: invoice2.total,
        issuedAt: new Date('2026-06-01T14:30:00'),
        paidAt: new Date('2026-06-01T14:45:00'),
      }),
      invoicesRepository.create({
        repairOrderId: repairOrders[3].id,
        invoiceNumber: 'INV-2026-0003',
        status: InvoiceStatus.PAID,
        subtotal: invoice3.subtotal,
        taxRate: invoice3.taxRate,
        taxAmount: invoice3.taxAmount,
        total: invoice3.total,
        issuedAt: new Date('2026-06-03T15:45:00'),
        paidAt: new Date('2026-06-03T16:10:00'),
      }),
      invoicesRepository.create({
        repairOrderId: repairOrders[5].id,
        invoiceNumber: 'INV-2026-0004',
        status: InvoiceStatus.PAID,
        subtotal: invoice4.subtotal,
        taxRate: invoice4.taxRate,
        taxAmount: invoice4.taxAmount,
        total: invoice4.total,
        issuedAt: new Date('2026-06-04T11:05:00'),
        paidAt: new Date('2026-06-04T11:10:00'),
      }),
      invoicesRepository.create({
        repairOrderId: repairOrders[7].id,
        invoiceNumber: 'INV-2026-0005',
        status: InvoiceStatus.PAID,
        subtotal: invoice5.subtotal,
        taxRate: invoice5.taxRate,
        taxAmount: invoice5.taxAmount,
        total: invoice5.total,
        issuedAt: new Date('2026-06-05T18:10:00'),
        paidAt: new Date('2026-06-05T18:30:00'),
      }),
    ])

    console.log('')
    console.log('Seed completed successfully.')
    console.log('')
    console.log('Created records:')
    console.log(`Users: ${users.length}`)
    console.log(`Customers: ${customers.length}`)
    console.log(`Vehicles: ${vehicles.length}`)
    console.log(`Services: ${services.length}`)
    console.log(`Appointments: ${appointments.length}`)
    console.log(`Repair orders: ${repairOrders.length}`)
    console.log('')
    console.log('Test accounts:')
    console.log('Admin:       admin@autoservice.rs / Password123!')
    console.log('Reception:   jovana@autoservice.rs / Password123!')
    console.log('Mechanic 1:  milan@autoservice.rs / Password123!')
    console.log('Mechanic 2:  aleksandar@autoservice.rs / Password123!')
    console.log('Mechanic 3:  stefan@autoservice.rs / Password123!')
    console.log('')
  } catch (error) {
    console.error('Seed failed:', error)
    process.exitCode = 1
  } finally {
    await AppDataSource.destroy()
  }
}

seed()