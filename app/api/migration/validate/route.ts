import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { MigrationService } from "@/lib/migration/migrationService";
import { DatasetType, ColumnMapping } from "@/lib/migration/types";

export async function POST(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (tenantCtx.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Spreadsheet validation is strictly restricted to Super Administrators" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { datasetType, csvText, fileBase64, mappings, duplicateStrategy } = body;

    if (!datasetType || (!csvText && !fileBase64)) {
      return NextResponse.json(
        { error: "Dataset type and spreadsheet content (CSV or Excel) are required" },
        { status: 400 }
      );
    }

    const { headers, rows, activeSheet } = fileBase64
      ? MigrationService.parseSpreadsheet(fileBase64, { isBase64: true })
      : MigrationService.parseSpreadsheet(csvText);

    // If mappings not provided, default to 1:1 match by key name
    const effectiveMappings: ColumnMapping[] =
      mappings && mappings.length > 0
        ? mappings
        : headers.map((h) => ({ sourceColumn: h, targetField: h }));

    const validation = MigrationService.validateData(
      datasetType as DatasetType,
      rows,
      effectiveMappings,
      {
        schoolId: tenantCtx.tenantId,
        duplicateStrategy: duplicateStrategy || "SKIP",
      }
    );

    return NextResponse.json({
      success: true,
      headers,
      activeSheet,
      totalParsedRows: rows.length,
      validation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Validation processing failed" },
      { status: 500 }
    );
  }
}
