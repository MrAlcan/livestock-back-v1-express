import { GMA } from '../../../domain/senasag/entities/GMA';
import { GMAResponseDTO } from '../dtos/SenasagDTOs';

export class GMAMapper {
  static toDTO(gma: GMA): GMAResponseDTO {
    return {
      id: gma.id.value,
      internalNumber: gma.internalNumber,
      gmaCode: gma.gmaCode,
      temporaryCode: gma.temporaryCode,
      registrarId: gma.registrarId.value,
      originFarmId: gma.originFarmId.value,
      transporterId: gma.transporterId.value,
      destinationId: gma.destinationId.value,
      type: gma.type,
      requestDate: gma.requestDate.toISOString(),
      issueDate: gma.issueDate?.toISOString(),
      expirationDate: gma.expirationDate?.toISOString(),
      actualDepartureDate: gma.actualDepartureDate?.toISOString(),
      estimatedArrivalDate: gma.estimatedArrivalDate?.toISOString(),
      actualArrivalDate: gma.actualArrivalDate?.toISOString(),
      status: gma.status,
      rejectionReason: gma.rejectionReason,
      animalQuantity: gma.animalQuantity,
      estimatedTotalWeight: gma.estimatedTotalWeight,
      actualTotalWeight: gma.actualTotalWeight,
      distanceKm: gma.distanceKm,
      route: gma.route,
      observations: gma.observations,
    };
  }
}
