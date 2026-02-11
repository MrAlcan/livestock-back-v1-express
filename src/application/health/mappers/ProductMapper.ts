import { Product } from '../../../domain/health/entities/Product';
import { ProductResponseDTO } from '../dtos/HealthDTOs';

export class ProductMapper {
  static toDTO(product: Product): ProductResponseDTO {
    return {
      id: product.id.value,
      code: product.code,
      name: product.name,
      commercialName: product.commercialName,
      genericName: product.genericName,
      type: product.type,
      category: product.category,
      currentStock: product.currentStock,
      minStock: product.minStock,
      maxStock: product.maxStock,
      unit: product.unit,
      unitCost: product.unitCost,
      salePrice: product.salePrice,
      withdrawalDays: product.withdrawalDays,
      activeIngredient: product.activeIngredient,
      concentration: product.concentration,
      manufacturer: product.manufacturer,
      requiresPrescription: product.requiresPrescription,
      isRefrigerated: product.isRefrigerated,
      storageTemperature: product.storageTemperature,
      observations: product.observations,
      active: product.active,
    };
  }
}
