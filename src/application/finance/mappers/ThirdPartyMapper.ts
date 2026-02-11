import { ThirdParty } from '../../../domain/finance/entities/ThirdParty';
import { ThirdPartyResponseDTO } from '../dtos/FinanceDTOs';

export class ThirdPartyMapper {
  static toDTO(thirdParty: ThirdParty): ThirdPartyResponseDTO {
    return {
      id: thirdParty.id.value,
      code: thirdParty.code,
      name: thirdParty.name,
      tradeName: thirdParty.tradeName,
      type: thirdParty.type,
      subtype: thirdParty.subtype,
      taxId: thirdParty.taxId,
      idType: thirdParty.idType,
      address: thirdParty.address,
      phone: thirdParty.phone,
      email: thirdParty.email,
      contactPerson: thirdParty.contactPerson,
      rating: thirdParty.rating,
      creditDays: thirdParty.creditDays,
      creditLimit: thirdParty.creditLimit,
      currentBalance: thirdParty.currentBalance,
      active: thirdParty.active,
      observations: thirdParty.observations,
    };
  }
}
