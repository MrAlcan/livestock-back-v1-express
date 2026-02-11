import { Result } from '../../../domain/shared/Result';
import { IEventRepository } from '../../../domain/events/repositories/IEventRepository';
import { IEventTypeRepository } from '../../../domain/events/repositories/IEventTypeRepository';
import { ADGCalculatorService } from '../../../domain/events/services/ADGCalculatorService';
import { EstimatedBirthDateCalculatorService } from '../../../domain/events/services/EstimatedBirthDateCalculatorService';
import {
  RegisterEventBirthInputDTO,
  RegisterEventDeathInputDTO,
  RegisterEventHealthInputDTO,
  RegisterEventMovementInputDTO,
  RegisterEventWeighingInputDTO,
  RegisterEventReproductionInputDTO,
  RegisterEventSaleInputDTO,
  RegisterEventPurchaseInputDTO,
  RegisterEventWeaningInputDTO,
  RegisterEventIdentificationInputDTO,
  EventResponseDTO,
  EventBirthResponseDTO,
  EventWeighingResponseDTO,
  EventReproductionResponseDTO,
} from '../dtos/EventDTOs';
import { RegisterEventBirth } from '../use-cases/RegisterEventBirth';
import { RegisterEventDeath } from '../use-cases/RegisterEventDeath';
import { RegisterEventHealth } from '../use-cases/RegisterEventHealth';
import { RegisterEventMovement } from '../use-cases/RegisterEventMovement';
import { RegisterEventWeighing } from '../use-cases/RegisterEventWeighing';
import { RegisterEventReproduction } from '../use-cases/RegisterEventReproduction';
import { RegisterEventSale } from '../use-cases/RegisterEventSale';
import { RegisterEventPurchase } from '../use-cases/RegisterEventPurchase';
import { RegisterEventWeaning } from '../use-cases/RegisterEventWeaning';
import { RegisterEventIdentification } from '../use-cases/RegisterEventIdentification';

