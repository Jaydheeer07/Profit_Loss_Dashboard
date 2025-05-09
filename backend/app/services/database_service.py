"""
Database service for ProfitLens.
Handles database operations for reports, report data, and time series data.
"""
from typing import Dict, Any, List, Optional
from fastapi import HTTPException
from datetime import datetime
from app.core.supabase_client import get_supabase_client
from pydantic import BaseModel, Field, UUID4
from uuid import UUID


class ReportCreate(BaseModel):
    """Report creation model."""
    organization_id: UUID4
    name: str
    description: Optional[str] = None
    period: str
    file_path: Optional[str] = None


class ReportDataCreate(BaseModel):
    """Report data creation model."""
    report_id: UUID4
    data: Dict[str, Any]


class TimeSeriesDataCreate(BaseModel):
    """Time series data creation model."""
    organization_id: UUID4
    period: str
    metric_name: str
    metric_value: float


class DatabaseService:
    """Service for database operations."""
    
    @staticmethod
    async def create_report(report_data: ReportCreate, user_id: str) -> Dict[str, Any]:
        """
        Create a new financial report.
        
        Args:
            report_data: The report data.
            user_id: The user ID who uploaded the report.
            
        Returns:
            Dict[str, Any]: The created report.
            
        Raises:
            HTTPException: If report creation fails.
        """
        try:
            supabase = get_supabase_client()
            
            # Create report
            response = supabase.table('reports').insert({
                "organization_id": str(report_data.organization_id),
                "name": report_data.name,
                "description": report_data.description,
                "period": report_data.period,
                "uploaded_by": user_id,
                "file_path": report_data.file_path,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }).execute()
            
            if len(response.data) == 0:
                raise HTTPException(status_code=400, detail="Failed to create report")
            
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Report creation failed: {str(e)}")
    
    @staticmethod
    async def get_reports(organization_id: str) -> List[Dict[str, Any]]:
        """
        Get all reports for an organization.
        
        Args:
            organization_id: The organization ID.
            
        Returns:
            List[Dict[str, Any]]: The reports data.
            
        Raises:
            HTTPException: If fetching reports fails.
        """
        try:
            supabase = get_supabase_client()
            
            response = supabase.table('reports').select("*").eq("organization_id", organization_id).order("created_at", desc=True).execute()
            
            return response.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to fetch reports: {str(e)}")
    
    @staticmethod
    async def get_report(report_id: str) -> Dict[str, Any]:
        """
        Get a report by ID.
        
        Args:
            report_id: The report ID.
            
        Returns:
            Dict[str, Any]: The report data.
            
        Raises:
            HTTPException: If fetching report fails.
        """
        try:
            supabase = get_supabase_client()
            
            response = supabase.table('reports').select("*").eq("id", report_id).execute()
            
            if len(response.data) == 0:
                raise HTTPException(status_code=404, detail="Report not found")
            
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to fetch report: {str(e)}")
    
    @staticmethod
    async def store_report_data(report_data: ReportDataCreate) -> Dict[str, Any]:
        """
        Store report data.
        
        Args:
            report_data: The report data.
            
        Returns:
            Dict[str, Any]: The stored report data.
            
        Raises:
            HTTPException: If storing report data fails.
        """
        try:
            supabase = get_supabase_client()
            
            response = supabase.table('report_data').insert({
                "report_id": str(report_data.report_id),
                "data": report_data.data,
                "created_at": datetime.utcnow().isoformat()
            }).execute()
            
            if len(response.data) == 0:
                raise HTTPException(status_code=400, detail="Failed to store report data")
            
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Storing report data failed: {str(e)}")
    
    @staticmethod
    async def get_report_data(report_id: str) -> Dict[str, Any]:
        """
        Get report data by report ID.
        
        Args:
            report_id: The report ID.
            
        Returns:
            Dict[str, Any]: The report data.
            
        Raises:
            HTTPException: If fetching report data fails.
        """
        try:
            supabase = get_supabase_client()
            
            response = supabase.table('report_data').select("*").eq("report_id", report_id).execute()
            
            if len(response.data) == 0:
                raise HTTPException(status_code=404, detail="Report data not found")
            
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to fetch report data: {str(e)}")
    
    @staticmethod
    async def store_time_series_data(time_series_data: List[TimeSeriesDataCreate]) -> List[Dict[str, Any]]:
        """
        Store time series data for metrics.
        
        Args:
            time_series_data: List of time series data points.
            
        Returns:
            List[Dict[str, Any]]: The stored time series data.
            
        Raises:
            HTTPException: If storing time series data fails.
        """
        try:
            supabase = get_supabase_client()
            
            data_to_insert = [
                {
                    "organization_id": str(item.organization_id),
                    "period": item.period,
                    "metric_name": item.metric_name,
                    "metric_value": item.metric_value,
                    "created_at": datetime.utcnow().isoformat()
                }
                for item in time_series_data
            ]
            
            response = supabase.table('time_series_data').upsert(data_to_insert).execute()
            
            return response.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Storing time series data failed: {str(e)}")
    
    @staticmethod
    async def get_time_series_data(organization_id: str, metric_name: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get time series data for an organization.
        
        Args:
            organization_id: The organization ID.
            metric_name: Optional metric name filter.
            
        Returns:
            List[Dict[str, Any]]: The time series data.
            
        Raises:
            HTTPException: If fetching time series data fails.
        """
        try:
            supabase = get_supabase_client()
            
            query = supabase.table('time_series_data').select("*").eq("organization_id", organization_id)
            
            if metric_name:
                query = query.eq("metric_name", metric_name)
            
            response = query.order("period").execute()
            
            return response.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to fetch time series data: {str(e)}")
