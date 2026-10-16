import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { MigrationService } from "@/lib/migration/migrationService";
import { DatasetType } from "@/lib/migration/types";
import { logAuditEvent } from "@/lib/audit/auditLogger";

export async function POST(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (tenantCtx.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Import operations are strictly restricted to Super Administrators" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { datasetType, fileName, validRows, duplicateStrategy, fileSize } = body;

    if (!datasetType || !Array.isArray(validRows)) {
      return NextResponse.json(
        { error: "Invalid payload: datasetType and validRows array required" },
        { status: 400 }
      );
    }

    const importResult = await MigrationService.executeImport(
      tenantCtx.tenantId,
      datasetType as DatasetType,
      fileName || "upload.csv",
      validRows,
      { duplicateStrategy, fileSize }
    );

    // Record audit event
    await logAuditEvent({
      schoolId: tenantCtx.tenantId,
      userId: tenantCtx.user.id,
      userName: tenantCtx.user.name,
      role: tenantCtx.user.role,
      action: "DATA_MIGRATION_COMPLETED",
      entity: "DataImportLog",
      entityId: importResult.importId,
      details: `Successfully imported ${importResult.importedCount} records for dataset ${datasetType} from file ${fileName}`,
    });

    return NextResponse.json({
      success: true,
      result: importResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Import execution failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (tenantCtx.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Migration history is strictly restricted to Super Administrators" },
        { status: 403 }
      );
    }

    const history = MigrationService.getImportHistory(tenantCtx.tenantId);
    return NextResponse.json({ success: true, history });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch import history" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (tenantCtx.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Rollback operations are strictly restricted to Super Administrators" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const importId = searchParams.get("importId");

    if (!importId) {
      return NextResponse.json({ error: "importId query parameter is required" }, { status: 400 });
    }

    const rollbackResult = MigrationService.rollbackImport(importId, tenantCtx.tenantId);

    // Log audit event for rollback
    await logAuditEvent({
      schoolId: tenantCtx.tenantId,
      userId: tenantCtx.user.id,
      userName: tenantCtx.user.name,
      role: tenantCtx.user.role,
      action: "DATA_MIGRATION_ROLLBACK",
      entity: "DataImportLog",
      entityId: importId,
      details: rollbackResult.message,
    });

    return NextResponse.json({ success: true, result: rollbackResult });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Rollback failed" },
      { status: 500 }
    );
  }
}
