import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { InventoryMovement } from '../../../domain/health/entities/InventoryMovement';
import { InventoryMovementType } from '../../../domain/health/enums';
import { IProductRepository, IInventoryMovementRepository } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { RecordInventoryMovementInputDTO, InventoryMovementResponseDTO } from '../dtos/HealthDTOs';
import { InventoryMovementMapper } from '../mappers/InventoryMovementMapper';

export class RecordInventoryMovement implements IUseCase<RecordInventoryMovementInputDTO, InventoryMovementResponseDTO> {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly inventoryMovementRepository: IInventoryMovementRepository,
  ) {}

  async execute(input: RecordInventoryMovementInputDTO): Promise<Result<InventoryMovementResponseDTO>> {
    try {
      const productId = new UniqueId(input.productId);
      const product = await this.productRepository.findById(productId);
      if (!product) {
        return Result.fail<InventoryMovementResponseDTO>('Product not found');
      }

      const previousStock = product.currentStock;
      let newStock: number;

      switch (input.movementType) {
        case InventoryMovementType.ENTRY:
          product.addStock(input.quantity);
          newStock = product.currentStock;
          break;
        case InventoryMovementType.EXIT:
        case InventoryMovementType.LOSS:
          product.deductStock(input.quantity);
          newStock = product.currentStock;
          break;
        case InventoryMovementType.ADJUSTMENT:
          // For adjustments, calculate the difference
          newStock = input.quantity;
          if (newStock > previousStock) {
            product.addStock(newStock - previousStock);
          } else if (newStock < previousStock) {
            product.deductStock(previousStock - newStock);
          }
          break;
        default:
          return Result.fail<InventoryMovementResponseDTO>('Invalid movement type');
      }

      const totalCost = input.unitCost ? input.unitCost * input.quantity : undefined;

      const movement = InventoryMovement.create({
        productId,
        movementType: input.movementType,
        quantity: input.movementType === InventoryMovementType.ADJUSTMENT
          ? Math.abs(newStock - previousStock)
          : input.quantity,
        unit: input.unit,
        unitCost: input.unitCost,
        totalCost,
        previousStock,
        newStock: product.currentStock,
        movementDate: new Date(input.movementDate),
        productBatch: input.productBatch,
        expirationDate: input.expirationDate ? new Date(input.expirationDate) : undefined,
        supplierId: input.supplierId ? new UniqueId(input.supplierId) : undefined,
        registeredBy: new UniqueId(input.registeredBy),
        reason: input.reason,
      });

      await this.productRepository.update(product);
      const savedMovement = await this.inventoryMovementRepository.create(movement);

      return Result.ok<InventoryMovementResponseDTO>(InventoryMovementMapper.toDTO(savedMovement));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error recording inventory movement';
      return Result.fail<InventoryMovementResponseDTO>(message);
    }
  }
}
