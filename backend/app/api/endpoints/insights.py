# app/api/endpoints/insights.py
from typing import Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.config import settings
# Import from the simplified LLM service
from app.services.llm_service import (
    LLMServiceError,
    get_llm_service,
)
from app.services.mock_llm_response import create_mock_financial_insight_response
from app.models.insights import ChatRequest, InsightRequest, FinancialInsightResponse
from app.utils.logger import app_logger


# Configure module-specific logger
logger = app_logger.getChild("insights")

# Log configuration settings
logger.info("Insights endpoint initialized with configuration:")
logger.info(f"Development Mode: {settings.DEV_MODE}")
logger.info(f"Using Mock Responses: {settings.use_mock_responses}")
logger.info(f"OpenAI API Key: {'Configured' if settings.is_openai_configured else 'Not configured'}")

router = APIRouter()


@router.post("/chat")
async def chat(request: ChatRequest):
    """Chat with the LLM.
    
    Args:
        request (ChatRequest): The chat request containing the query.
        
    Returns:
        dict: The response from the LLM containing the answer.
        
    Raises:
        HTTPException: If there's an error with the LLM service.
    """
    try:
        # Log the chat request
        logger.info(f"Processing chat request with query length: {len(request.query)}")
        
        # Use mock response if configured to do so
        if settings.use_mock_responses:
            logger.warning("Using mock response for chat")
            return {
                "message": "This is a mock response. Please configure your OpenAI API key to use the actual service.",
                "model": settings.OPENAI_MODEL_NAME
            }
        
        # Get LLM service instance and call the chat method
        llm_service = get_llm_service()
        message = llm_service.chat(request.query)
        
        logger.info(f"Successfully processed chat request, response length: {len(message) if message else 0}")
        
        return {
            "message": message,
            "model": settings.OPENAI_MODEL_NAME
        }
        
    except LLMServiceError as e:
        logger.error(f"LLM service error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat request: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat request: {str(e)}"
        )


@router.post("/insights", response_model=FinancialInsightResponse)
async def generate_insights(data: InsightRequest):
    """
    Generate financial insights using LLM based on uploaded financial data.
    
    Args:
        data: The insight request containing company name, period, and financial data.
        
    Returns:
        FinancialInsightResponse: The generated insights and recommendations.
        
    Raises:
        HTTPException: If there's an error generating insights.
    """
    try:
        # Check if we have metrics in the request
        financial_data = data.model_dump()
        if "metrics" not in financial_data["financialData"]:
            logger.warning("No metrics found in request data, insights may be limited")
            # Add empty metrics to avoid validation errors
            financial_data["financialData"]["metrics"] = {}

        # Use mock response if configured to do so
        if settings.use_mock_responses:
            logger.warning("Using mock response for financial insights")
            return create_mock_financial_insight_response(data.companyName, data.period)

        # Prepare the request data in the format expected by the LLM service
        request_data = {
            "company_name": data.companyName,
            "period": data.period,
            "financial_data": financial_data["financialData"],
        }

        # Get the LLM service instance and generate insights
        llm_service = get_llm_service()
        insights = llm_service.generate_insights(request_data)

        return insights
        
    except LLMServiceError as e:
        logger.error(f"LLM service error: {str(e)}")
        # Fall back to mock response if LLM service fails
        logger.info("Falling back to mock response due to LLM service error")
        return create_mock_financial_insight_response(data.companyName, data.period)
    except Exception as e:
        logger.error(f"Unexpected error generating insights: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while generating insights: {str(e)}",
        )
