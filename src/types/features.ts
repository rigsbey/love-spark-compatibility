export interface FeatureFlags {
  isPremium: boolean;
  hasExtendedTest: boolean;
  hasHistory: boolean;
  hasCustomReports: boolean;
  hasDailyPredictions: boolean;
}

export interface TestResult {
  compatibility: number;
  strengths: string[];
  growthAreas: string[];
  premiumInsights?: string[];
}