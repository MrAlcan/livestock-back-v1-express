export interface IMapper<TDomain, TDTO> {
  toDTO(domain: TDomain): TDTO;
  toDomain?(dto: TDTO): TDomain;
}
