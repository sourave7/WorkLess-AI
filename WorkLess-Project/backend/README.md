# WorkLess AI - FastAPI Backend

Production-ready FastAPI backend for WorkLess AI document intelligence platform.

## 🏗️ Architecture

Professional layered architecture with clear separation of concerns:

```
backend/
├── app/
│   ├── api/              # API routes and endpoints
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   └── documents.py
│   │       └── router.py
│   ├── core/             # Core configuration and utilities
│   │   ├── config.py
│   │   └── logging_config.py
│   ├── middleware/       # Custom middleware
│   │   ├── auth.py
│   │   ├── rate_limiter.py
│   │   └── security.py
│   ├── models/           # Data models and schemas
│   │   └── schemas.py
│   └── services/         # Business logic services
│       ├── auth_service.py
│       ├── gemini_service.py
│       └── supabase_service.py
├── main.py              # FastAPI application entry point
├── requirements.txt     # Python dependencies
└── .env.example        # Environment variables template
```

## 🚀 Features

- ✅ **Professional Architecture**: Separate folders for models, routes, and services
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Rate Limiting**: Token bucket algorithm for API rate limiting
- ✅ **Security Headers**: Comprehensive security middleware
- ✅ **Gemini 1.5 Pro**: Advanced document intelligence processing
- ✅ **Supabase Integration**: Secure data storage and user management
- ✅ **File Upload Handling**: Secure file upload with validation
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **Request Tracking**: Request ID middleware for debugging

## 📋 Prerequisites

- Python 3.10+
- Supabase account and project
- Google Gemini API key

## 🛠️ Setup

### 1. Clone and Navigate

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

**Note for PDF Processing**: The `pdf2image` library requires `poppler` to be installed on your system:
- **Windows**: Download from [poppler-windows](https://github.com/oschwartz10612/poppler-windows/releases/) and add to PATH
- **macOS**: `brew install poppler`
- **Linux**: `sudo apt-get install poppler-utils` or `sudo yum install poppler-utils`

### 4. Configure Environment Variables

Copy `env.example` to `.env` and fill in your values:

```bash
cp env.example .env
```

Required environment variables:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Gemini
GEMINI_API_KEY=your-gemini-api-key

# Security (Change in production!)
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
```

### 5. Create Upload Directory

```bash
mkdir uploads
```

## 🏃 Running the Server

### Development

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/v1/docs
- **ReDoc**: http://localhost:8000/v1/redoc

## 📚 API Endpoints

### POST `/v1/documents/process-document`

Process a document using Gemini 1.5 Pro.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file`: Document file (JPG, PNG, or PDF, max 10MB)
  - `user_id`: User ID string

**Response:**
```json
{
  "original_image_url": "http://localhost:8000/uploads/uuid.jpg",
  "refined_data": [
    {
      "field": "Name",
      "value": "John Doe",
      "confidence": 98.5
    }
  ],
  "ai_explanation": "I have analyzed your document...",
  "formatting_changes": [
    {
      "type": "formatting",
      "message": "Standardized date format to ISO 8601"
    }
  ],
  "confidence_score": 96.5,
  "processing_time": 2.34
}
```

### GET `/v1/documents/uploads/{filename}`

Retrieve an uploaded file.

### GET `/health`

Health check endpoint.

## 🔒 Security Features

### JWT Authentication

The API supports JWT authentication via Bearer tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Rate Limiting

- Default: 100 requests per 60 seconds per client
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests in current window

### Security Headers

All responses include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security`
- `Content-Security-Policy`

## 🧪 Testing

Test the API using the interactive docs at `/v1/docs` or with curl:

```bash
curl -X POST "http://localhost:8000/v1/documents/process-document" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.jpg" \
  -F "user_id=user-123"
```

## 📝 Configuration

All configuration is managed through environment variables (see `.env.example`):

- **Rate Limiting**: `RATE_LIMIT_CALLS`, `RATE_LIMIT_PERIOD`
- **File Upload**: `MAX_FILE_SIZE`, `UPLOAD_DIR`, `ALLOWED_FILE_TYPES`
- **CORS**: `CORS_ORIGINS`
- **Logging**: `LOG_LEVEL`

## 🔧 Development

### Project Structure

- **`app/api/`**: API routes and endpoints
- **`app/core/`**: Core configuration and utilities
- **`app/middleware/`**: Custom middleware (auth, rate limiting, security)
- **`app/models/`**: Pydantic schemas for request/response models
- **`app/services/`**: Business logic services (Gemini, Supabase, Auth)

### Adding New Endpoints

1. Create endpoint file in `app/api/v1/endpoints/`
2. Add router to `app/api/v1/router.py`
3. Add corresponding schemas in `app/models/schemas.py`
4. Add business logic in `app/services/`

## 🚨 Production Checklist

Before deploying to production:

- [ ] Change `SECRET_KEY` and `JWT_SECRET_KEY` to strong random values
- [ ] Configure `ALLOWED_HOSTS` appropriately
- [ ] Set `ENVIRONMENT=production`
- [ ] Configure proper CORS origins
- [ ] Set up cloud storage for file uploads (S3, GCS, etc.)
- [ ] Configure proper logging and monitoring
- [ ] Set up SSL/TLS certificates
- [ ] Review and adjust rate limiting settings
- [ ] Set up database connection pooling
- [ ] Configure backup strategies

## 📄 License

Proprietary - WorkLess AI

## 🤝 Support

For issues or questions, please contact the development team.
