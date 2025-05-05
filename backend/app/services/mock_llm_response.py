"""
Mock LLM response module for development purposes.

This module provides a pre-generated LLM response to use during development
to avoid making actual API calls and incurring costs.
"""

from datetime import datetime
from typing import Any, Dict

from app.models.insights import FinancialInsightResponse, FinancialRecommendation, FinancialInsight

def get_mock_llm_response(company_name: str, period: str) -> Dict[str, Any]:
    """
    Get a mock LLM response for development purposes.

    Args:
        company_name: Name of the company.
        period: Financial period.

    Returns:
        Dictionary containing the mock LLM response.
    """
    # Create mock insights
    insights = [
        {
            "type": "profitability",
            "title": "Negative Gross Profit Margin",
            "description": f"{company_name} is experiencing a negative gross profit margin during {period}, indicating that the cost of goods sold exceeds revenue. This is a critical issue that requires immediate attention.",
            "impact": "high",
            "confidence": 0.95,
        },
        {
            "type": "expense",
            "title": "High Operating Expenses",
            "description": "Operating expenses represent a significant portion of revenue, which is putting pressure on the bottom line. The largest expense categories are Rent & Lease and Salaries & Wages.",
            "impact": "medium",
            "confidence": 0.85,
        },
        {
            "type": "revenue",
            "title": "Revenue Concentration Risk",
            "description": "The company's revenue is heavily concentrated in a few product lines, particularly in Pulses and Wheat, which creates dependency risk if market conditions change.",
            "impact": "medium",
            "confidence": 0.80,
        },
        {
            "type": "cash_flow",
            "title": "Negative Cash Flow",
            "description": "The negative profit suggests the company is experiencing negative cash flow, which could lead to liquidity issues if not addressed promptly.",
            "impact": "high",
            "confidence": 0.90,
        },
    ]

    # Create mock recommendations
    recommendations = [
        {
            "title": "Renegotiate Supplier Contracts",
            "description": "Consider renegotiating contracts with key suppliers to reduce the cost of goods sold and improve gross margins.",
            "priority": "high",
            "category": "cost_reduction",
            "estimated_impact": "Could potentially improve gross margin by 5-10%",
        },
        {
            "title": "Implement Cost-Cutting Measures",
            "description": "Identify non-essential operating expenses that can be reduced or eliminated without impacting core operations.",
            "priority": "high",
            "category": "cost_reduction",
            "estimated_impact": "Potential to reduce operating expenses by 15-20%",
        },
        {
            "title": "Diversify Revenue Streams",
            "description": "Explore new product lines or markets to reduce dependency on current major revenue sources.",
            "priority": "medium",
            "category": "revenue_growth",
            "estimated_impact": "Long-term stability and reduced risk exposure",
        },
        {
            "title": "Implement Cash Conservation Strategies",
            "description": "Develop a cash conservation plan including potential deferral of non-essential capital expenditures and tighter management of accounts receivable.",
            "priority": "high",
            "category": "cash_management",
            "estimated_impact": "Improved short-term liquidity and financial stability",
        },
    ]

    # Create summary
    summary = f"Financial analysis for {company_name} during {period} reveals significant challenges with profitability. The company is experiencing a negative gross profit margin, indicating that the cost of goods sold exceeds revenue. This, combined with high operating expenses, is resulting in a negative net profit. Key areas of concern include cost management, expense control, and cash flow. Immediate action is recommended to address these issues and improve financial performance."

    # Create mock response
    return {
        "summary": summary,
        "insights": insights,
        "recommendations": recommendations,
        "generated_at": datetime.now(),
        "llm_model": "Development Mock (No API Call)",
        "processing_time": 0.1,  # Mock processing time in seconds
    }


def create_mock_financial_insight_response(
    company_name: str, period: str
) -> FinancialInsightResponse:
    """
    Create a mock FinancialInsightResponse object for development purposes.

    Args:
        company_name: Name of the company.
        period: Financial period.

    Returns:
        FinancialInsightResponse object with mock data.
    """
    mock_data = get_mock_llm_response(company_name, period)

    # Convert insights to FinancialInsight objects
    insights = [FinancialInsight(**insight) for insight in mock_data["insights"]]

    # Convert recommendations to FinancialRecommendation objects
    recommendations = [
        FinancialRecommendation(**rec) for rec in mock_data["recommendations"]
    ]

    # Create and return the response object
    return FinancialInsightResponse(
        summary=mock_data["summary"],
        insights=insights,
        recommendations=recommendations,
        generated_at=mock_data["generated_at"],
        llm_model=mock_data["llm_model"],
        processing_time=mock_data["processing_time"],
    )
