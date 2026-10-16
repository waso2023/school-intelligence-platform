export type DatasetType = "STUDENTS" | "STAFF" | "ATTENDANCE" | "GRADES" | "FEES";

export interface ColumnDefinition {
  key: string;
  label: string;
  required: boolean;
  type: "string" | "number" | "date" | "enum";
  enumValues?: string[];
  description: string;
  sampleValue: string;
}

export interface DatasetSchema {
  type: DatasetType;
  title: string;
  description: string;
  columns: ColumnDefinition[];
  sampleCsv: string;
}

export interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
}

export type DuplicateStrategy = "SKIP" | "UPDATE" | "REJECT";

export interface ValidationError {
  rowNumber: number;
  field: string;
  value: any;
  message: string;
  severity: "error" | "warning";
  code?: string;
}

export interface MigrationValidationResult {
  totalRows: number;
  validRowsCount: number;
  warningRowsCount: number;
  errorRowsCount: number;
  skippedDuplicatesCount?: number;
  errors: ValidationError[];
  previewRows: Record<string, any>[];
}

export interface MigrationImportResult {
  importId: string;
  datasetType: DatasetType;
  fileName: string;
  totalRows: number;
  importedCount: number;
  updatedCount?: number;
  skippedCount: number;
  warningsCount: number;
  errorsCount: number;
  status: "COMPLETED" | "PARTIAL" | "FAILED" | "ROLLED_BACK";
  createdEntityIds?: string[];
  timestamp: string;
}

export interface DataImportBatchLog {
  importId: string;
  schoolId: string;
  datasetType: DatasetType;
  fileName: string;
  fileSize?: number;
  totalRows: number;
  importedCount: number;
  updatedCount: number;
  skippedCount: number;
  errorsCount: number;
  status: "COMPLETED" | "PARTIAL" | "FAILED" | "ROLLED_BACK";
  createdEntityIds: string[];
  timestamp: string;
}
