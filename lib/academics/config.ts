export interface AssessmentWeighting {
  type: string;
  name: string;
  weightPercentage: number;
}

export interface GradeBoundary {
  grade: string;
  min: number;
  max: number;
  points: number;
  remarks: string;
}

export interface AcademicConfigData {
  id?: string;
  schoolId: string;
  curriculum: "CBC" | "Cambridge" | "Dual" | "Custom";
  passMark: number;
  rankingEnabled: boolean;
  attendanceThreshold: number;
  termCount: number;
  assessmentWeightings: AssessmentWeighting[];
  gradeBoundaries: GradeBoundary[];
}

export const DEFAULT_CBC_BOUNDARIES: GradeBoundary[] = [
  { grade: "EE", min: 80, max: 100, points: 4, remarks: "Exceeding Expectations" },
  { grade: "ME", min: 60, max: 79, points: 3, remarks: "Meeting Expectations" },
  { grade: "AE", min: 40, max: 59, points: 2, remarks: "Approaching Expectations" },
  { grade: "BE", min: 0, max: 39, points: 1, remarks: "Below Expectations" },
];

export const DEFAULT_CAMBRIDGE_BOUNDARIES: GradeBoundary[] = [
  { grade: "A*", min: 90, max: 100, points: 8, remarks: "Outstanding" },
  { grade: "A", min: 80, max: 89, points: 7, remarks: "Excellent" },
  { grade: "B", min: 70, max: 79, points: 6, remarks: "Very Good" },
  { grade: "C", min: 60, max: 69, points: 5, remarks: "Good" },
  { grade: "D", min: 50, max: 59, points: 4, remarks: "Satisfactory" },
  { grade: "E", min: 40, max: 49, points: 3, remarks: "Minimum Pass" },
  { grade: "U", min: 0, max: 39, points: 0, remarks: "Ungraded" },
];

export const DEFAULT_ASSESSMENT_WEIGHTINGS: AssessmentWeighting[] = [
  { type: "CAT", name: "Continuous Assessment Tests (CATs)", weightPercentage: 30 },
  { type: "MIDTERM", name: "Mid-Term Examination", weightPercentage: 30 },
  { type: "FINALS", name: "End-of-Term Examination", weightPercentage: 40 },
];

// In-memory tenant store for demonstration / testing fallback
const configsStore: Record<string, AcademicConfigData> = {
  "school-sop-001": {
    schoolId: "school-sop-001",
    curriculum: "Dual",
    passMark: 50.0,
    rankingEnabled: true,
    attendanceThreshold: 90.0,
    termCount: 3,
    assessmentWeightings: [...DEFAULT_ASSESSMENT_WEIGHTINGS],
    gradeBoundaries: [...DEFAULT_CBC_BOUNDARIES],
  },
};

export class AcademicConfigService {
  /**
   * Retrieves academic configuration for a given school tenant
   */
  static async getConfig(schoolId: string): Promise<AcademicConfigData> {
    if (configsStore[schoolId]) {
      return { ...configsStore[schoolId] };
    }

    // Default configuration for new schools
    const defaultConfig: AcademicConfigData = {
      schoolId,
      curriculum: "CBC",
      passMark: 50.0,
      rankingEnabled: true,
      attendanceThreshold: 90.0,
      termCount: 3,
      assessmentWeightings: [...DEFAULT_ASSESSMENT_WEIGHTINGS],
      gradeBoundaries: [...DEFAULT_CBC_BOUNDARIES],
    };

    configsStore[schoolId] = defaultConfig;
    return { ...defaultConfig };
  }

  /**
   * Validates and updates academic configuration for a school tenant
   */
  static async updateConfig(
    schoolId: string,
    updates: Partial<Omit<AcademicConfigData, "schoolId" | "id">>
  ): Promise<{ success: boolean; config?: AcademicConfigData; error?: string }> {
    const current = await this.getConfig(schoolId);

    // Validate weightings total 100% if provided
    if (updates.assessmentWeightings) {
      const totalWeight = updates.assessmentWeightings.reduce(
        (sum, item) => sum + (Number(item.weightPercentage) || 0),
        0
      );
      if (Math.round(totalWeight) !== 100) {
        return {
          success: false,
          error: `Assessment weightings must sum to exactly 100%. Current sum: ${totalWeight}%`,
        };
      }
    }

    // Validate boundaries if provided
    if (updates.gradeBoundaries && updates.gradeBoundaries.length === 0) {
      return {
        success: false,
        error: "At least one grade boundary must be defined.",
      };
    }

    const updated: AcademicConfigData = {
      ...current,
      ...updates,
      schoolId,
    };

    configsStore[schoolId] = updated;
    return {
      success: true,
      config: updated,
    };
  }
}
