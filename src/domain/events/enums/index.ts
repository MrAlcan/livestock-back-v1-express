export enum EventCategory {
  INVENTORY = 'INVENTORY',
  HEALTH = 'HEALTH',
  REPRODUCTION = 'REPRODUCTION',
  MANAGEMENT = 'MANAGEMENT',
  MOVEMENT = 'MOVEMENT',
  FINANCIAL = 'FINANCIAL',
}

export enum BirthType {
  NATURAL = 'NATURAL',
  ASSISTED = 'ASSISTED',
  CESAREAN = 'CESAREAN',
}

export enum BirthDifficulty {
  EASY = 'EASY',
  MODERATE = 'MODERATE',
  DIFFICULT = 'DIFFICULT',
}

export enum Vitality {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  WEAK = 'WEAK',
  PERINATAL_DEATH = 'PERINATAL_DEATH',
}

export enum WeighingType {
  MANUAL = 'MANUAL',
  DIGITAL_SCALE = 'DIGITAL_SCALE',
  ESTIMATED = 'ESTIMATED',
}

export enum AdministrationRoute {
  INTRAMUSCULAR = 'INTRAMUSCULAR',
  SUBCUTANEOUS = 'SUBCUTANEOUS',
  ORAL = 'ORAL',
  TOPICAL = 'TOPICAL',
  INTRAVENOUS = 'INTRAVENOUS',
}

export enum TreatmentResult {
  SUCCESSFUL = 'SUCCESSFUL',
  PARTIAL = 'PARTIAL',
  NO_EFFECT = 'NO_EFFECT',
  PENDING = 'PENDING',
}

export enum MovementType {
  LOT = 'LOT',
  PADDOCK = 'PADDOCK',
  BOTH = 'BOTH',
}

export enum ServiceType {
  NATURAL_BREEDING = 'NATURAL_BREEDING',
  ARTIFICIAL_INSEMINATION = 'ARTIFICIAL_INSEMINATION',
  EMBRYO_TRANSFER = 'EMBRYO_TRANSFER',
}

export enum ReproductionResult {
  PREGNANT = 'PREGNANT',
  EMPTY = 'EMPTY',
  SERVICED = 'SERVICED',
  PENDING = 'PENDING',
}

export enum DiagnosisMethod {
  PALPATION = 'PALPATION',
  ULTRASOUND = 'ULTRASOUND',
  LAB_TEST = 'LAB_TEST',
}

export enum DeathCategory {
  DISEASE = 'DISEASE',
  ACCIDENT = 'ACCIDENT',
  PREDATOR = 'PREDATOR',
  NATURAL = 'NATURAL',
  SACRIFICE = 'SACRIFICE',
  UNKNOWN = 'UNKNOWN',
}

export enum IdentificationType {
  BRAND = 'BRAND',
  EARRING = 'EARRING',
  TAG = 'TAG',
  EID = 'EID',
  TATTOO = 'TATTOO',
}

export enum WeaningType {
  EARLY = 'EARLY',
  NORMAL = 'NORMAL',
  LATE = 'LATE',
}

export enum SaleType {
  LIVE = 'LIVE',
  CARCASS = 'CARCASS',
  SLAUGHTERED = 'SLAUGHTERED',
}
