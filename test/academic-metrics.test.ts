import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateMeanScore,
  calculateMedianScore,
  calculatePassRate,
  calculateWeightedScore,
  calculateGradeDistribution,
} from "../lib/intelligence/metrics/academicMetrics";

describe("Academic Metrics & Grading Engine", () => {
  it("should calculate correct mean score for cohorts", () => {
    const scores = [80, 70, 90, 60];
    const mean = calculateMeanScore(scores);
    assert.equal(mean, 75.0);
  });

  it("should handle empty scores gracefully", () => {
    assert.equal(calculateMeanScore([]), 0);
    assert.equal(calculateMedianScore([]), 0);
  });

  it("should calculate median score for even and odd counts", () => {
    assert.equal(calculateMedianScore([50, 70, 90]), 70);
    assert.equal(calculateMedianScore([50, 60, 80, 90]), 70);
  });

  it("should calculate pass rate accurately based on threshold", () => {
    const scores = [45, 55, 65, 75, 40]; // 3 passed >= 50, 2 failed
    const passRate = calculatePassRate(scores, 50);
    assert.equal(passRate, 60.0);
  });

  it("should calculate weighted continuous assessment score correctly", () => {
    // Continuous Assessment Tests 30%, Mid-Term 30%, End-of-Term Finals 40%
    const weighted = calculateWeightedScore({
      catScore: 80,   // 80 * 0.3 = 24
      midScore: 70,   // 70 * 0.3 = 21
      finalScore: 90, // 90 * 0.4 = 36 => 24 + 21 + 36 = 81.0
    });
    assert.equal(weighted, 81.0);
  });

  it("should correctly partition scores into CBC performance bands", () => {
    const scores = [85, 72, 58, 42];
    const dist = calculateGradeDistribution(scores);

    assert.equal(dist["A"], 1); // 85 >= 80
    assert.equal(dist["B+"], 1); // 72 in [70, 74]
    assert.equal(dist["C+"], 1); // 58 in [55, 59]
    assert.equal(dist["D+"], 1); // 42 in [40, 44]
  });
});
