import { UniqueId } from '../../shared/Entity';
import { DateRange } from '../../shared/Pagination';

export interface ReproductionKPIs {
  pregnancyRate: number;      // (Pregnant / Serviced) * 100
  calvingRate: number;        // (Born / Pregnant) * 100
  weaningRate: number;        // (Weaned / Born) * 100
  averageCalvingInterval: number; // Average days between births
}

export interface BirthProjection {
  month: string;
  year: number;
  estimatedBirths: number;
}

export class ReproductionKPICalculatorService {
  calculatePregnancyRate(pregnantCount: number, servicedCount: number): number {
    if (servicedCount === 0) return 0;
    return Math.round((pregnantCount / servicedCount) * 10000) / 100;
  }

  calculateCalvingRate(bornCount: number, pregnantCount: number): number {
    if (pregnantCount === 0) return 0;
    return Math.round((bornCount / pregnantCount) * 10000) / 100;
  }

  calculateWeaningRate(weanedCount: number, bornCount: number): number {
    if (bornCount === 0) return 0;
    return Math.round((weanedCount / bornCount) * 10000) / 100;
  }
}

export class BirthProjectionService {
  private static readonly GESTATION_DAYS = 283;

  projectBirthDateFromService(serviceDate: Date): Date {
    const projected = new Date(serviceDate);
    projected.setDate(projected.getDate() + BirthProjectionService.GESTATION_DAYS);
    return projected;
  }
}
