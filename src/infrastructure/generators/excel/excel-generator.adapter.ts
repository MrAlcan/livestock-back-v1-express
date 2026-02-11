import ExcelJS from 'exceljs';
import { IExcelGeneratorService, ExcelColumn } from '../../../application/shared/ports/IExcelGeneratorService';
import { Logger } from '../../logging/logger.service';

export class ExcelGeneratorAdapter implements IExcelGeneratorService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger('ExcelGeneratorAdapter');
  }

  async generate(
    columns: ExcelColumn[],
    data: Record<string, unknown>[],
    sheetName?: string,
  ): Promise<Buffer> {
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'SGG - Sistema de Gestion Ganadera';
      workbook.created = new Date();

      this.addSheet(workbook, sheetName ?? 'Datos', columns, data);

      const buffer = await workbook.xlsx.writeBuffer();
      this.logger.info('Excel file generated', { rows: data.length, sheet: sheetName ?? 'Datos' });
      return Buffer.from(buffer);
    } catch (error) {
      this.logger.error('Excel generation failed', error);
      throw error;
    }
  }

  async generateMultiSheet(
    sheets: { name: string; columns: ExcelColumn[]; data: Record<string, unknown>[] }[],
  ): Promise<Buffer> {
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'SGG - Sistema de Gestion Ganadera';
      workbook.created = new Date();

      for (const sheet of sheets) {
        this.addSheet(workbook, sheet.name, sheet.columns, sheet.data);
      }

      const buffer = await workbook.xlsx.writeBuffer();
      this.logger.info('Multi-sheet Excel file generated', {
        sheets: sheets.map((s) => s.name),
        totalRows: sheets.reduce((acc, s) => acc + s.data.length, 0),
      });
      return Buffer.from(buffer);
    } catch (error) {
      this.logger.error('Multi-sheet Excel generation failed', error);
      throw error;
    }
  }

  private addSheet(
    workbook: ExcelJS.Workbook,
    name: string,
    columns: ExcelColumn[],
    data: Record<string, unknown>[],
  ): void {
    const worksheet = workbook.addWorksheet(name);

    worksheet.columns = columns.map((col) => ({
      header: col.header,
      key: col.key,
      width: col.width ?? 20,
    }));

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2D6A4F' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Add data rows
    for (const row of data) {
      worksheet.addRow(row);
    }

    // Auto-filter
    if (data.length > 0) {
      worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: columns.length },
      };
    }
  }
}
