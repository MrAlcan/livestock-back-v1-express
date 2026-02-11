import { Result } from '../../../domain/shared/Result';
import { ThirdParty } from '../../../domain/finance/entities/ThirdParty';
import { IThirdPartyRepository } from '../../../domain/finance/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { CreateThirdPartyInputDTO, ThirdPartyResponseDTO } from '../dtos/FinanceDTOs';
import { ThirdPartyMapper } from '../mappers/ThirdPartyMapper';

export class CreateThirdParty implements IUseCase<CreateThirdPartyInputDTO, ThirdPartyResponseDTO> {
  constructor(
    private readonly thirdPartyRepository: IThirdPartyRepository,
  ) {}

  async execute(input: CreateThirdPartyInputDTO): Promise<Result<ThirdPartyResponseDTO>> {
    try {
      // Validate code uniqueness if provided
      if (input.code) {
        const existingByCode = await this.thirdPartyRepository.findByCode(input.code);
        if (existingByCode) {
          return Result.fail<ThirdPartyResponseDTO>('A third party with this code already exists');
        }
      }

      // Validate tax ID uniqueness if provided
      if (input.taxId) {
        const existingByTaxId = await this.thirdPartyRepository.findByTaxId(input.taxId);
        if (existingByTaxId) {
          return Result.fail<ThirdPartyResponseDTO>('A third party with this tax ID already exists');
        }
      }

      const thirdParty = ThirdParty.create({
        code: input.code,
        name: input.name,
        tradeName: input.tradeName,
        type: input.type,
        subtype: input.subtype,
        taxId: input.taxId,
        idType: input.idType,
        address: input.address,
        phone: input.phone,
        email: input.email,
        contactPerson: input.contactPerson,
        creditDays: input.creditDays,
        creditLimit: input.creditLimit,
        active: true,
        observations: input.observations,
      });

      const saved = await this.thirdPartyRepository.create(thirdParty);
      return Result.ok<ThirdPartyResponseDTO>(ThirdPartyMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error creating third party';
      return Result.fail<ThirdPartyResponseDTO>(message);
    }
  }
}
