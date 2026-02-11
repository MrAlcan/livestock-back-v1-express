import { UniqueId } from '../../shared/Entity';
import { IEventRepository } from '../../events/repositories/IEventRepository';
import { IProductRepository } from '../repositories';
import { Product } from '../entities/Product';

export class WithdrawalPeriodCheckerService {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  async isInWithdrawalPeriod(animalId: UniqueId, checkDate: Date): Promise<boolean> {
    const endDate = await this.getWithdrawalEndDate(animalId);
    if (!endDate) return false;
    return checkDate <= endDate;
  }

  async getWithdrawalEndDate(animalId: UniqueId): Promise<Date | null> {
    const lastHealthEvents = await this.eventRepository.findByAnimalAndType(animalId, 'HEALTH');
    if (lastHealthEvents.length === 0) return null;

    // The last health event is at index 0 (sorted by date desc)
    // In a real impl, we'd get the product and check withdrawal days
    // This is a simplified version
    return null;
  }
}

export class StockManagerService {
  constructor(private readonly productRepository: IProductRepository) {}

  async deductStock(productId: UniqueId, quantity: number): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product not found: ${productId.value}`);
    }
    product.deductStock(quantity);
    await this.productRepository.update(product);
  }

  async addStock(productId: UniqueId, quantity: number): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product not found: ${productId.value}`);
    }
    product.addStock(quantity);
    await this.productRepository.update(product);
  }

  async checkLowStock(): Promise<Product[]> {
    return this.productRepository.findLowStock();
  }
}
