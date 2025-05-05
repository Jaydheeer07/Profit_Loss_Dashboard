"""
Export endpoints for financial data.

This module provides API endpoints for exporting financial data
in various formats (JSON, CSV).
"""

import io

import pandas as pd
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse

from app.models.financial import FinancialData

router = APIRouter()


@router.post("/json")
async def export_to_json(data: FinancialData):
    """
    Export financial data to JSON format.

    Args:
        data (FinancialData): The financial data to export.

    Returns:
        JSONResponse: JSON response with the financial data.
    """
    try:
        # Convert Pydantic model to dict
        data_dict = data.model_dump()

        # Return as JSON response with proper filename
        filename = (
            f"{data.companyName.replace(' ', '_')}_{data.period.replace(' ', '_')}.json"
        )

        return JSONResponse(
            content=data_dict,
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error exporting to JSON: {str(e)}"
        )


@router.post("/csv")
async def export_to_csv(data: FinancialData):
    """
    Export financial data to CSV format.

    Args:
        data (FinancialData): The financial data to export.

    Returns:
        StreamingResponse: CSV file as a streaming response.
    """
    try:
        # Convert financial data to a flat structure suitable for CSV
        rows = []

        # Add company info
        rows.append(
            {
                "Category": "Company Info",
                "Item": "Company Name",
                "Value": data.companyName,
            }
        )
        rows.append(
            {"Category": "Company Info", "Item": "Period", "Value": data.period}
        )
        rows.append(
            {"Category": "Company Info", "Item": "Basis Type", "Value": data.basisType}
        )
        rows.append(
            {
                "Category": "Company Info",
                "Item": "Report Type",
                "Value": data.reportType,
            }
        )

        # Add section data
        # Trading Income
        rows.append(
            {
                "Category": "Trading Income",
                "Item": "Total",
                "Value": data.sections.tradingIncome.total,
            }
        )

        for account in data.sections.tradingIncome.accounts:
            rows.append(
                {
                    "Category": "Trading Income",
                    "Item": account.name,
                    "Value": account.value,
                    "Category_Type": account.category,
                }
            )

        # Cost of Sales (if present)
        if data.sections.costOfSales:
            rows.append(
                {
                    "Category": "Cost of Sales",
                    "Item": "Total",
                    "Value": data.sections.costOfSales.total,
                }
            )

            for account in data.sections.costOfSales.accounts:
                rows.append(
                    {
                        "Category": "Cost of Sales",
                        "Item": account.name,
                        "Value": account.value,
                        "Category_Type": account.category,
                    }
                )

        # Gross Profit
        rows.append(
            {
                "Category": "Profit",
                "Item": "Gross Profit",
                "Value": data.sections.grossProfit,
            }
        )

        # Operating Expenses
        rows.append(
            {
                "Category": "Operating Expenses",
                "Item": "Total",
                "Value": data.sections.operatingExpenses.total,
            }
        )

        for account in data.sections.operatingExpenses.accounts:
            rows.append(
                {
                    "Category": "Operating Expenses",
                    "Item": account.name,
                    "Value": account.value,
                    "Category_Type": account.category,
                }
            )

        # Net Profit
        rows.append(
            {
                "Category": "Profit",
                "Item": "Net Profit",
                "Value": data.sections.netProfit,
            }
        )

        # Create DataFrame and export to CSV
        df = pd.DataFrame(rows)

        # Create a string buffer
        buffer = io.StringIO()
        df.to_csv(buffer, index=False)
        buffer.seek(0)

        # Generate filename
        filename = (
            f"{data.companyName.replace(' ', '_')}_{data.period.replace(' ', '_')}.csv"
        )

        # Return streaming response
        return StreamingResponse(
            iter([buffer.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting to CSV: {str(e)}")
