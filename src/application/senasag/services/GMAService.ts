import { Result } from '../../../domain/shared/Result';
import { IGMARepository } from '../../../domain/senasag/repositories/IGMARepository';
import { IRegulatoryDocumentRepository } from '../../../domain/senasag/repositories/IRegulatoryDocumentRepository';
import { GMAValidationService, GMAValidationResult } from '../../../domain/senasag/services';
import { IEventBus } from '../../shared/ports/IEventBus';
import { CreateGMAInputDTO, ApproveGMAInputDTO, RejectGMAInputDTO, MarkGMAInTransitInputDTO, CloseGMAInputDTO, AddAnimalToGMAInputDTO, GMAFiltersInputDTO, GMAResponseDTO } from '../dtos/SenasagDTOs';
import { PaginationInputDTO } from '../../shared/dtos/PaginationDTO';
import { GMAMapper } from '../mappers/GMAMapper';
import { CreateGMA } from '../use-cases/CreateGMA';
import { ApproveGMA } from '../use-cases/ApproveGMA';
import { RejectGMA } from '../use-cases/RejectGMA';
import { MarkGMAInTransit } from '../use-cases/MarkGMAInTransit';
import { CloseGMA } from '../use-cases/CloseGMA';
import { GetGMADetails } from '../use-cases/GetGMADetails';
import { ListGMAs } from '../use-cases/ListGMAs';
import { AddAnimalToGMA } from '../use-cases/AddAnimalToGMA';
import { GetGMAAnimals } from '../use-cases/GetGMAAnimals';

export class GMAService {
  private readonly createGMAUseCase: CreateGMA;
  private readonly approveGMAUseCase: ApproveGMA;
  private readonly rejectGMAUseCase: RejectGMA;
  private readonly markGMAInTransitUseCase: MarkGMAInTransit;
  private readonly closeGMAUseCase: CloseGMA;
  private readonly getGMADetailsUseCase: GetGMADetails;
  private readonly listGMAsUseCase: ListGMAs;
  private readonly addAnimalToGMAUseCase: AddAnimalToGMA;
  private readonly getGMAAnimalsUseCase: GetGMAAnimals;

  constructor(
    private readonly gmaRepository: IGMARepository,
    private readonly regulatoryDocumentRepository: IRegulatoryDocumentRepository,
    private readonly eventBus: IEventBus,
    private readonly gmaValidationService: GMAValidationService,
  ) {
    this.createGMAUseCase = new CreateGMA(gmaRepository, regulatoryDocumentRepository, eventBus);
    this.approveGMAUseCase = new ApproveGMA(gmaRepository, eventBus);
    this.rejectGMAUseCase = new RejectGMA(gmaRepository, eventBus);
    this.markGMAInTransitUseCase = new MarkGMAInTransit(gmaRepository, eventBus);
    this.closeGMAUseCase = new CloseGMA(gmaRepository, eventBus);
    this.getGMADetailsUseCase = new GetGMADetails(gmaRepository);
    this.listGMAsUseCase = new ListGMAs(gmaRepository);
    this.addAnimalToGMAUseCase = new AddAnimalToGMA(gmaRepository);
    this.getGMAAnimalsUseCase = new GetGMAAnimals(gmaRepository);
  }

  async createGMA(input: CreateGMAInputDTO): Promise<Result<GMAResponseDTO>> {
    return this.createGMAUseCase.execute(input);
  }

  async approveGMA(input: ApproveGMAInputDTO): Promise<Result<GMAResponseDTO>> {
    return this.approveGMAUseCase.execute(input);
  }

  async rejectGMA(input: RejectGMAInputDTO): Promise<Result<GMAResponseDTO>> {
    return this.rejectGMAUseCase.execute(input);
  }

  async markGMAInTransit(input: MarkGMAInTransitInputDTO): Promise<Result<GMAResponseDTO>> {
    return this.markGMAInTransitUseCase.execute(input);
  }

  async closeGMA(input: CloseGMAInputDTO): Promise<Result<GMAResponseDTO>> {
    return this.closeGMAUseCase.execute(input);
  }

  async getGMADetails(gmaId: string): Promise<Result<GMAResponseDTO>> {
    return this.getGMADetailsUseCase.execute({ gmaId });
  }

  async listGMAs(filters: GMAFiltersInputDTO, pagination?: PaginationInputDTO): Promise<Result<GMAResponseDTO[]>> {
    return this.listGMAsUseCase.execute({ filters, pagination });
  }

  async addAnimalToGMA(input: AddAnimalToGMAInputDTO): Promise<Result<void>> {
    return this.addAnimalToGMAUseCase.execute(input);
  }

  async getGMAAnimals(gmaId: string): Promise<Result<GMAResponseDTO>> {
    return this.getGMAAnimalsUseCase.execute({ gmaId });
  }

  async validateGMAAnimals(animalIds: string[]): Promise<Result<GMAValidationResult>> {
    try {
      const items = this.gmaValidationService.validateAnimalIds(animalIds);
      const globalErrors: string[] = [];

      const hasInvalidAnimals = items.some(item => !item.isValid);
      if (hasInvalidAnimals) {
        globalErrors.push('One or more animals did not pass GMA validation');
      }

      const result: GMAValidationResult = {
        isValid: !hasInvalidAnimals,
        items,
        globalErrors,
      };

      return Result.ok<GMAValidationResult>(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error validating GMA animals';
      return Result.fail<GMAValidationResult>(message);
    }
  }

  async getPendingApproval(): Promise<Result<GMAResponseDTO[]>> {
    try {
      const gmas = await this.gmaRepository.findPendingApproval();
      const dtos = gmas.map(GMAMapper.toDTO);
      return Result.ok<GMAResponseDTO[]>(dtos);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error retrieving pending GMAs';
      return Result.fail<GMAResponseDTO[]>(message);
    }
  }

  async getInTransit(): Promise<Result<GMAResponseDTO[]>> {
    try {
      const gmas = await this.gmaRepository.findInTransit();
      const dtos = gmas.map(GMAMapper.toDTO);
      return Result.ok<GMAResponseDTO[]>(dtos);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error retrieving in-transit GMAs';
      return Result.fail<GMAResponseDTO[]>(message);
    }
  }
}
