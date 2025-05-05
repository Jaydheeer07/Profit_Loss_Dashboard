from pydantic import BaseModel
from typing import Dict, Any

class MetricsResponse(BaseModel):
    """Model for a response that includes financial metrics and is ready to be used with the insights endpoint."""
    companyName: str
    period: str
    financialData: Dict[str, Any]