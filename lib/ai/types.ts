import { z } from "zod";

export interface AIContext {
  tenantId: string;
  userId: string;
  userName: string;
  userRole: string;
  permissions: string[];
}

export interface AIToolParameter {
  name: string;
  type: "string" | "number" | "boolean" | "array";
  description: string;
  required: boolean;
}

export interface AIToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  requiredPermissions: string[];
}

export interface AIToolResult<T = any> {
  success: boolean;
  toolName: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface StructuredAIAnalysis {
  query: string;
  observedData: {
    title: string;
    metrics: Record<string, any>;
    records?: any[];
  };
  analysis: string[];
  interpretation: string;
  recommendedAction: string[];
  toolsInvoked: string[];
  confidence: number;
}
