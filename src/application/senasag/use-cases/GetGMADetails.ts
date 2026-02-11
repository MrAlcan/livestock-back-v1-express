import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IGMARepository } from '../../../domain/senasag/repositories/IGMARepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { GMAResponseDTO } from '../dtos/SenasagDTOs';
import { GMAMapper } from '../mappers/GMAMapper';

interface GetGMADetailsInputDTO {
  readonly gmaId: string;
}

export class GetGMADetails implements IUseCase<GetGMADetailsInputDTO, GMAResponseDTO> {
  constructor(
    private readonly gmaRepository: IGMARepository,
  ) {}

  async execute(input: GetGMADetailsInputDTO): Promise<Result<GMAResponseDTO>> {
    try {
      const gma = await this.gmaRepository.findById(new UniqueId(input.gmaId));
      if (!gma) {
        return Result.fail<GMAResponseDTO>('GMA not found');
      }

      return Result.ok<GMAResponseDTO>(GMAMapper.toDTO(gma));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error retrieving GMA details';
      return Result.fail<GMAResponseDTO>(message);
    }
  }
}
