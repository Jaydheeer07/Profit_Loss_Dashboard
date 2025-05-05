# app/api/endpoints/analyzer.py
from fastapi import APIRouter, HTTPException
from app.models.metrics import MetricsResponse
from app.models.financial import FinancialData
from app.utils.ratios import calculate_financial_metrics
from app.utils.logger import app_logger

# Configure module-specific logger
logger = app_logger.getChild('analyzer')

router = APIRouter()


@router.post("/metrics", response_model=MetricsResponse)
async def get_metrics_data(data: FinancialData):
    """
    Calculate financial metrics and prepare data in a format ready to be used with the /insights endpoint.
    
    This endpoint calculates financial metrics from the profit and loss data and formats
    the response to be directly usable with the /insights endpoint.
    
    Args:
        data: The financial data from the uploaded profit and loss report.
        
    Returns:
        MetricsResponse: Financial data with metrics, formatted for the /insights endpoint.
        
    Raises:
        HTTPException: If there's an error calculating metrics or preparing the data.
    """
    try:
        # Get the original data as a dictionary
        financial_data = data.model_dump()
        
        # Calculate metrics
        metrics = calculate_financial_metrics(financial_data)
        
        # Add metrics to the financial data
        financial_data["metrics"] = metrics
        
        # Format the response for the insights endpoint
        response = {
            "companyName": financial_data.get("companyName", "Unknown Company"),
            "period": financial_data.get("period", "Unknown Period"),
            "financialData": financial_data
        }
        
        logger.info(f"Prepared insights-ready data for {response['companyName']}")
        return response
    except Exception as e:
        logger.error(f"Error preparing insights-ready data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error preparing data: {str(e)}")