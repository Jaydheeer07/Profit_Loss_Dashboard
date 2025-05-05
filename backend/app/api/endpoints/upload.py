# app/api/endpoints/upload.py
from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile
import os
from typing import Dict, Any
from app.core.analyzer import analyze_profit_loss
from app.models.financial import FinancialData
from app.utils.logger import app_logger

# Configure module-specific logger
logger = app_logger.getChild('upload')

router = APIRouter()


def validate_financial_data(data: Dict[str, Any]) -> None:
    """
    Validate that the financial data contains all required fields.
    
    Args:
        data: The financial data dictionary.
        
    Raises:
        ValueError: If required fields are missing.
    """
    # Check for required sections
    sections = data.get('sections', {})
    
    # List of validation errors
    errors = []
    
    # Check for trading income section
    if 'tradingIncome' not in sections:
        errors.append("Trading Income section not found")
    
    # Check for operating expenses section
    if 'operatingExpenses' not in sections:
        errors.append("Operating Expenses section not found")
    
    # Check for gross profit
    if 'grossProfit' not in sections or sections['grossProfit'] is None:
        errors.append("Gross Profit value not found or is null")
    
    # Check for net profit
    if 'netProfit' not in sections or sections['netProfit'] is None:
        errors.append("Net Profit value not found or is null")
    
    # If any errors were found, raise ValueError
    if errors:
        error_message = "Invalid profit and loss report: " + "; ".join(errors)
        raise ValueError(error_message)


@router.post("/", response_model=FinancialData)
async def upload_file(file: UploadFile = File(...)):
    """
    Upload and process a profit and loss Excel file.
    """
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Only Excel files are supported")
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as temp_file:
            temp_file.write(await file.read())
            temp_file_path = temp_file.name
        
        try:
            # Analyze the profit and loss report
            result = analyze_profit_loss(temp_file_path)
            
            # Validate the result before returning
            try:
                validate_financial_data(result)
            except ValueError as ve:
                logger.warning(f"Validation failed for uploaded file {file.filename}: {str(ve)}")
                raise HTTPException(
                    status_code=422, 
                    detail=f"The uploaded file appears to be missing important information: {str(ve)}. "
                           f"Please ensure you're uploading a complete profit and loss report."
                )
            
            return result
        finally:
            os.unlink(temp_file_path)  # Clean up temp file
    except Exception as e:
        logger.error(f"Error processing uploaded file {file.filename}: {str(e)}")
        
        # Provide a more user-friendly error message
        if "Excel file validation failed" in str(e):
            raise HTTPException(
                status_code=422,
                detail="The uploaded file doesn't appear to be a valid profit and loss report. "
                       "Please check the file and try again."
            )
        elif "Invalid profit and loss report" in str(e):
            raise HTTPException(
                status_code=422,
                detail=str(e)
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"An error occurred while processing the file: {str(e)}"
            )