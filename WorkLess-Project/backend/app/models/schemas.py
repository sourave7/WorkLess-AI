"""
Pydantic Schemas for Request/Response Models
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class ProcessingStatus(str, Enum):
    """Processing status enumeration"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class FieldData(BaseModel):
    """Extracted field data schema"""
    field: str = Field(..., description="Field name")
    value: str = Field(..., description="Field value")
    confidence: float = Field(..., ge=0, le=100, description="Confidence score (0-100)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "field": "Name",
                "value": "John Doe",
                "confidence": 98.5
            }
        }


class FormattingChange(BaseModel):
    """Formatting change log entry"""
    type: str = Field(..., description="Type of change: formatting, correction, structure")
    message: str = Field(..., description="Description of the change")
    
    class Config:
        json_schema_extra = {
            "example": {
                "type": "formatting",
                "message": "Standardized date format to ISO 8601 (YYYY-MM-DD)"
            }
        }


class DocumentProcessResponse(BaseModel):
    """Response schema for document processing"""
    original_image_url: str = Field(..., description="URL to the original uploaded image")
    refined_data: List[FieldData] = Field(..., description="Extracted and refined data fields")
    ai_explanation: str = Field(..., description="AI-generated explanation of processing")
    formatting_changes: List[FormattingChange] = Field(
        default_factory=list,
        description="List of formatting changes made"
    )
    confidence_score: float = Field(..., ge=0, le=100, description="Overall confidence score")
    processing_time: Optional[float] = Field(None, description="Processing time in seconds")
    
    class Config:
        json_schema_extra = {
            "example": {
                "original_image_url": "https://example.com/uploads/file.jpg",
                "refined_data": [
                    {
                        "field": "Name",
                        "value": "John Doe",
                        "confidence": 98
                    },
                    {
                        "field": "Date",
                        "value": "2026-01-02",
                        "confidence": 95
                    }
                ],
                "ai_explanation": "I have analyzed your document and identified key data points.",
                "formatting_changes": [
                    {
                        "type": "formatting",
                        "message": "Standardized date format to ISO 8601"
                    }
                ],
                "confidence_score": 96.5
            }
        }


class ErrorResponse(BaseModel):
    """Error response schema"""
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    request_id: Optional[str] = Field(None, description="Request ID for tracking")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    service: str
    version: str
