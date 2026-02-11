import { UniqueId } from '../../shared/Entity';
import { Pagination } from '../../shared/Pagination';
import { GMA } from '../entities/GMA';
import { RegulatoryDocument } from '../entities/RegulatoryDocument';
import { DocumentType } from '../enums';
import { Weight } from '../../animals/value-objects/Weight';

export interface GMAFilters {
  readonly status?: string;
  readonly type?: string;
  readonly startDate?: Date;
  readonly endDate?: Date;
  readonly search?: string;
}

export interface IGMARepository {
  findById(id: UniqueId): Promise<GMA | null>;
  findByInternalNumber(internalNumber: string): Promise<GMA | null>;
  findByGMACode(gmaCode: string): Promise<GMA | null>;
  findAll(filters: GMAFilters, pagination: Pagination): Promise<GMA[]>;
  findByFarm(farmId: UniqueId, filters: GMAFilters): Promise<GMA[]>;
  findPendingApproval(): Promise<GMA[]>;
  findInTransit(): Promise<GMA[]>;
  create(gma: GMA): Promise<GMA>;
  update(gma: GMA): Promise<GMA>;
  addAnimal(gmaId: UniqueId, animalId: UniqueId, weight?: Weight): Promise<void>;
  removeAnimal(gmaId: UniqueId, animalId: UniqueId): Promise<void>;
}

export interface IRegulatoryDocumentRepository {
  findById(id: UniqueId): Promise<RegulatoryDocument | null>;
  findByFarm(farmId: UniqueId, type?: DocumentType): Promise<RegulatoryDocument[]>;
  findExpiringSoon(daysThreshold: number): Promise<RegulatoryDocument[]>;
  findExpired(): Promise<RegulatoryDocument[]>;
  findRUNSA(farmId: UniqueId): Promise<RegulatoryDocument | null>;
  create(doc: RegulatoryDocument): Promise<RegulatoryDocument>;
  update(doc: RegulatoryDocument): Promise<RegulatoryDocument>;
  delete(id: UniqueId): Promise<void>;
}
