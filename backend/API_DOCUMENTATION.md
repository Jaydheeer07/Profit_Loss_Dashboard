# Profit & Loss Dashboard API Documentation

This document provides comprehensive documentation for the Profit & Loss Dashboard API endpoints, including request/response formats and example usage.

## Base URL

All API endpoints are prefixed with `/api`.

## Authentication

Authentication is not currently implemented. This will be added in a future update.

## Interactive Documentation

Swagger UI documentation is available at `/docs` when the server is running. This provides an interactive interface to test all API endpoints.

## API Endpoints

### File Upload

#### `POST /api/upload`

Upload and process a profit and loss Excel file.

**Request:**
- Content-Type: `multipart/form-data`
- Body: 
  - `file`: Excel file (.xlsx or .xls)

**Response:**
- Status: 200 OK
- Content-Type: `application/json`
- Body: Financial data object (see schema below)

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/upload/" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@sample_pl_report.xlsx"
```

**Example Response:**
```json
{
  "companyName": "Test Company Ltd",
  "period": "For the month ended May 31, 2025",
  "basisType": "Accrual",
  "reportType": "Complete",
  "sections": {
    "tradingIncome": {
      "accounts": [
        {
          "name": "Sales",
          "value": 95000.0,
          "category": "Revenue"
        },
        {
          "name": "Service Revenue",
          "value": 10000.0,
          "category": "Revenue"
        },
        {
          "name": "Other Income",
          "value": 5000.0,
          "category": "Revenue"
        }
      ],
      "total": 110000.0
    },
    "costOfSales": {
      "accounts": [
        {
          "name": "Purchases",
          "value": 40000.0,
          "category": "COGS"
        },
        {
          "name": "Direct Labor",
          "value": 15000.0,
          "category": "COGS"
        },
        {
          "name": "Manufacturing Supplies",
          "value": 5000.0,
          "category": "COGS"
        }
      ],
      "total": 60000.0
    },
    "grossProfit": 50000.0,
    "operatingExpenses": {
      "accounts": [
        {
          "name": "Rent",
          "value": 5000.0,
          "category": "Facilities"
        },
        {
          "name": "Utilities",
          "value": 2000.0,
          "category": "Utilities"
        },
        {
          "name": "Salaries and Wages",
          "value": 20000.0,
          "category": "Personnel"
        },
        {
          "name": "Insurance",
          "value": 1500.0,
          "category": "Insurance"
        },
        {
          "name": "Marketing",
          "value": 3000.0,
          "category": "Marketing"
        },
        {
          "name": "Office Supplies",
          "value": 1000.0,
          "category": "Office"
        },
        {
          "name": "Professional Fees",
          "value": 2500.0,
          "category": "Professional Services"
        }
      ],
      "total": 35000.0
    },
    "netProfit": 15000.0
  },
  "metadata": {
    "uploadDate": "2025-05-05T11:38:12",
    "source": "Excel Upload",
    "currency": "USD"
  }
}
```

**Error Responses:**
- 400 Bad Request: If the uploaded file is not an Excel file
- 422 Unprocessable Entity: If no file is provided
- 500 Internal Server Error: If there's an error processing the file

### Financial Metrics

#### `POST /api/metrics`

Calculate financial metrics from profit and loss data and prepare data for insights.

**Request:**
- Content-Type: `application/json`
- Body: Financial data object (same format as the upload response)

**Response:**
- Status: 200 OK
- Content-Type: `application/json`
- Body: Object containing company name, period, and financial data with metrics

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/metrics" \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Test Company Ltd","period":"For the month ended May 31, 2025","basisType":"Accrual","reportType":"Complete","sections":{"tradingIncome":{"accounts":[{"name":"Sales","value":95000.0,"category":"Revenue"},{"name":"Service Revenue","value":10000.0,"category":"Revenue"},{"name":"Other Income","value":5000.0,"category":"Revenue"}],"total":110000.0},"costOfSales":{"accounts":[{"name":"Purchases","value":40000.0,"category":"COGS"},{"name":"Direct Labor","value":15000.0,"category":"COGS"},{"name":"Manufacturing Supplies","value":5000.0,"category":"COGS"}],"total":60000.0},"grossProfit":50000.0,"operatingExpenses":{"accounts":[{"name":"Rent","value":5000.0,"category":"Facilities"},{"name":"Utilities","value":2000.0,"category":"Utilities"},{"name":"Salaries and Wages","value":20000.0,"category":"Personnel"},{"name":"Insurance","value":1500.0,"category":"Insurance"},{"name":"Marketing","value":3000.0,"category":"Marketing"},{"name":"Office Supplies","value":1000.0,"category":"Office"},{"name":"Professional Fees","value":2500.0,"category":"Professional Services"}],"total":35000.0},"netProfit":15000.0},"metadata":{"uploadDate":"2025-05-05T11:38:12","source":"Excel Upload","currency":"USD"}}'
```

