import { promises as fs } from 'fs';
import path from 'path';
import { IStorageService } from '../../application/shared/ports/IStorageService';
import { Logger } from '../logging/logger.service';
import { getStorageConfig } from '../config/storage.config';

export class LocalStorageAdapter implements IStorageService {
  private readonly logger: Logger;
  private readonly uploadDir: string;

  constructor() {
    this.logger = new Logger('LocalStorageAdapter');
    const config = getStorageConfig();
    this.uploadDir = path.resolve(config.localPath);
  }

  async upload(file: Buffer, filePath: string, contentType: string): Promise<string> {
    const fullPath = path.join(this.uploadDir, filePath);
    const directory = path.dirname(fullPath);

    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(fullPath, file);

    this.logger.info(`File uploaded: ${filePath}`, { contentType, size: file.length });
    return filePath;
  }

  async download(filePath: string): Promise<Buffer> {
    const fullPath = path.join(this.uploadDir, filePath);

    try {
      const buffer = await fs.readFile(fullPath);
      return buffer;
    } catch (error) {
      this.logger.error(`File download failed: ${filePath}`, error);
      throw new Error(`File not found: ${filePath}`);
    }
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(this.uploadDir, filePath);

    try {
      await fs.unlink(fullPath);
      this.logger.info(`File deleted: ${filePath}`);
    } catch (error) {
      this.logger.error(`File deletion failed: ${filePath}`, error);
      throw new Error(`Failed to delete file: ${filePath}`);
    }
  }

  async getSignedUrl(filePath: string, _expirationMinutes?: number): Promise<string> {
    // For local storage, return a static URL path
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/${filePath}`;
  }

  async exists(filePath: string): Promise<boolean> {
    const fullPath = path.join(this.uploadDir, filePath);

    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}
