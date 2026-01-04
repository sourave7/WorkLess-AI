"""
Document Processing Endpoints
Handles file uploads and document intelligence processing
"""

import os
import uuid
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status, Request
from fastapi.responses import FileResponse, JSONResponse
from datetime import datetime

from app.models.schemas import DocumentProcessResponse, ErrorResponse
from app.services.gemini_service import gemini_service
from app.services.supabase_service import supabase_service
from app.services.auth_service import AuthService
from app.middleware.auth import get_current_user
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Ensure upload directory exists
UPLOAD_DIR = Path(settings.UPLOAD_DIR)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def validate_file(file: UploadFile) -> None:
    """Validate uploaded file"""
    # Check file type
    if file.content_type not in settings.ALLOWED_FILE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed types: {', '.join(settings.ALLOWED_FILE_TYPES)}"
        )
    
    # File size will be checked when reading the file content


def save_uploaded_file(file: UploadFile, user_id: str) -> tuple[str, str]:
    """
    Save uploaded file to disk
    Returns: (file_path, file_url)
    """
    # Generate unique filename
    file_ext = Path(file.filename).suffix if file.filename else ".bin"
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Read and save file
    content = file.file.read()
    
    # Check file size
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum allowed size of {settings.MAX_FILE_SIZE / (1024*1024)}MB"
        )
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Generate URL (in production, use cloud storage URL)
    file_url = f"/uploads/{unique_filename}"
    
    return str(file_path), file_url


@router.post(
    "/process-document",
    response_model=DocumentProcessResponse,
    status_code=status.HTTP_200_OK,
    summary="Process Document with AI",
    description="Upload and process a document using Gemini 1.5 Pro for intelligent data extraction",
    responses={
        200: {"description": "Document processed successfully"},
        400: {"model": ErrorResponse, "description": "Invalid file or request"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        429: {"model": ErrorResponse, "description": "Rate limit exceeded"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def process_document(
    request: Request,
    file: UploadFile = File(..., description="Document file (JPG, PNG, or PDF)"),
    user_id: str = Form(..., description="User ID from authentication"),
    current_user: Optional[dict] = Depends(get_current_user)
):
    """
    Process a document using Gemini 1.5 Pro
    
    - **file**: Uploaded document file (JPG, PNG, or PDF, max 10MB)
    - **user_id**: Authenticated user ID
    - Returns structured data with extracted fields, AI explanation, and confidence scores
    """
    try:
        # Validate file
        validate_file(file)
        
        # Verify user_id matches authenticated user (if JWT is present)
        if current_user:
            token_user_id = current_user.get("sub") or current_user.get("user_id")
            if token_user_id and token_user_id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User ID mismatch"
                )
        
        # Check scan limits (if Supabase is configured)
        user_metadata = None
        can_scan = True
        if supabase_service:
            can_scan, user_metadata = supabase_service.check_scan_limit(user_id)
            if not can_scan:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Daily scan limit reached. Upgrade to Pro for unlimited scans."
                )
        
        # Create scan record (if Supabase is configured)
        scan_record = None
        if supabase_service:
            scan_record = supabase_service.create_scan_record(
                user_id=user_id,
                file_name=file.filename,
                file_size=file.size,
                status="processing"
            )
            
            if not scan_record:
                logger.error(f"Failed to create scan record for user {user_id}")
        
        # Read file content
        file.file.seek(0)  # Reset file pointer
        file_content = await file.read()
        
        # Save file to disk
        file_path, file_url = save_uploaded_file(file, user_id)
        
        # Process document with Gemini
        try:
            processing_result = await gemini_service.process_document(
                file_content=file_content,
                mime_type=file.content_type,
                user_id=user_id
            )
            
            # Update scan record to completed (if Supabase is configured)
            if supabase_service and scan_record:
                supabase_service.update_scan_status(
                    scan_id=scan_record["id"],
                    status="completed",
                    metadata={
                        "confidence_score": processing_result["confidence_score"],
                        "fields_extracted": len(processing_result["refined_data"])
                    }
                )
            
            # Update user statistics (if Supabase is configured)
            if supabase_service:
                today = datetime.utcnow().date().isoformat()
                is_today = user_metadata and user_metadata.get("last_scan_date") == today
                scans_today = (user_metadata.get("scans_today", 0) + 1) if is_today else 1
                total_scans = (user_metadata.get("total_scans", 0) if user_metadata else 0) + 1
                
                supabase_service.update_user_scan_stats(
                    user_id=user_id,
                    scans_today=scans_today,
                    total_scans=total_scans,
                    last_scan_date=today
                )
            
            # Build response
            # In production, file_url should be a full URL (e.g., from cloud storage)
            base_url = request.base_url
            full_file_url = str(base_url).rstrip("/") + file_url
            
            response = DocumentProcessResponse(
                original_image_url=full_file_url,
                refined_data=processing_result["refined_data"],
                ai_explanation=processing_result["ai_explanation"],
                formatting_changes=processing_result["formatting_changes"],
                confidence_score=processing_result["confidence_score"],
                processing_time=processing_result.get("processing_time")
            )
            
            logger.info(
                f"Document processed successfully for user {user_id}. "
                f"Fields extracted: {len(processing_result['refined_data'])}"
            )
            
            return response
            
        except Exception as e:
            # Update scan record to failed (if Supabase is configured)
            if supabase_service and scan_record:
                supabase_service.update_scan_status(
                    scan_id=scan_record["id"],
                    status="failed"
                )
            
            logger.error(f"Error processing document: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Document processing failed: {str(e)}"
            )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in process_document: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing your document"
        )


@router.get(
    "/uploads/{filename}",
    summary="Get Uploaded File",
    description="Retrieve an uploaded file by filename",
    response_class=FileResponse
)
async def get_uploaded_file(filename: str):
    """Get an uploaded file"""
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    # Determine media type
    media_type = "application/octet-stream"
    if filename.endswith(".jpg") or filename.endswith(".jpeg"):
        media_type = "image/jpeg"
    elif filename.endswith(".png"):
        media_type = "image/png"
    elif filename.endswith(".pdf"):
        media_type = "application/pdf"
    
    return FileResponse(
        path=file_path,
        media_type=media_type,
        filename=filename
    )
