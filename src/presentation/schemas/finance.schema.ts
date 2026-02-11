import { z } from 'zod';
import { FinancialType, PaymentMethod, IDType } from '../../domain/finance/enums';

export const recordFinancialMovementSchema = z.object({
  voucherNumber: z.string().optional(),
  type: z.nativeEnum(FinancialType),
  category: z.string().min(1, 'Categoría requerida'),
  subcategory: z.string().optional(),
  amount: z.number().positive('Monto debe ser positivo'),
  currency: z.string().optional(),
  exchangeRate: z.number().positive().optional(),
  date: z.string().min(1, 'Fecha requerida'),
  dueDate: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  description: z.string().min(1, 'Descripción requerida'),
  thirdPartyId: z.string().uuid().optional(),
  gmaId: z.string().uuid().optional(),
  lotId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  isRecurring: z.boolean().optional(),
  frequency: z.string().optional(),
  documentUrl: z.string().url().optional(),
  observations: z.string().optional(),
});

export const markAsPaymentSchema = z.object({
  paymentDate: z.string().min(1, 'Fecha de pago requerida'),
  paymentMethod: z.nativeEnum(PaymentMethod),
});

export const financialFiltersSchema = z.object({
  type: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  thirdPartyId: z.string().uuid().optional(),
  lotId: z.string().uuid().optional(),
  search: z.string().optional(),
});

export const createThirdPartySchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, 'Nombre requerido'),
  tradeName: z.string().optional(),
  type: z.string().min(1, 'Tipo requerido'),
  subtype: z.string().optional(),
  taxId: z.string().optional(),
  idType: z.nativeEnum(IDType).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  contactPerson: z.string().optional(),
  creditDays: z.number().int().min(0).optional(),
  creditLimit: z.number().positive().optional(),
  observations: z.string().optional(),
});

export const updateThirdPartySchema = z.object({
  name: z.string().optional(),
  tradeName: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  contactPerson: z.string().optional(),
  creditDays: z.number().int().min(0).optional(),
  creditLimit: z.number().positive().optional(),
  observations: z.string().optional(),
});

export const thirdPartyFiltersSchema = z.object({
  type: z.string().optional(),
  subtype: z.string().optional(),
  active: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  search: z.string().optional(),
});

export const createFinancialCategorySchema = z.object({
  code: z.string().min(1, 'Código requerido'),
  name: z.string().min(1, 'Nombre requerido'),
  type: z.nativeEnum(FinancialType).optional(),
  parentId: z.number().int().positive().optional(),
  description: z.string().optional(),
});

export const profitCalculationSchema = z.object({
  startDate: z.string().min(1, 'Fecha inicio requerida'),
  endDate: z.string().min(1, 'Fecha fin requerida'),
});
