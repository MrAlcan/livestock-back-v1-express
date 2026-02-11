import { FinancialMovement } from '../../../domain/finance/entities/FinancialMovement';
import { FinancialMovementResponseDTO } from '../dtos/FinanceDTOs';

export class FinancialMovementMapper {
  static toDTO(movement: FinancialMovement): FinancialMovementResponseDTO {
    return {
      id: movement.id.value,
      voucherNumber: movement.voucherNumber,
      type: movement.type,
      category: movement.category,
      subcategory: movement.subcategory,
      amount: movement.amount,
      currency: movement.currency,
      exchangeRate: movement.exchangeRate,
      baseAmount: movement.baseAmount,
      date: movement.date.toISOString(),
      dueDate: movement.dueDate?.toISOString(),
      paymentDate: movement.paymentDate?.toISOString(),
      paymentMethod: movement.paymentMethod,
      description: movement.description,
      thirdPartyId: movement.thirdPartyId?.value,
      gmaId: movement.gmaId?.value,
      lotId: movement.lotId?.value,
      productId: movement.productId?.value,
      registeredBy: movement.registeredBy.value,
      approvedBy: movement.approvedBy?.value,
      status: movement.status,
      isRecurring: movement.isRecurring,
      frequency: movement.frequency,
      documentUrl: movement.documentUrl,
      observations: movement.observations,
    };
  }
}
