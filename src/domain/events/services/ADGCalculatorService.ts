import { Weight } from '../../animals/value-objects/Weight';
import { ADG } from '../value-objects/ADG';

export class ADGCalculatorService {
  calculateADG(currentWeight: Weight, previousWeight: Weight, days: number): ADG {
    if (days <= 0) {
      throw new Error('Days must be positive');
    }
    const weightDifference = currentWeight.kilograms - previousWeight.kilograms;
    const adgValue = weightDifference / days;
    return ADG.create(adgValue);
  }
}
