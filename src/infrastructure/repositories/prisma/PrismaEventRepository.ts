import { IEventRepository, EventFilters } from '../../../domain/events/repositories/IEventRepository';
import { Event } from '../../../domain/events/entities/Event';
import { EventWeighing } from '../../../domain/events/entities/EventWeighing';
import { EventReproduction } from '../../../domain/events/entities/EventReproduction';
import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { SyncStatus } from '../../../domain/animals/enums';
import { EventCategory, WeighingType, ServiceType, ReproductionResult, DiagnosisMethod } from '../../../domain/events/enums';
import { EventMetadata } from '../../../domain/events/value-objects/EventMetadata';
import { Weight } from '../../../domain/animals/value-objects/Weight';
import { ADG } from '../../../domain/events/value-objects/ADG';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaEventRepository
  extends PrismaBaseRepository
  implements IEventRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaEventRepository');
  }

  async findById(id: UniqueId): Promise<Event | null> {
    try {
      const record = await (this.prisma as any).event.findUnique({
        where: { id: id.value },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByAnimal(animalId: UniqueId, pagination: Pagination): Promise<Event[]> {
    try {
      const records = await (this.prisma as any).event.findMany({
        where: { animalId: animalId.value },
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { eventDate: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByAnimalAndType(animalId: UniqueId, eventType: string): Promise<Event[]> {
    try {
      const records = await (this.prisma as any).event.findMany({
        where: { animalId: animalId.value, eventType },
        orderBy: { eventDate: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByFarm(farmId: UniqueId, filters: EventFilters, pagination: Pagination): Promise<Event[]> {
    try {
      const where = this.buildFilters(filters);
      where.animal = { farmId: farmId.value };
      const records = await (this.prisma as any).event.findMany({
        where,
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { eventDate: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findPendingSync(): Promise<Event[]> {
    try {
      const records = await (this.prisma as any).event.findMany({
        where: { syncStatus: SyncStatus.PENDING },
        orderBy: { localRegistrationDate: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByOfflineId(offlineId: string): Promise<Event | null> {
    try {
      const record = await (this.prisma as any).event.findFirst({
        where: { offlineId },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getLastWeighing(animalId: UniqueId): Promise<EventWeighing | null> {
    try {
      const record = await (this.prisma as any).eventWeighing.findFirst({
        where: { event: { animalId: animalId.value } },
        orderBy: { event: { eventDate: 'desc' } },
      });
      return record ? this.toWeighingDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getLastReproductionEvent(animalId: UniqueId): Promise<EventReproduction | null> {
    try {
      const record = await (this.prisma as any).eventReproduction.findFirst({
        where: { event: { animalId: animalId.value } },
        orderBy: { event: { eventDate: 'desc' } },
      });
      return record ? this.toReproductionDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(event: Event): Promise<Event> {
    try {
      const record = await (this.prisma as any).event.create({
        data: {
          id: event.id.value,
          sequenceNumber: event.sequenceNumber,
          animalId: event.animalId.value,
          registeredBy: event.registeredBy.value,
          eventDate: event.eventDate,
          localRegistrationDate: event.localRegistrationDate,
          syncDate: event.syncDate,
          eventType: event.eventType,
          eventCategory: event.eventCategory,
          lotContext: event.lotContext?.value,
          paddockContext: event.paddockContext?.value,
          gpsLocation: event.gpsLocation,
          deviceId: event.deviceId,
          offlineId: event.offlineId,
          isManual: event.isManual,
          observations: event.observations,
          metadata: event.metadata?.toJSON(),
          syncStatus: event.syncStatus,
          createdAt: event.createdAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async bulkCreate(events: Event[]): Promise<Event[]> {
    try {
      const data = events.map((e) => ({
        id: e.id.value,
        sequenceNumber: e.sequenceNumber,
        animalId: e.animalId.value,
        registeredBy: e.registeredBy.value,
        eventDate: e.eventDate,
        localRegistrationDate: e.localRegistrationDate,
        syncDate: e.syncDate,
        eventType: e.eventType,
        eventCategory: e.eventCategory,
        lotContext: e.lotContext?.value,
        paddockContext: e.paddockContext?.value,
        gpsLocation: e.gpsLocation,
        deviceId: e.deviceId,
        offlineId: e.offlineId,
        isManual: e.isManual,
        observations: e.observations,
        metadata: e.metadata?.toJSON(),
        syncStatus: e.syncStatus,
        createdAt: e.createdAt,
      }));
      await (this.prisma as any).event.createMany({ data });
      const ids = events.map((e) => e.id.value);
      const records = await (this.prisma as any).event.findMany({
        where: { id: { in: ids } },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateSyncStatus(eventId: UniqueId, status: SyncStatus): Promise<void> {
    try {
      await (this.prisma as any).event.update({
        where: { id: eventId.value },
        data: {
          syncStatus: status,
          syncDate: status === SyncStatus.SYNCED ? new Date() : undefined,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private buildFilters(filters: EventFilters): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    if (filters.eventType) where.eventType = filters.eventType;
    if (filters.eventCategory) where.eventCategory = filters.eventCategory;
    if (filters.animalId) where.animalId = filters.animalId;
    if (filters.syncStatus) where.syncStatus = filters.syncStatus;
    if (filters.startDate || filters.endDate) {
      const dateFilter: Record<string, Date> = {};
      if (filters.startDate) dateFilter.gte = filters.startDate;
      if (filters.endDate) dateFilter.lte = filters.endDate;
      where.eventDate = dateFilter;
    }
    return where;
  }

  private toDomain(record: any): Event {
    return Event.create(
      {
        sequenceNumber: record.sequenceNumber != null ? BigInt(record.sequenceNumber) : undefined,
        animalId: new UniqueId(record.animalId),
        registeredBy: new UniqueId(record.registeredBy),
        eventDate: new Date(record.eventDate),
        localRegistrationDate: record.localRegistrationDate ? new Date(record.localRegistrationDate) : new Date(record.eventDate),
        syncDate: record.syncDate ? new Date(record.syncDate) : undefined,
        eventType: record.eventType,
        eventCategory: record.eventCategory as EventCategory,
        lotContext: record.lotContext ? new UniqueId(record.lotContext) : undefined,
        paddockContext: record.paddockContext ? new UniqueId(record.paddockContext) : undefined,
        gpsLocation: record.gpsLocation ?? undefined,
        deviceId: record.deviceId ?? undefined,
        offlineId: record.offlineId ?? undefined,
        isManual: record.isManual,
        observations: record.observations ?? undefined,
        metadata: record.metadata ? EventMetadata.create(record.metadata as Record<string, unknown>) : undefined,
        syncStatus: record.syncStatus as SyncStatus,
      },
      new UniqueId(record.id),
      new Date(record.createdAt),
    );
  }

  private toWeighingDomain(record: any): EventWeighing {
    return EventWeighing.create({
      eventId: new UniqueId(record.eventId),
      weightKg: Weight.create(record.weightKg),
      weighingType: record.weighingType as WeighingType,
      bodyCondition: record.bodyCondition ?? undefined,
      adgSincePrevious: record.adgSincePrevious != null ? ADG.create(record.adgSincePrevious) : undefined,
      daysSincePrevious: record.daysSincePrevious ?? undefined,
      previousWeighingId: record.previousWeighingId ? new UniqueId(record.previousWeighingId) : undefined,
      scaleDevice: record.scaleDevice ?? undefined,
    });
  }

  private toReproductionDomain(record: any): EventReproduction {
    return EventReproduction.create({
      eventId: new UniqueId(record.eventId),
      serviceType: record.serviceType ? (record.serviceType as ServiceType) : undefined,
      studId: record.studId ? new UniqueId(record.studId) : undefined,
      geneticProductId: record.geneticProductId ? new UniqueId(record.geneticProductId) : undefined,
      strawBatch: record.strawBatch ?? undefined,
      aiTechnique: record.aiTechnique ?? undefined,
      serviceTime: record.serviceTime ?? undefined,
      estrusPhase: record.estrusPhase ?? undefined,
      result: record.result ? (record.result as ReproductionResult) : undefined,
      diagnosisDate: record.diagnosisDate ? new Date(record.diagnosisDate) : undefined,
      diagnosisMethod: record.diagnosisMethod ? (record.diagnosisMethod as DiagnosisMethod) : undefined,
      estimatedGestationDays: record.estimatedGestationDays ?? undefined,
      estimatedBirthDate: record.estimatedBirthDate ? new Date(record.estimatedBirthDate) : undefined,
      attemptNumber: record.attemptNumber,
    });
  }
}
