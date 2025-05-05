/**
 * Type definitions for API requests and responses.
 * These types match the Pydantic models defined in the backend.
 */

/**
 * Represents an account in a profit and loss section.
 */
export interface PnLAccount {
  name: string;
  value: number;
  category?: string;
}

/**
 * Represents a section in a profit and loss report.
 */
export interface PnLSection {
  accounts: PnLAccount[];
  total: number;
}

/**
 * Represents all sections in a profit and loss report.
 */
export interface PnLSections {
  tradingIncome: PnLSection;
  costOfSales?: PnLSection;
  grossProfit: number;
  operatingExpenses: PnLSection;
  netProfit: number;
}

/**
 * Represents metadata for a financial report.
 */
export interface PnLMetadata {
  uploadDate: string;
  source: string;
  currency: string;
}

/**
 * Represents the complete financial data from a profit and loss report.
 */
export interface FinancialData {
  companyName: string;
  period: string;
  basisType: string;
  reportType: string;
  sections: PnLSections;
  metadata: PnLMetadata;
}

/**
 * Represents financial metrics calculated from profit and loss data.
 */
export interface FinancialMetrics {
  gross_margin: number;
  net_margin: number;
  expense_ratio: number;
  cogs_ratio: number;
  [key: string]: number; // Allow for additional metrics
}

/**
 * Represents the response from the metrics endpoint.
 */
export interface MetricsResponse {
  companyName: string;
  period: string;
  financialData: {
    [key: string]: any;
    metrics: FinancialMetrics;
  };
}

/**
 * Represents a request to the insights endpoint.
 */
export interface InsightRequest {
  companyName: string;
  period: string;
  financialData: {
    [key: string]: any;
    metrics?: FinancialMetrics;
  };
}

/**
 * Represents a single financial insight.
 */
export interface FinancialInsight {
  type: string;
  title: string;
  description: string;
  metrics: string[];
  impact: string;
}

/**
 * Represents a single financial recommendation.
 */
export interface FinancialRecommendation {
  title: string;
  description: string;
  expected_impact: string;
  implementation_difficulty: string;
  timeframe: string;
}

/**
 * Represents the complete response from the insights endpoint.
 */
export interface FinancialInsightResponse {
  insights: FinancialInsight[];
  recommendations: FinancialRecommendation[];
  summary: string;
  generated_at: string;
  llm_model: string;
}

/**
 * Represents a request to the chat endpoint.
 */
export interface ChatRequest {
  query: string;
}

/**
 * Represents the response from the chat endpoint.
 */
export interface ChatResponse {
  message: string;
  model: string;
}
