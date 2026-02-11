export class EstimatedBirthDateCalculatorService {
  private static readonly GESTATION_DAYS = 283;

  calculateEstimatedBirthDate(serviceDate: Date): Date {
    const estimated = new Date(serviceDate);
    estimated.setDate(estimated.getDate() + EstimatedBirthDateCalculatorService.GESTATION_DAYS);
    return estimated;
  }
}
