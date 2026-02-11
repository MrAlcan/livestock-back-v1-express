export interface ISequenceProvider {
  getNextSequenceNumber(): Promise<bigint>;
}

export class EventSequencerService {
  constructor(private readonly sequenceProvider: ISequenceProvider) {}

  async getNextSequenceNumber(): Promise<bigint> {
    return this.sequenceProvider.getNextSequenceNumber();
  }
}
