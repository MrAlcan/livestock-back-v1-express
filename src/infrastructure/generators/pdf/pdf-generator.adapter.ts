import Handlebars from 'handlebars';
import { promises as fs } from 'fs';
import path from 'path';
import { IPDFGeneratorService } from '../../../application/shared/ports/IPDFGeneratorService';
import { Logger } from '../../logging/logger.service';

/**
 * PDF Generator Adapter
 *
 * Lightweight implementation that generates PDF-ready HTML content as a Buffer.
 * For production use, install puppeteer or pdfkit and replace the generateFromHtml method
 * with actual PDF rendering logic.
 *
 * Current behavior:
 * - generate(): Compiles a Handlebars template with data and returns HTML as Buffer
 * - generateFromHtml(): Wraps HTML in a complete document and returns as Buffer
 */
export class PDFGeneratorAdapter implements IPDFGeneratorService {
  private readonly logger: Logger;
  private readonly templateCache: Map<string, Handlebars.TemplateDelegate>;

  constructor() {
    this.logger = new Logger('PDFGeneratorAdapter');
    this.templateCache = new Map();
  }

  async generate(template: string, data: Record<string, unknown>): Promise<Buffer> {
    try {
      const compiled = await this.loadTemplate(template);
      const html = compiled(data);
      return this.generateFromHtml(html);
    } catch (error) {
      this.logger.error(`PDF generation failed for template: ${template}`, error);
      throw error;
    }
  }

  async generateFromHtml(html: string): Promise<Buffer> {
    try {
      const fullHtml = this.wrapHtml(html);
      this.logger.debug('PDF generated from HTML', { size: fullHtml.length });
      return Buffer.from(fullHtml, 'utf-8');
    } catch (error) {
      this.logger.error('PDF generation from HTML failed', error);
      throw error;
    }
  }

  private async loadTemplate(name: string): Promise<Handlebars.TemplateDelegate> {
    const cached = this.templateCache.get(name);
    if (cached) {
      return cached;
    }

    const templatePath = path.join(__dirname, 'templates', `${name}.hbs`);
    try {
      const source = await fs.readFile(templatePath, 'utf-8');
      const compiled = Handlebars.compile(source);
      this.templateCache.set(name, compiled);
      return compiled;
    } catch (error) {
      this.logger.error(`Failed to load PDF template: ${name}`, error);
      throw new Error(`PDF template not found: ${name}`);
    }
  }

  private wrapHtml(content: string): string {
    // If the content already has a full HTML structure, return as-is
    if (content.trim().toLowerCase().startsWith('<!doctype') || content.trim().toLowerCase().startsWith('<html')) {
      return content;
    }

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 20px;
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #2d6a4f;
      color: white;
    }
    h1, h2, h3 {
      color: #2d6a4f;
    }
  </style>
</head>
<body>
${content}
</body>
</html>`;
  }
}
