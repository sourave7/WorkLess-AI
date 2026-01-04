"""
Gemini 1.5 Pro Document Intelligence Service
Handles document processing using Google's Gemini API
"""

import base64
import io
import time
import json
import re
from typing import List, Dict, Any, Optional
import google.generativeai as genai
import PIL.Image
from app.core.config import settings
from app.models.schemas import FieldData, FormattingChange
import logging

logger = logging.getLogger(__name__)


class GeminiService:
    """Gemini 1.5 Pro document intelligence service"""
    
    def __init__(self):
        self._model = None
        self._initialized = False
    
    def _ensure_initialized(self):
        """Lazy initialization of Gemini client"""
        if self._initialized:
            return
        
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY must be configured")
        
        # Configure Gemini API
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self._model = genai.GenerativeModel(settings.GEMINI_MODEL)
        self._initialized = True
    
    @property
    def model(self):
        """Get the Gemini model (lazy initialization)"""
        self._ensure_initialized()
        return self._model
    
    def _encode_image(self, image_data: bytes) -> str:
        """Encode image to base64"""
        return base64.b64encode(image_data).decode('utf-8')
    
    def _prepare_image_for_gemini(self, file_content: bytes, mime_type: str) -> Dict[str, Any]:
        """Prepare image part for Gemini API"""
        if mime_type == "application/pdf":
            # For PDF, we need to upload to Gemini first or convert to image
            # For now, we'll encode as base64 data URI
            base64_data = self._encode_image(file_content)
            return {
                "mime_type": mime_type,
                "data": base64_data
            }
        else:
            # For images, use inline base64
            base64_image = self._encode_image(file_content)
            return {
                "mime_type": mime_type,
                "data": base64_image
            }
    
    async def process_document(
        self,
        file_content: bytes,
        mime_type: str,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Process document using Gemini 1.5 Pro
        
        Returns structured data with extracted fields, explanations, and confidence scores
        """
        start_time = time.time()
        
        try:
            # Prepare the image/document for Gemini
            image_data = self._prepare_image_for_gemini(file_content, mime_type)
            
            # Construct the prompt for document intelligence
            prompt = """Analyze this document and extract structured data. 

Please:
1. Extract all relevant fields (Name, Date, Amount, Description, Reference, etc.)
2. Standardize date formats to ISO 8601 (YYYY-MM-DD)
3. Identify any OCR errors or inconsistencies
4. Provide confidence scores for each extracted field (0-100)
5. Explain what data points you identified and any formatting changes made

Return your analysis in the following JSON format:
{
  "fields": [
    {
      "field": "field_name",
      "value": "extracted_value",
      "confidence": 95
    }
  ],
  "explanation": "Brief explanation of what was found and processed",
  "formatting_changes": [
    {
      "type": "formatting|correction|structure",
      "message": "Description of change"
    }
  ],
  "overall_confidence": 95
}

Focus on accuracy and provide clear, structured data."""

            # Prepare content parts for Gemini
            if mime_type.startswith("image/"):
                # For images, use PIL Image
                image = PIL.Image.open(io.BytesIO(file_content))
                content_parts = [image, prompt]
            elif mime_type == "application/pdf":
                # For PDF, convert first page to image (simplified approach)
                # In production, you might want to extract all pages
                try:
                    from pdf2image import convert_from_bytes
                    images = convert_from_bytes(file_content, first_page=1, last_page=1)
                    if images:
                        content_parts = [images[0], prompt]
                    else:
                        raise ValueError("Failed to convert PDF to image")
                except ImportError:
                    # Fallback: treat as text (won't work well, but better than error)
                    logger.warning("pdf2image not installed, PDF processing may be limited")
                    content_parts = [prompt]
            else:
                # Fallback to text-only
                content_parts = [prompt]
            
            # Generate content using Gemini
            generation_config = genai.types.GenerationConfig(
                temperature=0.1,
                top_p=0.95,
                top_k=40,
                max_output_tokens=2048,
            )
            
            response = self.model.generate_content(
                content_parts,
                generation_config=generation_config
            )
            
            # Parse the response
            response_text = response.text
            
            # Extract JSON from response (handle cases where response includes markdown code blocks)
            # Try to find JSON in the response
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                json_str = json_match.group(0)
                parsed_response = json.loads(json_str)
            else:
                # Fallback: try to parse entire response as JSON
                try:
                    parsed_response = json.loads(response_text)
                except json.JSONDecodeError:
                    # If JSON parsing fails, create a fallback response
                    logger.warning("Failed to parse Gemini response as JSON, using fallback")
                    parsed_response = {
                        "fields": [],
                        "explanation": response_text,
                        "formatting_changes": [],
                        "overall_confidence": 0
                    }
            
            # Extract fields
            fields = parsed_response.get("fields", [])
            refined_data = [
                FieldData(
                    field=field.get("field", "Unknown"),
                    value=field.get("value", ""),
                    confidence=float(field.get("confidence", 0))
                )
                for field in fields
            ]
            
            # Extract formatting changes
            formatting_changes = [
                FormattingChange(
                    type=change.get("type", "formatting"),
                    message=change.get("message", "")
                )
                for change in parsed_response.get("formatting_changes", [])
            ]
            
            # Calculate overall confidence (average of field confidences)
            if refined_data:
                overall_confidence = sum(f.confidence for f in refined_data) / len(refined_data)
            else:
                overall_confidence = parsed_response.get("overall_confidence", 0)
            
            processing_time = time.time() - start_time
            
            return {
                "refined_data": refined_data,
                "ai_explanation": parsed_response.get("explanation", "Document processed successfully."),
                "formatting_changes": formatting_changes,
                "confidence_score": round(overall_confidence, 2),
                "processing_time": round(processing_time, 2)
            }
            
        except Exception as e:
            logger.error(f"Error processing document with Gemini: {e}", exc_info=True)
            raise Exception(f"Document processing failed: {str(e)}")
    
    def _fallback_extraction(self, file_content: bytes) -> Dict[str, Any]:
        """Fallback extraction method (basic OCR simulation)"""
        # This is a placeholder for a fallback method
        # In production, you might integrate with other OCR services
        return {
            "refined_data": [],
            "ai_explanation": "Document processing is temporarily unavailable.",
            "formatting_changes": [],
            "confidence_score": 0,
            "processing_time": 0
        }


# Global Gemini service instance
gemini_service = GeminiService()
