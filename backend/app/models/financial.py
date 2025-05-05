# app/models/financial.py
from pydantic import BaseModel, Field, field_validator
from typing import Dict, List, Any, Optional
from datetime import datetime

class PnLAccount(BaseModel):
    name: str
    value: float
    category: Optional[str] = None

class PnLSection(BaseModel):
    accounts: List[PnLAccount]
    total: float

class PnLSections(BaseModel):
    tradingIncome: PnLSection
    costOfSales: Optional[PnLSection] = None
    grossProfit: float
    operatingExpenses: PnLSection
    netProfit: float

class PnLMetadata(BaseModel):
    uploadDate: str
    source: str
    currency: str

class FinancialData(BaseModel):
    companyName: str
    period: str
    basisType: str
    reportType: str
    sections: PnLSections
    metadata: PnLMetadata

class FinancialMetrics(BaseModel):
    gross_margin: float
    net_margin: float
    expense_ratio: float
    cogs_ratio: float
    # Add other metrics as needed

class FinancialStatement(BaseModel):
    revenue: float = Field(..., description="Total revenue (sales)")
    cost_of_goods_sold: Optional[float] = Field(None, description="Cost of goods sold (COGS)")
    operating_expenses: Optional[float] = Field(None, description="Operating expenses")
    net_income: Optional[float] = Field(None, description="Net income (profit after tax)")
    total_assets: Optional[float] = Field(None, description="Total assets")
    total_equity: Optional[float] = Field(None, description="Total equity")
    current_assets: Optional[float] = Field(None, description="Current assets")
    current_liabilities: Optional[float] = Field(None, description="Current liabilities")
    cash: Optional[float] = Field(None, description="Cash and cash equivalents")
    inventory: Optional[float] = Field(None, description="Inventory")
    accounts_receivable: Optional[float] = Field(None, description="Accounts receivable")

    @field_validator('*', mode='before')
    @classmethod
    def none_to_zero(cls, v):
        return v if v is not None else 0.0
