import { IEventTypeRepository } from '../../../domain/events/repositories/IEventTypeRepository';
import { EventType } from '../../../domain/events/entities/EventType';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaEventTypeRepository
  extends PrismaBaseRepository
  implements IEventTypeRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaEventTypeRepository');
  }

  async findByCode(code: string): Promise<EventType | null> {
    try {
      const record = await (this.prisma as any).eventType.findFirst({
        where: { code },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByCategory(category: string): Promise<EventType[]> {
    try {
      const records = await (this.prisma as any).eventType.findMany({
        where: { category },
        orderBy: { name: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(): Promise<EventType[]> {
    try {
      const records = await (this.prisma as any).eventType.findMany({
        orderBy: { category: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findActive(): Promise<EventType[]> {
    try {
      const records = await (this.prisma as any).eventType.findMany({
        where: { active: true },
        orderBy: { category: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(eventType: EventType): Promise<EventType> {
    try {
      const record = await (this.prisma as any).eventType.create({
        data: {
          code: eventType.code,
          name: eventType.name,
          category: eventType.category,
          description: eventType.description,
          requiresDetail: eventType.requiresDetail,
          isSystem: eventType.isSystem,
          active: eventType.active,
          icon: eventType.icon,
          color: eventType.color,
          createdAt: eventType.createdAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(eventType: EventType): Promise<EventType> {
    try {
      const record = await (this.prisma as any).eventType.update({
        where: { code: eventType.code },
        data: {
          name: eventType.name,
          category: eventType.category,
          description: eventType.description,
          requiresDetail: eventType.requiresDetail,
          active: eventType.active,
          icon: eventType.icon,
          color: eventType.color,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private toDomain(record: any): EventType {
    return EventType.create({
      code: record.code,
      name: record.name,
      category: record.category,
      description: record.description ?? undefined,
      requiresDetail: record.requiresDetail ?? undefined,
      isSystem: record.isSystem,
      active: record.active,
      icon: record.icon ?? undefined,
      color: record.color ?? undefined,
      createdAt: new Date(record.createdAt),
    });
  }
}
