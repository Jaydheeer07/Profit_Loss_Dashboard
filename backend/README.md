# Profit & Loss Dashboard Backend

This is the FastAPI backend for the Profit & Loss Dashboard application, which processes and analyzes financial data from Xero accounting reports.

## Features

- **File Upload**: Upload and process Excel P&L reports via `/upload` endpoint
- **Financial Analysis**: Calculate key financial metrics and ratios via `/metrics` endpoint
- **AI-Powered Insights**: Generate financial insights and recommendations using LLM via `/insights` endpoint
- **Chat Interface**: Interact with LLM to ask financial questions via `/chat` endpoint
- **RESTful API**: Well-documented API endpoints with Swagger UI

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── analyzer.py   # Financial metrics endpoints
│   │   │   ├── insights.py   # LLM insights and chat endpoints
│   │   │   └── upload.py     # File upload endpoints
│   │   └── routes.py         # API route configuration
│   ├── core/
│   │   ├── analyzer.py       # P&L report analysis logic
│   │   ├── config.py         # Application configuration
│   │   └── validation.py     # Input validation
│   ├── models/
│   │   ├── financial.py      # Financial data models
│   │   ├── insights.py       # LLM insights and chat models
│   │   └── metrics.py        # Metrics response models
│   ├── services/
│   │   ├── llm_service.py    # LLM integration for insights and chat
│   │   └── mock_llm_response.py # Mock responses for testing
│   └── utils/
│       ├── categorization.py # Account categorization
│       ├── logger.py         # Centralized logging
│       └── ratios.py         # Financial ratio calculations
├── tests/
│   ├── data/                 # Test data files
│   └── test_insights_endpoint.py # Tests for insights endpoint
├── main.py                   # Application entry point
└── requirements.txt          # Project dependencies
```

## Setup and Installation

### Prerequisites

- Python 3.9+
- pip (Python package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/profit-loss-dashboard.git
   cd profit-loss-dashboard/backend
   ```
2. Create a virtual environment:

   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:

   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```
5. Create a `.env` file in the backend directory with the following variables:

   ```
   OPENAI_API_KEY=your_openai_api_key  # Optional, for LLM insights
   OPENAI_MODEL_NAME=gpt-4o-mini       # Optional, default model for insights
   ```

## Running the Application

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000, and the Swagger UI documentation at http://localhost:8000/docs.

## API Endpoints

### Upload Endpoint

- `POST /api/upload`: Upload and process a profit and loss Excel file
  - Validates the Excel file format and structure
  - Returns the parsed financial data in a standardized format

### Metrics Endpoint

- `POST /api/metrics`: Calculate financial metrics and prepare data for insights
  - Takes financial data from the upload endpoint
  - Calculates key financial ratios and metrics
  - Returns data formatted for the insights endpoint

### Insights Endpoints

- `POST /api/insights`: Generate AI-powered financial insights and recommendations

  - Takes formatted data from the metrics endpoint
  - Uses LLM to analyze financial data and generate insights
  - Returns insights, recommendations, and an executive summary
- `POST /api/chat`: Chat with the LLM about financial topics

  - Takes a user query as input
  - Returns a response from the LLM

API documentation is available via Swagger UI at http://localhost:8000/docs when the server is running.

## Testing

Run the test suite:

```bash
pytest
```

Generate test data:

```bash
python tests/create_sample_data.py
```

## Environment Variables

| Variable              | Description                           | Default                   |
| --------------------- | ------------------------------------- | ------------------------- |
| `OPENAI_API_KEY`    | API key for OpenAI (for LLM insights) | None                      |
| `OPENAI_MODEL_NAME` | Model to use for insights generation  | gpt-4o-mini               |
| `OPENAI_BASE_URL`   | Base URL for OpenAI API               | https://api.openai.com/v1 |

## Contributing

1. Follow PEP8 standards and use type hints
2. Format code with `black`
3. Use Pydantic v2 for data validation
4. Write Google-style docstrings for all functions
5. Add unit tests for new functionality
6. Update documentation as needed

## License

MIT
