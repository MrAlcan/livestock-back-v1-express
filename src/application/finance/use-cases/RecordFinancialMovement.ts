import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { FinancialMovement } from '../../../domain/finance/entities/FinancialMovement';
import { IFinancialMovementRepository } from '../../../domain/finance/repositories';
import { FinancialStatus } from '../../../domain/finance/enums';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { RecordFinancialMovementInputDTO, FinancialMovementResponseDTO } from '../dtos/FinanceDTOs';
import { FinancialMovementMapper } from '../mappers/FinancialMovementMapper';

export class RecordFinancialMovement implements IUseCase<RecordFinancialMovementInputDTO, FinancialMovementResponseDTO> {
  constructor(
    private readonly movementRepository: IFinancialMovementRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: RecordFinancialMovementInputDTO): Promise<Result<FinancialMovementResponseDTO>> {
    try {
      // Validate voucher number uniqueness if provided
      if (input.voucherNumber) {
        const existing = await this.movementRepository.findByVoucherNumber(input.voucherNumber);
        if (existing) {
          return Result.fail<FinancialMovementResponseDTO>('A movement with this voucher number already exists');
        }
      }

      const movement = FinancialMovement.create({
        voucherNumber: input.voucherNumber,
        type: input.type,
        category: input.category,
        subcategory: input.subcategory,
        amount: input.amount,
        currency: input.currency ?? 'BOB',
        exchangeRate: input.exchangeRate,
        baseAmount: input.exchangeRate ? Math.round(input.amount * input.exchangeRate * 100) / 100 : undefined,
        date: new Date(input.date),
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        paymentMethod: input.paymentMethod,
        description: input.description,
        thirdPartyId: input.thirdPartyId ? new UniqueId(input.thirdPartyId) : undefined,
        gmaId: input.gmaId ? new UniqueId(input.gmaId) : undefined,
        lotId: input.lotId ? new UniqueId(input.lotId) : undefined,
        productId: input.productId ? new UniqueId(input.productId) : undefined,
        registeredBy: new UniqueId(input.registeredBy),
        status: FinancialStatus.PENDING,
        isRecurring: input.isRecurring ?? false,
        frequency: input.frequency,
        documentUrl: input.documentUrl,
        observations: input.observations,
      });

      const saved = await this.movementRepository.create(movement);

      // Publish domain events
      if (saved.domainEvents.length > 0) {
        await this.eventBus.publishAll(saved.domainEvents);
        saved.clearDomainEvents();
      }

      return Result.ok<FinancialMovementResponseDTO>(FinancialMovementMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error recording financial movement';
      return Result.fail<FinancialMovementResponseDTO>(message);
    }
  }
}