**Example Response:**
```json
{
  "company_name": "Test Company Ltd",
  "period": "For the month ended May 31, 2025",
  "financial_data": {
    "companyName": "Test Company Ltd",
    "period": "For the month ended May 31, 2025",
    "basisType": "Accrual",
    "reportType": "Complete",
    "sections": {
      "tradingIncome": {
        "accounts": [
          {"name": "Sales", "value": 95000.0, "category": "Revenue"},
          {"name": "Service Revenue", "value": 10000.0, "category": "Revenue"},
          {"name": "Other Income", "value": 5000.0, "category": "Revenue"}
        ],
        "total": 110000.0
      },
      "costOfSales": {
        "accounts": [
          {"name": "Purchases", "value": 40000.0, "category": "COGS"},
          {"name": "Direct Labor", "value": 15000.0, "category": "COGS"},
          {"name": "Manufacturing Supplies", "value": 5000.0, "category": "COGS"}
        ],
        "total": 60000.0
      },
      "grossProfit": 50000.0,
      "operatingExpenses": {
        "accounts": [
          {"name": "Rent", "value": 5000.0, "category": "Facilities"},
          {"name": "Utilities", "value": 2000.0, "category": "Utilities"},
          {"name": "Salaries and Wages", "value": 20000.0, "category": "Personnel"},
          {"name": "Insurance", "value": 1500.0, "category": "Insurance"},
          {"name": "Marketing", "value": 3000.0, "category": "Marketing"},
          {"name": "Office Supplies", "value": 1000.0, "category": "Office"},
          {"name": "Professional Fees", "value": 2500.0, "category": "Professional Services"}
        ],
        "total": 35000.0
      },
      "netProfit": 15000.0
    },
    "metadata": {
      "uploadDate": "2025-05-05T11:38:12",
      "source": "Excel Upload",
      "currency": "USD"
    },
    "metrics": {
      "gross_margin": 0.4545,
      "net_margin": 0.1364,
      "expense_ratio": 0.3182,
      "cogs_ratio": 0.5455,
      "revenue_breakdown": {
        "Sales": 0.8636,
        "Service Revenue": 0.0909,
        "Other Income": 0.0455
      },
      "expense_breakdown": {
        "Facilities": 0.1429,
        "Utilities": 0.0571,
        "Personnel": 0.5714,
        "Insurance": 0.0429,
        "Marketing": 0.0857,
        "Office": 0.0286,
        "Professional Services": 0.0714
      }
    }
  }
}
```

**Error Responses:**
- 422 Unprocessable Entity: If the request body is invalid
- 500 Internal Server Error: If there's an error calculating metrics

### Financial Insights

#### `POST /api/insights`

Generate AI-powered financial insights and recommendations using LLM.

**Request:**
- Content-Type: `application/json`
- Body: Object containing company name, period, and financial data with metrics (same format as the metrics response)

**Response:**
- Status: 200 OK
- Content-Type: `application/json`
- Body: Object containing insights, recommendations, and executive summary

#### `POST /api/chat`

Chat with the LLM about financial topics.

