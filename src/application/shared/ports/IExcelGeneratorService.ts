export interface ExcelColumn {
  readonly header: string;
  readonly key: string;
  readonly width?: number;
}

export interface IExcelGeneratorService {
  generate(columns: ExcelColumn[], data: Record<string, unknown>[], sheetName?: string): Promise<Buffer>;
  generateMultiSheet(sheets: { name: string; columns: ExcelColumn[]; data: Record<string, unknown>[] }[]): Promise<Buffer>;
}
