"""
Supabase client configuration for ProfitLens.
"""
from typing import Optional
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Get Supabase URL and key from environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://uiqbuaxglqrrxjqszsrk.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcWJ1YXhnbHFycnhqcXN6c3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NzY0ODgsImV4cCI6MjA2MjI1MjQ4OH0.82luYeq_2fbejb0fFp0HjgmlpfpR0q4vEFZ8hht0DoQ")

# Create a singleton instance of the Supabase client
_supabase_client: Optional[Client] = None

def get_supabase_client() -> Client:
    """
    Get the Supabase client instance.
    
    Returns:
        Client: The Supabase client instance.
    """
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _supabase_client