export class EventManagementService {
  private readonly registerBirth: RegisterEventBirth;
  private readonly registerDeath: RegisterEventDeath;
  private readonly registerHealth: RegisterEventHealth;
  private readonly registerMovement: RegisterEventMovement;
  private readonly registerWeighing: RegisterEventWeighing;
  private readonly registerReproduction: RegisterEventReproduction;
  private readonly registerSale: RegisterEventSale;
  private readonly registerPurchase: RegisterEventPurchase;
  private readonly registerWeaning: RegisterEventWeaning;
  private readonly registerIdentification: RegisterEventIdentification;

  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly eventTypeRepository: IEventTypeRepository,
    private readonly adgCalculator: ADGCalculatorService,
    private readonly birthDateCalculator: EstimatedBirthDateCalculatorService,
  ) {
    this.registerBirth = new RegisterEventBirth(eventRepository);
    this.registerDeath = new RegisterEventDeath(eventRepository);
    this.registerHealth = new RegisterEventHealth(eventRepository);
    this.registerMovement = new RegisterEventMovement(eventRepository);
    this.registerWeighing = new RegisterEventWeighing(eventRepository, adgCalculator);
    this.registerReproduction = new RegisterEventReproduction(eventRepository, birthDateCalculator);
    this.registerSale = new RegisterEventSale(eventRepository);
    this.registerPurchase = new RegisterEventPurchase(eventRepository);
    this.registerWeaning = new RegisterEventWeaning(eventRepository);
    this.registerIdentification = new RegisterEventIdentification(eventRepository);
  }

  async registerBirthEvent(input: RegisterEventBirthInputDTO): Promise<Result<EventBirthResponseDTO>> {
    const eventType = await this.eventTypeRepository.findByCode(input.eventType);
    if (!eventType) {
      return Result.fail<EventBirthResponseDTO>(`Event type '${input.eventType}' not found`);
    }
    if (!eventType.active) {
      return Result.fail<EventBirthResponseDTO>(`Event type '${input.eventType}' is not active`);
    }
    return this.registerBirth.execute(input);
  }

  async registerDeathEvent(input: RegisterEventDeathInputDTO): Promise<Result<EventResponseDTO>> {
    const eventType = await this.eventTypeRepository.findByCode(input.eventType);
    if (!eventType) {
      return Result.fail<EventResponseDTO>(`Event type '${input.eventType}' not found`);
    }
    if (!eventType.active) {
      return Result.fail<EventResponseDTO>(`Event type '${input.eventType}' is not active`);
    }
    return this.registerDeath.execute(input);
  }

  async registerHealthEvent(input: RegisterEventHealthInputDTO): Promise<Result<EventResponseDTO>> {
    const eventType = await this.eventTypeRepository.findByCode(input.eventType);
    if (!eventType) {
      return Result.fail<EventResponseDTO>(`Event type '${input.eventType}' not found`);
    }
    if (!eventType.active) {
      return Result.fail<EventResponseDTO>(`Event type '${input.eventType}' is not active`);
    }
    return this.registerHealth.execute(input);
  }

  async registerMovementEvent(input: RegisterEventMovementInputDTO): Promise<Result<EventResponseDTO>> {
    const eventType = await this.eventTypeRepository.findByCode(input.eventType);
    if (!eventType) {
      return Result.fail<EventResponseDTO>(`Event type '${input.eventType}' not found`);
    }
    if (!eventType.active) {
      return Result.fail<EventResponseDTO>(`Event type '${input.eventType}' is not active`);
    }
    return this.registerMovement.execute(input);
  }

  async registerWeighingEvent(input: RegisterEventWeighingInputDTO): Promise<Result<EventWeighingResponseDTO>> {
    const eventType = await this.eventTypeRepository.findByCode(input.eventType);
    if (!eventType) {
      return Result.fail<EventWeighingResponseDTO>(`Event type '${input.eventType}' not found`);
    }
    if (!eventType.active) {
      return Result.fail<EventWeighingResponseDTO>(`Event type '${input.eventType}' is not active`);
    }
    return this.registerWeighing.execute(input);
  }

  async registerReproductionEvent(input: RegisterEventReproductionInputDTO): Promise<Result<EventReproductionResponseDTO>> {
    const eventType = await this.eventTypeRepository.findByCode(input.eventType);
    if (!eventType) {
      return Result.fail<EventReproductionResponseDTO>(`Event type '${input.eventType}' not found`);
    }
    if (!eventType.active) {
      return Result.fail<EventReproductionResponseDTO>(`Event type '${input.eventType}' is not active`);
    }
    return this.registerReproduction.execute(input);
  }

  async registerSaleEvent(input: RegisterEventSaleInputDTO): Promise<Result<EventResponseDTO>> {
    const eventType = await this.eventTypeRepository.findByCode(input.eventType);
    if (!eventType) {
      return Result.fail<EventResponseDTO>(`Event type '${input.eventType}' not found`);
    }
    if (!eventType.active) {
      return Result.fail<EventResponseDTO>(`Event type '${input.eventType}' is not active`);
    }
    return this.registerSale.execute(input);
  }

  async registerPurchaseEvent(input: RegisterEventPurchaseInputDTO): Promise<Result<EventResponseDTO>> {
    const eventType = await this.eventTypeRepository.findByCode(input.eventType);
    if (!eventType) {
      return Result.fail<EventResponseDTO>(`Event type '${input.eventType}' not found`);
    }
    if (!eventType.active) {
      return Result.fail<EventResponseDTO>(`Event type '${input.eventType}' is not active`);
    }
    return this.registerPurchase.execute(input);
  }

  async registerWeaningEvent(input: RegisterEventWeaningInputDTO): Promise<Result<EventResponseDTO>> {
    const eventType = await this.eventTypeRepository.findByCode(input.eventType);
    if (!eventType) {
      return Result.fail<EventResponseDTO>(`Event type '${input.eventType}' not found`);
    }
    if (!eventType.active) {
      return Result.fail<EventResponseDTO>(`Event type '${input.eventType}' is not active`);
    }
    return this.registerWeaning.execute(input);
  }

  async registerIdentificationEvent(input: RegisterEventIdentificationInputDTO): Promise<Result<EventResponseDTO>> {
    const eventType = await this.eventTypeRepository.findByCode(input.eventType);
    if (!eventType) {
      return Result.fail<EventResponseDTO>(`Event type '${input.eventType}' not found`);
    }
    if (!eventType.active) {
      return Result.fail<EventResponseDTO>(`Event type '${input.eventType}' is not active`);
    }
    return this.registerIdentification.execute(input);
  }
}
