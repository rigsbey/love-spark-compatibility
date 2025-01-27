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
  description?: string;
  compatibilityType?: 'excellent' | 'good' | 'moderate' | 'challenging';
  categoryScores?: {
    attachment: number;
    loveLanguages: number;
    trust: number;
    values: number;
    communication: number;
    emotional: number;
    independence: number;
    future: number;
  };
}