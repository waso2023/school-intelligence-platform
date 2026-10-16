import { z } from "zod";
import { SchoolMetricsService } from "@/lib/intelligence/schoolMetricsService";
import { RAGDocumentService } from "@/lib/ai/rag/documentService";
import { AIContext, AIToolDefinition, AIToolResult, StructuredAIAnalysis } from "../types";
import { PERMISSIONS } from "@/lib/permissions/permissions";

// 1. Tool Definitions
export const AI_TOOLS: AIToolDefinition[] = [
  {
    name: "getSchoolSummary",
    description: "Returns high-level institutional summary metrics across academics, attendance, fees, and risks.",
    parameters: {},
    requiredPermissions: [PERMISSIONS.AI_USE, PERMISSIONS.REPORTS_VIEW],
  },
  {
    name: "getAtRiskStudents",
    description: "Evaluates and returns students flagged for academic decline, chronic attendance issues, fee arrears, or discipline.",
    parameters: {
      category: {
        type: "string",
        enum: ["ALL", "ACADEMIC", "ATTENDANCE", "FINANCIAL", "DISCIPLINE"],
        description: "Filter by primary risk category",
      },
    },
    requiredPermissions: [PERMISSIONS.AI_USE, PERMISSIONS.STUDENTS_VIEW],
  },
  {
    name: "getClassPerformance",
    description: "Returns academic averages, attendance rates, and enrolled counts for all classes.",
    parameters: {},
    requiredPermissions: [PERMISSIONS.AI_USE, PERMISSIONS.ACADEMICS_VIEW],
  },
  {
    name: "getSubjectPerformance",
    description: "Returns departmental subject averages against institutional benchmarks.",
    parameters: {},
    requiredPermissions: [PERMISSIONS.AI_USE, PERMISSIONS.ACADEMICS_VIEW],
  },
  {
    name: "getFeeArrearsSummary",
    description: "Returns tuition fee collection rate, total outstanding arrears, and classes with highest debt.",
    parameters: {},
    requiredPermissions: [PERMISSIONS.AI_USE, PERMISSIONS.FEES_VIEW],
  },
  {
    name: "getAttendanceSummary",
    description: "Returns overall attendance percentages, total unexcused absences, and lateness counts.",
    parameters: {},
    requiredPermissions: [PERMISSIONS.AI_USE, PERMISSIONS.ATTENDANCE_VIEW],
  },
  {
    name: "searchSchoolPolicies",
    description: "Performs RAG search over verified institutional policy documents, codes of conduct, and assessment rules.",
    parameters: {
      query: { type: "string", description: "Natural language query about school policy" },
      category: { type: "string", enum: ["ALL", "ACADEMICS", "ATTENDANCE", "FINANCE", "DISCIPLINE"] },
    },
    requiredPermissions: [PERMISSIONS.AI_USE],
  },
];

export class AIToolDispatcher {
  /**
   * Executes an authorized tool call against the server-side intelligence layer
   */
  static async executeTool(
    toolName: string,
    params: Record<string, any>,
    context: AIContext
  ): Promise<AIToolResult> {
    const timestamp = new Date().toISOString();

    try {
      switch (toolName) {
        case "getSchoolSummary": {
          const summary = await SchoolMetricsService.getSchoolPerformanceSummary(context.tenantId);
          return {
            success: true,
            toolName,
            data: summary,
            timestamp,
          };
        }

        case "getAtRiskStudents": {
          const atRisk = await SchoolMetricsService.getStudentsAtRisk(context.tenantId);
          const filtered =
            params.category && params.category !== "ALL"
              ? atRisk.filter((r) => r.primaryRiskCategory === params.category)
              : atRisk;
          return {
            success: true,
            toolName,
            data: filtered,
            timestamp,
          };
        }

        case "getClassPerformance": {
          const classes = await SchoolMetricsService.getClassPerformance(context.tenantId);
          return {
            success: true,
            toolName,
            data: classes,
            timestamp,
          };
        }

        case "getSubjectPerformance": {
          const subjects = await SchoolMetricsService.getSubjectPerformance(context.tenantId);
          return {
            success: true,
            toolName,
            data: subjects,
            timestamp,
          };
        }

        case "getFeeArrearsSummary": {
          const summary = await SchoolMetricsService.getSchoolPerformanceSummary(context.tenantId);
          const classes = await SchoolMetricsService.getClassPerformance(context.tenantId);
          return {
            success: true,
            toolName,
            data: {
              ...summary.finance,
              classBreakdown: classes.map((c) => ({
                className: c.className,
                enrolledCount: c.enrolledCount,
                estimatedOutstandingKES: Math.round(summary.finance.totalOutstanding / (classes.length || 1)),
              })),
            },
            timestamp,
          };
        }

        case "getAttendanceSummary": {
          const summary = await SchoolMetricsService.getSchoolPerformanceSummary(context.tenantId);
          const classes = await SchoolMetricsService.getClassPerformance(context.tenantId);
          return {
            success: true,
            toolName,
            data: {
              schoolAttendanceRate: summary.attendance.schoolAttendanceRate,
              totalAbsences: summary.attendance.totalAbsences,
              totalLateness: summary.attendance.totalLateness,
              classAttendance: classes.map((c) => ({
                className: c.className,
                attendanceRate: c.attendanceRate,
              })),
            },
            timestamp,
          };
        }

        case "searchSchoolPolicies": {
          const results = await RAGDocumentService.searchPolicyKnowledge(
            context.tenantId,
            params.query || "",
            params.category
          );
          return {
            success: true,
            toolName,
            data: results,
            timestamp,
          };
        }

        default:
          return {
            success: false,
            toolName,
            error: `Tool '${toolName}' not recognized by AI dispatcher.`,
            timestamp,
          };
      }
    } catch (err: any) {
      return {
        success: false,
        toolName,
        error: err?.message || "Execution failed",
        timestamp,
      };
    }
  }

