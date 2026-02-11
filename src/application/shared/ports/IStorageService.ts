export interface IStorageService {
  upload(file: Buffer, path: string, contentType: string): Promise<string>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
  getSignedUrl(path: string, expirationMinutes?: number): Promise<string>;
  exists(path: string): Promise<boolean>;
}
