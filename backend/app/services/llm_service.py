"""
Simplified LLM Service Module for Financial Insights Generation.

This module provides a streamlined service for generating financial insights and
handling chat interactions using OpenAI's language models.
"""

import json
import os
from datetime import datetime
from typing import Any, Dict, List, Optional, Union

import openai
from openai import OpenAI
from pydantic import BaseModel, Field, field_validator

from app.core.config import settings
from app.utils.logger import app_logger as logger
from app.models.insights import FinancialInsightRequest, FinancialInsight, FinancialRecommendation, FinancialInsightResponse


class LLMServiceError(Exception):
    """Exception raised for errors in the LLM service."""
    pass


class LLMService:
    """Simplified service for generating financial insights and handling chat using OpenAI."""

    def __init__(self):
        """Initialize the LLM service."""
        self._client = None
        
        # Configure OpenAI client
        if settings.is_openai_configured:
            try:
                self._client = OpenAI(api_key=settings.OPENAI_API_KEY)
                logger.info("OpenAI client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize OpenAI client: {str(e)}")
        else:
            logger.warning("OpenAI API key not configured in settings.")

    def chat(self, query: str) -> str:
        """
        Send a chat query to the OpenAI model and get a response.
        
        Args:
            query: The user's query string
            
        Returns:
            The model's response as a string
            
        Raises:
            LLMServiceError: If there's an error calling the API
        """
        if not settings.is_openai_configured:
            raise LLMServiceError("OpenAI API key is not configured")
            
        if self._client is None:
            self._client = OpenAI(api_key=settings.OPENAI_API_KEY)
            
        try:
            # Create a simple prompt for the chat
            prompt = f"""Answer the following question about financial analysis and profit/loss statements:

{query}

Provide a clear and concise answer."""
            
            # Call OpenAI API
            response = self._client.chat.completions.create(
                model=settings.OPENAI_MODEL_NAME,
                messages=[
                    {"role": "system", "content": "You are a financial analyst specializing in profit and loss analysis."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=2000
            )
            
            # Extract the message from the response
            if hasattr(response, 'choices') and len(response.choices) > 0:
                return response.choices[0].message.content
            else:
                return "Error processing your request. Please try again."
                
        except Exception as e:
            logger.error(f"Error in chat: {str(e)}")
            raise LLMServiceError(f"Error processing chat request: {str(e)}")

    def generate_insights(self, request_data: Dict[str, Any]) -> FinancialInsightResponse:
        """
        Generate financial insights using LLM.
        
        Args:
            request_data: Dictionary containing the request data.
            
        Returns:
            FinancialInsightResponse object containing the insights and recommendations.
            
        Raises:
            LLMServiceError: If there's an error generating insights.
        """
        try:
            # Validate request data
            request = FinancialInsightRequest(**request_data)
            
            # Create prompt
            prompt = self._create_prompt(request)
            
            # Call OpenAI API
            llm_response = self._call_openai_api(prompt)
            
            # Validate and process response
            response = FinancialInsightResponse(**llm_response)
            
            return response
            
        except Exception as e:
            logger.error(f"Error generating insights: {str(e)}")
            raise LLMServiceError(f"Failed to generate financial insights: {str(e)}")

    def _create_prompt(self, request: FinancialInsightRequest) -> str:
        """
        Create a prompt for the LLM based on the financial data.
        
        Args:
            request: FinancialInsightRequest object containing the request data.
            
        Returns:
            String prompt for the LLM.
        """
        # Extract key financial data
        financial_data = request.financial_data
        sections = financial_data.get("sections", {})
        metrics = financial_data.get("metrics", {})
        
        # Format metrics for the prompt
        metrics_text = "\n".join(
            [
                f"- {key.replace('_', ' ').title()}: {value:.2%}"
                if isinstance(value, float)
                else f"- {key.replace('_', ' ').title()}: {value}"
                for key, value in metrics.items()
            ]
        )
        
        # Extract top expenses if available
        top_expenses = []
        if "operatingExpenses" in sections and "accounts" in sections["operatingExpenses"]:
            expenses = sections["operatingExpenses"]["accounts"]
            if expenses:
                # Sort expenses by absolute value (descending)
                sorted_expenses = sorted(
                    expenses, key=lambda x: abs(x.get("value", 0)), reverse=True
                )
                # Take top 5 expenses
                top_expenses = sorted_expenses[:5]
        
        top_expenses_text = ""
        if top_expenses:
            expense_items = []
            total_expenses = abs(sections.get("operatingExpenses", {}).get("total", 1))
            
            for expense in top_expenses:
                name = expense.get("name", "Unknown")
                value = expense.get("value", 0)
                percentage = abs(value) / total_expenses * 100 if total_expenses else 0
                expense_items.append(
                    f"- {name}: ${abs(value):.2f} ({percentage:.1f}% of total expenses)"
                )
            
            top_expenses_text = "Top Expenses:\n" + "\n".join(expense_items)
        
        # Create the prompt
        prompt = f"""
You are a financial analyst specializing in profit and loss analysis. Analyze the following financial data for {request.company_name} for the period {request.period} and provide insights and recommendations.

Financial Metrics:
{metrics_text}

{top_expenses_text}

Based on this financial data, please provide:
1. 3-5 key insights about the financial performance (strengths, weaknesses, opportunities)
2. 3-4 actionable recommendations to improve financial performance
3. A brief executive summary (2-3 sentences)

For each insight, include:
- A clear title
- A detailed explanation
- The impact level (low, medium, high)
- Related metrics

For each recommendation, include:
- A clear action item
- A detailed explanation of the expected benefit
- Implementation difficulty (easy, medium, hard)
- Expected timeframe (short-term, medium-term, long-term)

Format your response as JSON with the following structure:
{{
  "insights": [
    {{
      "type": "strength|warning|opportunity",
      "title": "Short title",
      "description": "Detailed description",
      "metrics": ["related_metric1", "related_metric2"],
      "impact": "low|medium|high"
    }}
  ],
  "recommendations": [
    {{
      "title": "Action item",
      "description": "Detailed explanation",
      "expected_impact": "low|medium|high",
      "implementation_difficulty": "easy|medium|hard",
      "timeframe": "short-term|medium-term|long-term"
    }}
  ],
  "summary": "Executive summary of the financial analysis"
}}
"""
        return prompt

    def _call_openai_api(self, prompt: str) -> Dict[str, Any]:
        """
        Call the OpenAI API with the given prompt.
        
        Args:
            prompt: String prompt for the LLM.
            
        Returns:
            Dictionary containing the API response.
            
        Raises:
            LLMServiceError: If there's an error calling the API.
        """
        if not settings.is_openai_configured:
            raise LLMServiceError("OpenAI API key is not configured")
            
        if self._client is None:
            self._client = OpenAI(api_key=settings.OPENAI_API_KEY)
        
        try:
            # Make API request
            response = self._client.chat.completions.create(
                model=settings.OPENAI_MODEL_NAME,
                messages=[
                    {"role": "system", "content": "You are a financial analyst specializing in profit and loss analysis."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=4000,
                response_format={"type": "json_object"}
            )
            
            # Extract and parse the response
            content = response.choices[0].message.content
            
            try:
                parsed_content = json.loads(content)
                return parsed_content
            except json.JSONDecodeError as e:
                raise LLMServiceError(f"Failed to parse OpenAI response as JSON: {str(e)}")
                
        except openai.APIError as e:
            raise LLMServiceError(f"OpenAI API error: {str(e)}")
        except Exception as e:
            raise LLMServiceError(f"Unexpected error calling OpenAI API: {str(e)}")


# Singleton instance
_llm_service = None


def get_llm_service() -> LLMService:
    """
    Get the singleton instance of the LLM service.
    
    Returns:
        LLMService instance.
    """
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