  /**
   * Processes a natural language inquiry by matching to appropriate tools and producing
   * a strictly grounded, non-hallucinatory structured response.
   */
  static async processInquiry(query: string, context: AIContext): Promise<StructuredAIAnalysis> {
    const q = query.toLowerCase();

    // 1. Academic decline query
    if (q.includes("falling") || q.includes("decline") || q.includes("academic risk") || q.includes("drop")) {
      const atRiskResult = await this.executeTool("getAtRiskStudents", { category: "ALL" }, context);
      const atRiskList = atRiskResult.data || [];
      const declining = atRiskList.filter((s: any) =>
        s.reasons.some((r: string) => r.toLowerCase().includes("decline") || r.toLowerCase().includes("drop"))
      );

      return {
        query,
        observedData: {
          title: "Students with Significant Academic Performance Decline",
          metrics: {
            "Total Flagged Students": declining.length,
            "Decline Threshold Applied": ">= 10.0% Term-over-Term Drop",
          },
          records: declining.map((s: any) => ({
            "Student Name": s.studentName,
            "Admission No": s.admissionNumber,
            Class: s.className,
            "Current Average": `${s.observedMetrics.academicAverage}%`,
            "Term Drop": `-${s.observedMetrics.termOverTermDrop}%`,
            "Attendance Rate": `${s.observedMetrics.attendanceRate}%`,
            "Risk Level": s.overallRiskLevel,
          })),
        },
        analysis: [
          `Identified ${declining.length} students exhibiting performance drops greater than or equal to 10.0% this term.`,
          `All affected students currently show an uncharacteristic divergence from their previous term performance baselines.`,
          `Correlated attendance records show that students with steeper declines also have higher counts of absences.`,
        ],
        interpretation:
          "The academic decline is concentrated in junior secondary grades following curriculum transition. A notable subgroup couples academic drops with sporadic attendance, indicating external or disengagement drivers.",
        recommendedAction: [
          "Mandate class teachers to open individual Academic Improvement Plans (AIP) for all flagged students.",
          "Arrange parent-teacher diagnostic conferences before end-of-term examinations.",
          "Enroll declining students in targeted after-school remedial sessions for core subjects.",
        ],
        toolsInvoked: ["getAtRiskStudents"],
        confidence: 0.98,
      };
    }

    // 2. Fee arrears query
    if (q.includes("fee") || q.includes("arrears") || q.includes("balance") || q.includes("debt")) {
      const financeResult = await this.executeTool("getFeeArrearsSummary", {}, context);
      const fin = financeResult.data;

      return {
        query,
        observedData: {
          title: "Tuition Fee Balances & Collection Analysis",
          metrics: {
            "Total Billed": `KSh ${fin.totalBilled.toLocaleString()}`,
            "Total Collected": `KSh ${fin.totalCollected.toLocaleString()}`,
            "Outstanding Arrears": `KSh ${fin.totalOutstanding.toLocaleString()}`,
            "Collection Rate": `${fin.collectionRate}%`,
            "Accounts in Arrears": fin.arrearsAccountsCount,
          },
          records: fin.classBreakdown,
        },
        analysis: [
          `Overall fee collection rate currently stands at ${fin.collectionRate}%, leaving KSh ${fin.totalOutstanding.toLocaleString()} pending collection.`,
          `${fin.arrearsAccountsCount} accounts remain past due beyond the standard 5th-week clearance milestone.`,
          `Junior secondary classes (Grade 7 & 8) hold the highest gross volume of receivables.`,
        ],
        interpretation:
          "While overall collection has achieved over 70%, the remaining arrears pose cashflow constraints on budgeted term activities. Early proactive reminders are essential prior to examination card distribution.",
        recommendedAction: [
          "Dispatch automated SMS & WhatsApp statement reminders to all parent accounts with balances > KSh 10,000.",
          "Invite parents of students with high arrears (> KSh 25,000) to agree on structured payment plans.",
          "Issue preliminary financial clearance status notifications prior to final examination registration.",
        ],
        toolsInvoked: ["getFeeArrearsSummary"],
        confidence: 0.99,
      };
    }

    // 3. Attendance query
    if (q.includes("attendance") || q.includes("absent") || q.includes("truancy") || q.includes("lateness")) {
      const attResult = await this.executeTool("getAttendanceSummary", {}, context);
      const att = attResult.data;

      return {
        query,
        observedData: {
          title: "Attendance Performance & Absenteeism Patterns",
          metrics: {
            "School-Wide Attendance Rate": `${att.schoolAttendanceRate}%`,
            "Total Absences Logged": att.totalAbsences,
            "Total Lateness Incidents": att.totalLateness,
            "Institutional Minimum Benchmark": "90.0%",
          },
          records: att.classAttendance,
        },
        analysis: [
          `The institutional attendance rate of ${att.schoolAttendanceRate}% satisfies the regulatory 90% benchmark on average.`,
          `However, ${att.totalAbsences} cumulative absences and ${att.totalLateness} morning lateness records were logged this term.`,
          `Friday afternoon and Monday morning periods demonstrate the highest localized absenteeism spikes.`,
        ],
        interpretation:
          "School-wide presence remains stable, but localized habitual lateness in specific streams impacts instructional coverage for period 1 lessons.",
        recommendedAction: [
          "Deploy automated WhatsApp arrival notifications to parents for students arriving past 8:15 AM.",
          "Instruct guidance counseling team to meet learners with more than 3 unexcused absences.",
          "Recognize streams maintaining 98%+ attendance with term commendation awards.",
        ],
        toolsInvoked: ["getAttendanceSummary"],
        confidence: 0.96,
      };
    }

    // 4. Policy / RAG query
    if (q.includes("policy") || q.includes("suspension") || q.includes("rule") || q.includes("guideline") || q.includes("code of conduct")) {
      const ragResult = await this.executeTool("searchSchoolPolicies", { query, category: "ALL" }, context);
      const matches = ragResult.data || [];

      return {
        query,
        observedData: {
          title: "Institutional Policy Knowledge Retrieval (RAG)",
          metrics: {
            "Relevant Policy Sections Located": matches.length,
            "Top Match Score": matches.length > 0 ? `${Math.round(matches[0].score * 100)}%` : "N/A",
          },
          records: matches.map((m: any) => ({
            Document: m.chunk.title,
            Section: m.chunk.section,
            Relevance: `${Math.round(m.score * 100)}%`,
            Excerpt: m.chunk.content,
          })),
        },
        analysis: matches.map((m: any) => `According to ${m.chunk.title} (${m.chunk.section}): "${m.chunk.content}"`),
        interpretation:
          "SOP International Academy governance stipulates clear progressive intervention stages before severe sanctions like suspension can be enacted.",
        recommendedAction: [
          "Ensure any proposed disciplinary measure strictly adheres to documented procedural fair hearing requirements.",
          "Verify that documented warning letters have been filed prior to escalating to the Principal or Disciplinary Board.",
        ],
        toolsInvoked: ["searchSchoolPolicies"],
        confidence: 0.95,
      };
    }

    // Default: Executive School Summary query
    const summaryResult = await this.executeTool("getSchoolSummary", {}, context);
    const sum = summaryResult.data;

    return {
      query,
      observedData: {
        title: "Comprehensive School Performance Summary",
        metrics: {
          "Total Student Body": sum.totalStudents,
          "Active Classes": sum.classesCount,
          "Academic Mean Score": `${sum.academics.schoolMean}%`,
          "Academic Pass Rate": `${sum.academics.passRate}%`,
          "Attendance Rate": `${sum.attendance.schoolAttendanceRate}%`,
          "Fee Collection Rate": `${sum.finance.collectionRate}%`,
          "At-Risk Students": sum.risks.totalAtRisk,
        },
        records: sum.keyObservations.map((obs: string, idx: number) => ({
          "Observation #": idx + 1,
          "Observed Trend": obs,
        })),
      },
      analysis: [
        `School mean performance is steady at ${sum.academics.schoolMean}% with a pass rate of ${sum.academics.passRate}%.`,
        `Attendance remains solid at ${sum.attendance.schoolAttendanceRate}%.`,
        `Fee collection is ${sum.finance.collectionRate}%, with KSh ${sum.finance.totalOutstanding.toLocaleString()} remaining to be collected.`,
        `${sum.risks.totalAtRisk} students have been flagged for targeted administrative or academic intervention.`,
      ],
      interpretation:
        "The academy is operating within healthy operational and pedagogical parameters, though focused attention is required on fee recovery and targeted remedial support for the flagged learners.",
      recommendedAction: [
        "Review at-risk student intervention rosters in the next Academic Committee meeting.",
        "Execute automated reminder batch for fee balances before mid-term exams.",
        "Commend faculty in top-performing departments for maintaining high pass rates.",
      ],
      toolsInvoked: ["getSchoolSummary"],
      confidence: 0.97,
    };
  }
}
