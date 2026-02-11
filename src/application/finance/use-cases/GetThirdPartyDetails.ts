import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IThirdPartyRepository } from '../../../domain/finance/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { ThirdPartyResponseDTO } from '../dtos/FinanceDTOs';
import { ThirdPartyMapper } from '../mappers/ThirdPartyMapper';

interface GetThirdPartyDetailsInput {
  readonly id: string;
}

export class GetThirdPartyDetails implements IUseCase<GetThirdPartyDetailsInput, ThirdPartyResponseDTO> {
  constructor(
    private readonly thirdPartyRepository: IThirdPartyRepository,
  ) {}

  async execute(input: GetThirdPartyDetailsInput): Promise<Result<ThirdPartyResponseDTO>> {
    try {
      const thirdParty = await this.thirdPartyRepository.findById(new UniqueId(input.id));
      if (!thirdParty) {
        return Result.fail<ThirdPartyResponseDTO>('Third party not found');
      }

      return Result.ok<ThirdPartyResponseDTO>(ThirdPartyMapper.toDTO(thirdParty));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting third party details';
      return Result.fail<ThirdPartyResponseDTO>(message);
    }
  }
}
