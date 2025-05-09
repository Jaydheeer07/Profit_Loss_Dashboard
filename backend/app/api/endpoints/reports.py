"""
Report management endpoints for ProfitLens.
"""
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, Body, UploadFile, File, Form
from uuid import UUID
import json
from app.services.database_service import (
    DatabaseService, 
    ReportCreate, 
    ReportDataCreate,
    TimeSeriesDataCreate
)
from app.api.endpoints.auth import get_current_user


router = APIRouter()


async def process_file(file: UploadFile) -> Dict[str, Any]:
    """
    Process the uploaded financial report file.
    
    Args:
        file: The uploaded file.
        
    Returns:
        Dict[str, Any]: Processed data with extracted metrics and insights.
    """
    try:
        # Read the file content
        contents = await file.read()
        
        # Parse the file based on its type
        if file.filename.endswith('.json'):
            data = json.loads(contents.decode('utf-8'))
        elif file.filename.endswith('.csv'):
            # Simple CSV parsing - in production, use pandas or similar
            lines = contents.decode('utf-8').strip().split('\n')
            headers = lines[0].split(',')
            
            data = {
                "rows": [],
                "metrics": {}
            }
            
            for line in lines[1:]:
                values = line.split(',')
                row = {headers[i]: values[i] for i in range(min(len(headers), len(values)))}
                data["rows"].append(row)
                
            # Extract some metrics as example
            # In a real implementation, this would be more sophisticated
            if len(data["rows"]) > 0 and "amount" in data["rows"][0]:
                total = sum(float(row["amount"]) for row in data["rows"] if "amount" in row)
                data["metrics"] = {
                    "total_amount": total,
                    "average_amount": total / len(data["rows"]) if data["rows"] else 0,
                    "count": len(data["rows"])
                }
        else:
            # For Excel or other formats, we'd use appropriate libraries
            raise HTTPException(status_code=400, detail=f"Unsupported file format: {file.filename}")
            
        return data
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")


@router.post("/", response_model=Dict[str, Any])
async def create_report(
    organization_id: UUID = Form(...),
    name: str = Form(...),
    description: str = Form(None),
    period: str = Form(...),
    file: UploadFile = File(...),
    user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Create a new financial report and process the uploaded file.
    
    Args:
        organization_id: The organization ID.
        name: The report name.
        description: The report description.
        period: The financial period.
        file: The uploaded financial report file.
        user: The authenticated user data.
        
    Returns:
        Dict[str, Any]: The created report with processed data.
    """
    user_id = user["user"]["id"]
    
    # Create the report
    report_data = ReportCreate(
        organization_id=organization_id,
        name=name,
        description=description,
        period=period,
        file_path=None  # We don't store the file path
    )
    
    report = await DatabaseService.create_report(report_data, user_id)
    
    # Process the uploaded file
    processed_data = await process_file(file)
    
    # Store the processed data
    report_data_create = ReportDataCreate(
        report_id=UUID(report["id"]),
        data=processed_data
    )
    
    report_data = await DatabaseService.store_report_data(report_data_create)
    
    # Extract key metrics for time series data
    if "metrics" in processed_data:
        time_series_data = []
        metrics = processed_data["metrics"]
        
        for metric_name, metric_value in metrics.items():
            if isinstance(metric_value, (int, float)):
                time_series_data.append(
                    TimeSeriesDataCreate(
                        organization_id=organization_id,
                        period=period,
                        metric_name=metric_name,
                        metric_value=float(metric_value)
                    )
                )
        
        if time_series_data:
            await DatabaseService.store_time_series_data(time_series_data)
    
    return {
        "report": report,
        "data": report_data
    }


@router.get("/", response_model=List[Dict[str, Any]])
async def get_reports(
    organization_id: UUID,
    user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get all reports for an organization.
    
    Args:
        organization_id: The organization ID.
        user: The authenticated user data.
        
    Returns:
        List[Dict[str, Any]]: The reports data.
    """
    return await DatabaseService.get_reports(str(organization_id))


@router.get("/{report_id}", response_model=Dict[str, Any])
async def get_report(
    report_id: UUID,
    user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get a report by ID.
    
    Args:
        report_id: The report ID.
        user: The authenticated user data.
        
    Returns:
        Dict[str, Any]: The report data.
    """
    report = await DatabaseService.get_report(str(report_id))
    report_data = await DatabaseService.get_report_data(str(report_id))
    
    return {
        "report": report,
        "data": report_data
    }


@router.get("/time-series/{organization_id}", response_model=List[Dict[str, Any]])
async def get_time_series_data(
    organization_id: UUID,
    metric_name: str = None,
    user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get time series data for an organization.
    
    Args:
        organization_id: The organization ID.
        metric_name: Optional metric name filter.
        user: The authenticated user data.
        
    Returns:
        List[Dict[str, Any]]: The time series data.
    """
    return await DatabaseService.get_time_series_data(str(organization_id), metric_name)
