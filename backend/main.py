from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.utils.logger import app_logger
from app.core.config import settings

# Configure module-specific logger
logger = app_logger.getChild('main')

# Log loaded configuration settings
logger.info(f"Starting application with configuration:")
logger.info(f"API Version: {settings.API_VERSION}")
logger.info(f"OpenAI API Key: {'Configured' if settings.is_openai_configured else 'Not configured'}")
if settings.is_openai_configured:
    logger.info(f"OpenAI API Key starts with: {settings.OPENAI_API_KEY[:4]}...")
logger.info(f"OpenAI Model: {settings.OPENAI_MODEL_NAME}")
logger.info(f"Development Mode: {settings.DEV_MODE}")
logger.info(f"Using Mock Responses: {settings.use_mock_responses}")

# Create FastAPI application
app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

# Include API routes
app.include_router(router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {"message": "Welcome to the Profit & Loss Dashboard API"}