**Request:**
- Content-Type: `application/json`
- Body: Object containing the user's query

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/insights" \
  -H "Content-Type: application/json" \
  -d '{"company_name":"Test Company Ltd","period":"For the month ended May 31, 2025","financial_data":{"companyName":"Test Company Ltd","period":"For the month ended May 31, 2025","basisType":"Accrual","reportType":"Complete","sections":{"tradingIncome":{"accounts":[{"name":"Sales","value":95000.0,"category":"Revenue"},{"name":"Service Revenue","value":10000.0,"category":"Revenue"},{"name":"Other Income","value":5000.0,"category":"Revenue"}],"total":110000.0},"costOfSales":{"accounts":[{"name":"Purchases","value":40000.0,"category":"COGS"},{"name":"Direct Labor","value":15000.0,"category":"COGS"},{"name":"Manufacturing Supplies","value":5000.0,"category":"COGS"}],"total":60000.0},"grossProfit":50000.0,"operatingExpenses":{"accounts":[{"name":"Rent","value":5000.0,"category":"Facilities"},{"name":"Utilities","value":2000.0,"category":"Utilities"},{"name":"Salaries and Wages","value":20000.0,"category":"Personnel"},{"name":"Insurance","value":1500.0,"category":"Insurance"},{"name":"Marketing","value":3000.0,"category":"Marketing"},{"name":"Office Supplies","value":1000.0,"category":"Office"},{"name":"Professional Fees","value":2500.0,"category":"Professional Services"}],"total":35000.0},"netProfit":15000.0},"metadata":{"uploadDate":"2025-05-05T11:38:12","source":"Excel Upload","currency":"USD"},"metrics":{"gross_margin":0.4545,"net_margin":0.1364,"expense_ratio":0.3182,"cogs_ratio":0.5455,"revenue_breakdown":{"Sales":0.8636,"Service Revenue":0.0909,"Other Income":0.0455},"expense_breakdown":{"Facilities":0.1429,"Utilities":0.0571,"Personnel":0.5714,"Insurance":0.0429,"Marketing":0.0857,"Office":0.0286,"Professional Services":0.0714}}}}'
```

**Example Response:**
```json
{
  "insights": [
    "Your gross profit margin of 45.45% is above the industry average of 40% for this sector.",
    "Personnel costs represent 57.14% of your total operating expenses, which is relatively high.",
    "Marketing expenses at 8.57% of operating costs may be too low for optimal growth."
  ],
  "recommendations": [
    "Consider evaluating your personnel structure to identify potential efficiencies.",
    "Increasing marketing spend by 3-5% could potentially boost revenue growth.",
    "Your cost of goods sold ratio is 54.55%, which suggests opportunities for negotiating better supplier terms."
  ],
  "executive_summary": "Test Company Ltd shows solid financial performance with above-average gross margins. Key areas for improvement include personnel cost optimization and increased marketing investment.",
  "generated_at": "2025-05-05T11:40:00"
}
```

#### Chat Endpoint Example

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"query":"What does our gross margin indicate about our pricing strategy?"}'
```

**Example Response:**
```json
{
  "response": "Your gross margin of 45.45% indicates a strong pricing strategy that allows for healthy profit after covering direct costs. This is above the industry average of 40%, suggesting you have good pricing power in your market. You could potentially explore premium pricing for certain products or services, or maintain current pricing while focusing on operational efficiencies to further improve this margin."
}
```

**Error Responses:**
- 422 Unprocessable Entity: If the request body is invalid
- 500 Internal Server Error: If there's an error generating a response

## Data Models

The API uses the following data models for requests and responses:

### Financial Data Model

```python
class FinancialData(BaseModel):
    companyName: str
    period: str
    basisType: str
    reportType: str
    sections: dict
    metadata: dict
```

### Metrics Response Model

```python
class MetricsResponse(BaseModel):
    company_name: str
    period: str
    financial_data: dict
```

### Insights Request Model

```python
class InsightsRequest(BaseModel):
    company_name: str
    period: str
    financial_data: dict
```

### Insights Response Model

```python
class InsightsResponse(BaseModel):
    insights: List[str]
    recommendations: List[str]
    executive_summary: str
    generated_at: str
```

### Chat Request Model

```python
class ChatRequest(BaseModel):
    query: str
```

### Chat Response Model

```python
class ChatResponse(BaseModel):
    response: str
```
