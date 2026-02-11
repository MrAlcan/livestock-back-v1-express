import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes (opcional, comentar si no se desea)
  // await prisma.$executeRaw`TRUNCATE TABLE "users" CASCADE`;
  // await prisma.$executeRaw`TRUNCATE TABLE "farms" CASCADE`;

  // 1. Crear Farm de prueba
  console.log('📍 Creando farm de prueba...');
  const farm = await prisma.farm.upsert({
    where: { code: 'FARM001' },
    update: {},
    create: {
      name: 'Granja Demo',
      code: 'FARM001',
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Farm creado: ${farm.name}`);

  // 2. Crear Roles
  console.log('👥 Creando roles...');
  const adminRole = await prisma.role.upsert({
    where: { code: 'ADMIN' },
    update: {},
    create: {
      code: 'ADMIN',
      name: 'Administrador',
      description: 'Acceso completo al sistema',
      accessLevel: 100,
      permissions: {},
      isSystem: true,
    },
  });

  const userRole = await prisma.role.upsert({
    where: { code: 'USER' },
    update: {},
    create: {
      code: 'USER',
      name: 'Usuario',
      description: 'Usuario estándar',
      accessLevel: 50,
      permissions: {},
      isSystem: true,
    },
  });

  const vetRole = await prisma.role.upsert({
    where: { code: 'VETERINARIAN' },
    update: {},
    create: {
      code: 'VETERINARIAN',
      name: 'Veterinario',
      description: 'Acceso a registros de salud y eventos',
      accessLevel: 70,
      permissions: {},
      isSystem: true,
    },
  });
  console.log(`✅ Roles creados: ${adminRole.name}, ${userRole.name}, ${vetRole.name}`);

  // 3. Crear usuarios de prueba
  console.log('👤 Creando usuarios de prueba...');
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      passwordHash: hashedPassword,
      fullName: 'Admin Test',
      status: 'ACTIVE',
      farmId: farm.id,
      roleId: adminRole.id,
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      passwordHash: hashedPassword,
      fullName: 'Usuario Demo',
      status: 'ACTIVE',
      farmId: farm.id,
      roleId: userRole.id,
    },
  });

  const vetUser = await prisma.user.upsert({
    where: { email: 'vet@test.com' },
    update: {},
    create: {
      email: 'vet@test.com',
      passwordHash: hashedPassword,
      fullName: 'Dr. Veterinario',
      phone: '+591-12345678',
      status: 'ACTIVE',
      farmId: farm.id,
      roleId: vetRole.id,
    },
  });
  console.log(`✅ Usuarios creados: ${adminUser.email}, ${regularUser.email}, ${vetUser.email}`);

  // 4. Crear Breeds (razas)
  console.log('🐄 Creando razas...');
  const angusBreed = await prisma.breed.upsert({
    where: { code: 'ANGUS' },
    update: {},
    create: {
      code: 'ANGUS',
      name: 'Angus',
      origin: 'Escocia',
      averageAdultWeight: 850.0,
      aptitude: 'MEAT',
      active: true,
    },
  });

  const brahmanBreed = await prisma.breed.upsert({
    where: { code: 'BRAHMAN' },
    update: {},
    create: {
      code: 'BRAHMAN',
      name: 'Brahman',
      origin: 'India/USA',
      averageAdultWeight: 900.0,
      aptitude: 'MEAT',
      active: true,
    },
  });

  const holsteinBreed = await prisma.breed.upsert({
    where: { code: 'HOLSTEIN' },
    update: {},
    create: {
      code: 'HOLSTEIN',
      name: 'Holstein',
      origin: 'Holanda',
      averageAdultWeight: 700.0,
      aptitude: 'MILK',
      active: true,
    },
  });
  console.log(`✅ Razas creadas: ${angusBreed.name}, ${brahmanBreed.name}, ${holsteinBreed.name}`);

  // 5. Crear Lotes de prueba
  console.log('📦 Creando lotes de prueba...');
  const lot1 = await prisma.lot.create({
    data: {
      name: 'Lote A - Engorde',
      code: 'LOT-A',
      type: 'FATTENING',
      farmId: farm.id,
      maxCapacity: 50,
      currentQuantity: 0,
      status: 'ACTIVE',
    },
  });

  const lot2 = await prisma.lot.create({
    data: {
      name: 'Lote B - Cría',
      code: 'LOT-B',
      type: 'BREEDING',
      farmId: farm.id,
      maxCapacity: 30,
      currentQuantity: 0,
      status: 'ACTIVE',
    },
  });

  const lot3 = await prisma.lot.create({
    data: {
      name: 'Lote C - Destete',
      code: 'LOT-C',
      type: 'WEANING',
      farmId: farm.id,
      maxCapacity: 40,
      currentQuantity: 0,
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Lotes creados: ${lot1.name}, ${lot2.name}, ${lot3.name}`);

  // 6. Crear Paddocks (potreros)
  console.log('🌾 Creando potreros...');
  const paddock1 = await prisma.paddock.create({
    data: {
      code: 'PAD-001',
      name: 'Potrero Norte',
      areaHectares: 15.5,
      pastureType: 'Brachiaria',
      pastureCondition: 'GOOD',
      waterSource: true,
      maxCapacity: 80,
      currentCapacity: 0,
      status: 'ACTIVE',
      farmId: farm.id,
    },
  });

  const paddock2 = await prisma.paddock.create({
    data: {
      code: 'PAD-002',
      name: 'Potrero Sur',
      areaHectares: 12.0,
      pastureType: 'Panicum',
      pastureCondition: 'EXCELLENT',
      waterSource: true,
      maxCapacity: 60,
      currentCapacity: 0,
      status: 'ACTIVE',
      farmId: farm.id,
    },
  });
  console.log(`✅ Potreros creados: ${paddock1.name}, ${paddock2.name}`);

  // 7. Crear Animales de prueba
  console.log('🐮 Creando animales de prueba...');
  const animals = [];

  for (let i = 1; i <= 15; i++) {
    const breedId = i % 3 === 0 ? holsteinBreed.id : (i % 2 === 0 ? angusBreed.id : brahmanBreed.id);
    const sex = i % 2 === 0 ? 'FEMALE' : 'MALE';
    const birthDate = new Date(2022, i % 12, i);
    const birthWeight = 30 + Math.random() * 15;
    const currentWeight = 400 + i * 15;

    const animal = await prisma.animal.create({
      data: {
        officialId: `BO-${String(i).padStart(6, '0')}`,
        visualTag: `AR${String(i).padStart(3, '0')}`,
        electronicId: i <= 5 ? `982-${String(i).padStart(12, '0')}` : undefined,
        sex,
        birthDate,
        isEstimatedBirthDate: false,
        breedId,
        breedPercentage: 100.0,
        coatColor: sex === 'MALE' ? 'Negro' : 'Colorado',
        status: 'ACTIVE',
        origin: 'BIRTH',
        birthWeight,
        currentWeight,
        lastWeighingDate: new Date(),
        farmId: farm.id,
        currentLotId: i <= 5 ? lot1.id : (i <= 10 ? lot2.id : lot3.id),
        currentPaddockId: i % 2 === 0 ? paddock1.id : paddock2.id,
      },
    });
    animals.push(animal);
  }
  console.log(`✅ ${animals.length} animales creados`);

  // Actualizar cantidad en lotes
  await prisma.lot.update({
    where: { id: lot1.id },
    data: { currentQuantity: 5 },
  });
  await prisma.lot.update({
    where: { id: lot2.id },
    data: { currentQuantity: 5 },
  });
  await prisma.lot.update({
    where: { id: lot3.id },
    data: { currentQuantity: 5 },
  });

  // Actualizar capacidad en paddocks
  await prisma.paddock.update({
    where: { id: paddock1.id },
    data: { currentCapacity: 8 },
  });
  await prisma.paddock.update({
    where: { id: paddock2.id },
    data: { currentCapacity: 7 },
  });

  // 8. Crear Event Types
  console.log('📋 Creando tipos de eventos...');
  const weightEventType = await prisma.eventType.upsert({
    where: { code: 'WEIGHING' },
    update: {},
    create: {
      code: 'WEIGHING',
      name: 'Pesaje',
      category: 'MANAGEMENT',
      icon: 'scale',
      color: '#3B82F6',
      isSystem: true,
      active: true,
    },
  });

  const healthEventType = await prisma.eventType.upsert({
    where: { code: 'VACCINATION' },
    update: {},
    create: {
      code: 'VACCINATION',
      name: 'Vacunación',
      category: 'HEALTH',
      icon: 'syringe',
      color: '#10B981',
      isSystem: true,
      active: true,
    },
  });

  const movementEventType = await prisma.eventType.upsert({
    where: { code: 'MOVEMENT' },
    update: {},
    create: {
      code: 'MOVEMENT',
      name: 'Movimiento',
      category: 'MANAGEMENT',
      icon: 'arrows-alt',
      color: '#F59E0B',
      isSystem: true,
      active: true,
    },
  });
  console.log(`✅ Tipos de eventos creados`);

  // 9. Crear eventos de pesaje con detalles
  console.log('📅 Creando eventos de pesaje...');
  for (const animal of animals.slice(0, 5)) {
    const event = await prisma.event.create({
      data: {
        animalId: animal.id,
        registeredBy: adminUser.id,
        eventDate: new Date(),
        eventType: 'WEIGHING',
        eventCategory: 'MANAGEMENT',
        eventTypeId: weightEventType.id,
        observations: 'Pesaje mensual de rutina',
      },
    });

    await prisma.eventWeighingDetail.create({
      data: {
        eventId: event.id,
        weight: animal.currentWeight || 450,
        weighingType: 'ROUTINE',
        condition: 'GOOD',
      },
    });
  }
  console.log('✅ Eventos de pesaje creados');

  // 10. Crear eventos de salud (vacunación)
  console.log('💊 Creando eventos de salud...');
  for (const animal of animals.slice(0, 3)) {
    const event = await prisma.event.create({
      data: {
        animalId: animal.id,
        registeredBy: vetUser.id,
        eventDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
        eventType: 'VACCINATION',
        eventCategory: 'HEALTH',
        eventTypeId: healthEventType.id,
        observations: 'Vacunación antiaftosa',
      },
    });

    await prisma.eventHealthDetail.create({
      data: {
        eventId: event.id,
        dosage: 5.0,
        administrationRoute: 'INTRAMUSCULAR',
        diagnosis: 'Prevención',
        withdrawalEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días adelante
      },
    });
  }
  console.log('✅ Eventos de salud creados');

  // 11. Crear Product Types y Products
  console.log('💉 Creando productos veterinarios...');
  const vaccineType = await prisma.productType.upsert({
    where: { code: 'VACCINE' },
    update: {},
    create: {
      code: 'VACCINE',
      name: 'Vacunas',
      requiresStockControl: true,
      requiresWithdrawal: true,
      defaultUnit: 'ml',
    },
  });

  const antiparasiticType = await prisma.productType.upsert({
    where: { code: 'ANTIPARASITIC' },
    update: {},
    create: {
      code: 'ANTIPARASITIC',
      name: 'Antiparasitarios',
      requiresStockControl: true,
      requiresWithdrawal: true,
      defaultUnit: 'ml',
    },
  });

  const vaccine1 = await prisma.product.create({
    data: {
      code: 'VAC-001',
      name: 'Vacuna Antiaftosa',
      type: 'VACCINE',
      productTypeId: vaccineType.id,
      description: 'Vacuna contra fiebre aftosa',
      manufacturer: 'VetPharma',
      unit: 'ml',
      currentStock: 500,
      minimumStock: 100,
      withdrawalDays: 30,
      active: true,
    },
  });

  const antiparasitic1 = await prisma.product.create({
    data: {
      code: 'ANT-001',
      name: 'Ivermectina 1%',
      type: 'ANTIPARASITIC',
      productTypeId: antiparasiticType.id,
      description: 'Antiparasitario de amplio espectro',
      manufacturer: 'AnimalHealth',
      unit: 'ml',
      currentStock: 300,
      minimumStock: 50,
      withdrawalDays: 28,
      active: true,
    },
  });
  console.log(`✅ Productos creados: ${vaccine1.name}, ${antiparasitic1.name}`);

  // 12. Crear categorías financieras
  console.log('💰 Creando categorías financieras...');
  const incomeCategory = await prisma.financialCategory.create({
    data: {
      code: 'INC',
      name: 'Ingresos',
      type: 'INCOME',
      level: 1,
    },
  });

  const expenseCategory = await prisma.financialCategory.create({
    data: {
      code: 'EXP',
      name: 'Gastos',
      type: 'EXPENSE',
      level: 1,
    },
  });

  const salesSubcat = await prisma.financialCategory.create({
    data: {
      code: 'INC-SALES',
      name: 'Venta de Animales',
      type: 'INCOME',
      parentId: incomeCategory.id,
      level: 2,
    },
  });

  const healthSubcat = await prisma.financialCategory.create({
    data: {
      code: 'EXP-HEALTH',
      name: 'Gastos Veterinarios',
      type: 'EXPENSE',
      parentId: expenseCategory.id,
      level: 2,
    },
  });
  console.log(`✅ Categorías financieras creadas`);

  // 13. Crear Third Parties
  console.log('👥 Creando terceros...');
  const buyer1 = await prisma.thirdParty.create({
    data: {
      code: 'CLI-001',
      name: 'Frigorífico Central',
      type: 'CUSTOMER',
      idType: 'NIT',
      taxId: '1234567890',
      phone: '+591-70000000',
      email: 'compras@frigorifico.com',
      city: 'Santa Cruz',
      active: true,
    },
  });

  const supplier1 = await prisma.thirdParty.create({
    data: {
      code: 'PROV-001',
      name: 'Agroveterinaria Del Campo',
      type: 'SUPPLIER',
      idType: 'NIT',
      taxId: '9876543210',
      phone: '+591-71111111',
      email: 'ventas@agrodcampo.com',
      city: 'Santa Cruz',
      active: true,
    },
  });
  console.log(`✅ Terceros creados: ${buyer1.name}, ${supplier1.name}`);

  // 14. Crear movimientos financieros
  console.log('💵 Creando movimientos financieros...');
  await prisma.financialMovement.create({
    data: {
      voucherNumber: 'ING-001',
      type: 'INCOME',
      categoryId: salesSubcat.id,
      thirdPartyId: buyer1.id,
      amount: 15000.0,
      tax: 0,
      totalAmount: 15000.0,
      paymentMethod: 'BANK_TRANSFER',
      status: 'COMPLETED',
      description: 'Venta de 5 novillos',
      movementDate: new Date(),
      paidDate: new Date(),
      farmId: farm.id,
      registeredBy: adminUser.id,
    },
  });

  await prisma.financialMovement.create({
    data: {
      voucherNumber: 'EGR-001',
      type: 'EXPENSE',
      categoryId: healthSubcat.id,
      thirdPartyId: supplier1.id,
      amount: 2500.0,
      tax: 325.0,
      totalAmount: 2825.0,
      paymentMethod: 'CASH',
      status: 'COMPLETED',
      description: 'Compra de vacunas y antiparasitarios',
      movementDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      paidDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      farmId: farm.id,
      registeredBy: adminUser.id,
    },
  });
  console.log(`✅ Movimientos financieros creados`);

  // 15. Crear GMA (Guía de Movimiento Animal)
  console.log('📄 Creando GMA...');
  const gma = await prisma.gMA.create({
    data: {
      gmaCode: 'GMA-2024-001',
      internalNumber: 'INT-001',
      type: 'SALE',
      status: 'DRAFT',
      originFarmId: farm.id,
      destinationFarm: 'Frigorífico Central - Santa Cruz',
      issueDate: new Date(),
      expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      observations: 'Transporte programado para el viernes',
    },
  });

  // Asociar animales al GMA
  for (const animal of animals.slice(0, 3)) {
    await prisma.gMAAnimal.create({
      data: {
        gmaId: gma.id,
        animalId: animal.id,
        weight: animal.currentWeight,
      },
    });
  }
  console.log(`✅ GMA creado: ${gma.gmaCode}`);

  console.log('\n🎉 ¡Seed completado con éxito!');
  console.log('\n📝 Credenciales de prueba:');
  console.log('   Email: admin@test.com');
  console.log('   Password: Admin123!');
  console.log('   Role: ADMIN\n');
  console.log('   Email: user@test.com');
  console.log('   Password: Admin123!');
  console.log('   Role: USER\n');
  console.log('   Email: vet@test.com');
  console.log('   Password: Admin123!');
  console.log('   Role: VETERINARIAN\n');
  console.log('\n📊 Datos creados:');
  console.log(`   - 1 Farm: ${farm.name}`);
  console.log(`   - 3 Roles: ADMIN, USER, VETERINARIAN`);
  console.log(`   - 3 Usuarios`);
  console.log(`   - 3 Razas: Angus, Brahman, Holstein`);
  console.log(`   - 3 Lotes y 2 Potreros`);
  console.log(`   - ${animals.length} Animales`);
  console.log(`   - Eventos de pesaje y salud`);
  console.log(`   - Productos veterinarios`);
  console.log(`   - Categorías financieras y movimientos`);
  console.log(`   - 1 GMA con 3 animales\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
