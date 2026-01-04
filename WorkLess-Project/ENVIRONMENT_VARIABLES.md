# Environment Variables Guide

This document lists all required environment variables for both Frontend and Backend.

## Frontend Environment Variables (.env)

Create a `.env` file in the **root directory** (same level as `package.json`) with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend API URL (optional - defaults to http://localhost:8000)
VITE_API_BASE_URL=http://localhost:8000
```

### Frontend Variables for Vercel

Add these in your Vercel project settings under **Environment Variables**:

1. **VITE_SUPABASE_URL**
   - Description: Your Supabase project URL
   - Example: `https://ttmoutefjhkhmjuydemi.supabase.co`
   - Environment: Production, Preview, Development

2. **VITE_SUPABASE_ANON_KEY**
   - Description: Your Supabase anonymous/public key
   - Example: `sb_publishable_m5X56fCNjyEQhb7HfeTL-g_QBGhHSPy`
   - Environment: Production, Preview, Development

3. **VITE_API_BASE_URL** (Optional)
   - Description: Your deployed backend API URL
   - Example: `https://your-backend-api.vercel.app` or `https://api.workless-ai.com`
   - Environment: Production, Preview, Development
   - Note: If not set, defaults to `http://localhost:8000` (which won't work in production)
   - ⚠️ **IMPORTANT**: Gemini API key should NOT be in frontend - it's backend-only for security

## Backend Environment Variables (.env)

Create a `.env` file in the **backend/** directory with the following variables:

```env
# Environment
ENVIRONMENT=production

# Server Configuration
HOST=0.0.0.0
PORT=8000

# Security (IMPORTANT: Change these in production!)
SECRET_KEY=your-secret-key-here-change-in-production
JWT_SECRET_KEY=your-jwt-secret-key-here-change-in-production

# CORS Origins (comma-separated, add your frontend URL)
CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_CALLS=100
RATE_LIMIT_PERIOD=60

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Gemini 1.5 Pro Configuration
GEMINI_API_KEY=your-gemini-api-key

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Logging
LOG_LEVEL=INFO
```

### Backend Variables for Vercel (if deploying backend to Vercel)

If you're deploying the backend to Vercel, add these environment variables:

1. **ENVIRONMENT**
   - Value: `production`
   - Environment: Production

2. **SECRET_KEY**
   - Description: Secret key for encryption (generate a strong random string)
   - Environment: Production, Preview, Development

3. **JWT_SECRET_KEY**
   - Description: Secret key for JWT token signing (generate a strong random string)
   - Environment: Production, Preview, Development

4. **CORS_ORIGINS**
   - Description: Comma-separated list of allowed origins
   - Example: `https://your-frontend.vercel.app,https://www.yourdomain.com`
   - Environment: Production, Preview, Development

5. **SUPABASE_URL**
   - Description: Your Supabase project URL
   - Environment: Production, Preview, Development

6. **SUPABASE_KEY**
   - Description: Your Supabase anonymous/public key
   - Environment: Production, Preview, Development

7. **SUPABASE_SERVICE_ROLE_KEY**
   - Description: Your Supabase service role key (for admin operations)
   - Environment: Production, Preview, Development
   - ⚠️ **WARNING**: Keep this secret! Never expose in frontend code.

8. **GEMINI_API_KEY**
   - Description: Your Google Gemini API key
   - Get it from: AIzaSyCUVMBUG3Rr_VUn6rXVTWGzMkon2P1HYsQ
   - Environment: Production, Preview, Development

9. **UPLOAD_DIR** (Optional)
   - Default: `./uploads`
   - Environment: Production, Preview, Development

10. **MAX_FILE_SIZE** (Optional)
    - Default: `10485760` (10MB)
    - Environment: Production, Preview, Development

11. **LOG_LEVEL** (Optional)
    - Default: `INFO`
    - Options: `DEBUG`, `INFO`, `WARNING`, `ERROR`
    - Environment: Production, Preview, Development

## How to Get API Keys

### Supabase Keys
1. Go to https://supabase.com
2. Create a new project or select existing project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL` (frontend) and `SUPABASE_URL` (backend)
   - **anon public** key → `VITE_SUPABASE_ANON_KEY` (frontend) and `SUPABASE_KEY` (backend)
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (backend only)

### Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key → `GEMINI_API_KEY` (backend)

## Important Notes

1. **Never commit `.env` files** to version control. They are already in `.gitignore`.

2. **Vite Environment Variables**: Frontend variables must be prefixed with `VITE_` to be accessible in the browser.

3. **Security**: 
   - Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code
   - Use strong, random values for `SECRET_KEY` and `JWT_SECRET_KEY` in production
   - Rotate keys regularly

4. **CORS**: Make sure to add your production frontend URL to `CORS_ORIGINS` in the backend.

5. **API Base URL**: In production, set `VITE_API_BASE_URL` to your deployed backend URL, not `localhost`.

