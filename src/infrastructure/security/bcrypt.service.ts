import bcrypt from 'bcrypt';
import { IPasswordHasher } from '../../application/shared/ports/IPasswordHasher';
import { Logger } from '../logging/logger.service';

export class BcryptService implements IPasswordHasher {
  private readonly logger: Logger;
  private readonly saltRounds: number;

  constructor() {
    this.logger = new Logger('BcryptService');
    this.saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '10');
  }

  async hash(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      this.logger.error('Error hashing password', error);
      throw new Error('Failed to hash password');
    }
  }

  async compare(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      this.logger.error('Error comparing password', error);
      return false;
    }
  }
}
