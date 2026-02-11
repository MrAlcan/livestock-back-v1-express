export interface IPDFGeneratorService {
  generate(template: string, data: Record<string, unknown>): Promise<Buffer>;
  generateFromHtml(html: string): Promise<Buffer>;
}
