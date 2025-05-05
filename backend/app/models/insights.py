from datetime import datetime
from typing import Any, Dict, List
from pydantic import BaseModel, Field, field_validator
from app.core.config import settings


class InsightRequest(BaseModel):
    """Model for insight request data."""

    companyName: str = Field(..., description="Name of the company")
    period: str = Field(..., description="Financial period (e.g., 'Q1 2025')")
    financialData: dict[str, Any] = Field(
        ..., description="Financial data from the profit and loss report"
    )

class ChatRequest(BaseModel):
    """Model for chat request."""
    query: str = Field(..., description="The question or prompt to send to the LLM")

class FinancialInsightRequest(BaseModel):
    """Model for financial insight request data."""
    company_name: str = Field(..., description="Name of the company")
    period: str = Field(..., description="Financial period (e.g., 'Q1 2025')")
    financial_data: Dict[str, Any] = Field(..., description="Financial data and metrics")

    @field_validator("financial_data")
    @classmethod
    def validate_financial_data(cls, v):
        """Validate that the financial data contains required fields."""
        required_fields = ["sections", "metrics"]
        for field in required_fields:
            if field not in v:
                raise ValueError(f"Financial data must contain '{field}'")
        return v


class FinancialInsight(BaseModel):
    """Model for a single financial insight."""
    type: str = Field(..., description="Type of insight (e.g., 'strength', 'warning', 'opportunity')")
    title: str = Field(..., description="Short title for the insight")
    description: str = Field(..., description="Detailed description of the insight")
    metrics: List[str] = Field(default_factory=list, description="List of metrics related to this insight")
    impact: str = Field(default="medium", description="Impact level (low, medium, high)")


class FinancialRecommendation(BaseModel):
    """Model for a single financial recommendation."""
    title: str = Field(..., description="Short title for the recommendation")
    description: str = Field(..., description="Detailed description of the recommendation")
    expected_impact: str = Field(default="medium", description="Expected impact level (low, medium, high)")
    implementation_difficulty: str = Field(default="medium", description="Implementation difficulty (easy, medium, hard)")
    timeframe: str = Field(
        default="medium-term",
        description="Timeframe for implementation (short-term, medium-term, long-term)",
    )


class FinancialInsightResponse(BaseModel):
    """Model for the complete financial insight response."""
    insights: List[FinancialInsight] = Field(default_factory=list, description="List of financial insights")
    recommendations: List[FinancialRecommendation] = Field(
        default_factory=list, description="List of financial recommendations"
    )
    summary: str = Field(..., description="Executive summary of the financial analysis")
    generated_at: datetime = Field(default_factory=datetime.now, description="Timestamp when insights were generated")
    llm_model: str = Field(default=settings.OPENAI_MODEL_NAME, description="LLM model used for generation")
