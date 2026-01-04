# Render Deployment Guide

## 🚀 Quick Start: Deploy Backend to Render

### Prerequisites
- GitHub repository with your code
- Render account (free at [render.com](https://render.com))

---

## Step-by-Step Deployment

### 1. Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up (GitHub OAuth recommended)
3. Verify your email

### 2. Create New Web Service

1. **Dashboard** → Click **"New +"** → Select **"Web Service"**

2. **Connect Repository**:
   - Connect your GitHub account if not already connected
   - Select your repository
   - Click **"Connect"**

3. **Configure Service**:
   - **Name**: `workless-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend` ⚠️ **Important!**
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Plan Selection**:
   - **Free**: Spins down after 15 min inactivity (good for testing)
   - **Starter ($7/month)**: Always on (recommended for production)

5. **Click "Create Web Service"**

---

## 3. Configure Environment Variables

In the Render dashboard, go to **Environment** tab and add:

### Required Variables:

```
ENVIRONMENT=production
HOST=0.0.0.0
PORT=10000
```

### API Keys (Set these manually):

```
GEMINI_API_KEY=your-gemini-api-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Security Keys (Generate strong random strings):

```
SECRET_KEY=generate-a-strong-random-string-here
JWT_SECRET_KEY=generate-another-strong-random-string-here
```

**To generate secure keys:**
```bash
# On Linux/Mac:
openssl rand -hex 32

# Or use Python:
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### CORS Configuration:

```
CORS_ORIGINS=https://your-frontend.vercel.app,https://www.yourdomain.com
```

**Important**: Replace with your actual Vercel frontend URL(s)

### Optional Variables:

```
LOG_LEVEL=INFO
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

---

## 4. Deploy

1. Click **"Save Changes"** in Environment tab
2. Render will automatically start building
3. Watch the build logs
4. Once deployed, you'll get a URL like: `https://workless-backend.onrender.com`

---

## 5. Update Frontend Configuration

After backend is deployed:

1. **Copy your Render backend URL** (e.g., `https://workless-backend.onrender.com`)

2. **Update Vercel Frontend**:
   - Go to Vercel dashboard
   - Select your frontend project
   - Go to **Settings** → **Environment Variables**
   - Add/Update: `VITE_API_BASE_URL`
   - Value: `https://workless-backend.onrender.com`
   - Save and redeploy frontend

3. **Update Backend CORS**:
   - In Render dashboard, update `CORS_ORIGINS` environment variable
   - Add your Vercel frontend URL: `https://your-frontend.vercel.app`
   - Save (will trigger redeploy)

---

## 6. Verify Deployment

### Test Health Endpoint:
```bash
curl https://your-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "WorkLess AI API",
  "version": "1.0.0"
}
```

### Test API Docs:
Visit: `https://your-backend.onrender.com/v1/docs`

You should see the FastAPI interactive documentation.

---

## 🔧 Advanced Configuration

### Custom Domain (Optional)

1. In Render dashboard → **Settings** → **Custom Domains**
2. Add your domain
3. Follow DNS configuration instructions
4. Update `CORS_ORIGINS` to include custom domain

### Auto-Deploy from Git

Render automatically deploys on:
- Push to connected branch
- Manual deploy button

To disable auto-deploy:
- Settings → **Auto-Deploy** → Toggle off

### Environment-Specific Deployments

You can create separate services for:
- **Production**: `workless-backend-prod`
- **Staging**: `workless-backend-staging`

Use different branches or environments.

---

## 📊 Monitoring

### View Logs:
- Render dashboard → Your service → **Logs** tab
- Real-time logs available
- Download logs for analysis

### Metrics:
- **Metrics** tab shows:
  - Request count
  - Response times
  - Error rates
  - CPU/Memory usage

---

## ⚠️ Important Notes

### Free Tier Limitations:
- **Spins down after 15 minutes** of inactivity
- First request after spin-down takes ~30-60 seconds (cold start)
- **Solution**: Upgrade to Starter plan ($7/month) for always-on

### File Storage:
- Files saved to `./uploads` will persist on Render
- For production, consider migrating to S3/Cloudinary
- Current setup works but has limitations

### PDF Processing:
- `poppler` dependency may need special handling
- Render's build environment should support it
- If issues occur, may need custom buildpack

### Database:
- Supabase is external (no changes needed)
- All database operations work as-is

---

## 🐛 Troubleshooting

### Build Fails:
- Check build logs in Render dashboard
- Verify `requirements.txt` is correct
- Ensure Python version compatibility

### 502 Bad Gateway:
- Check if service is running (may be spun down on free tier)
- Check logs for errors
- Verify start command is correct

### CORS Errors:
- Verify `CORS_ORIGINS` includes exact frontend URL
- Check for trailing slashes
- Ensure protocol matches (https vs http)

### File Upload Issues:
- Check `UPLOAD_DIR` permissions
- Verify disk space
- Check file size limits

---

## ✅ Deployment Checklist

- [ ] Render account created
- [ ] Web service created
- [ ] Root directory set to `backend`
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] All environment variables added
- [ ] `CORS_ORIGINS` includes frontend URL
- [ ] Service deployed successfully
- [ ] Health endpoint responds
- [ ] Frontend `VITE_API_BASE_URL` updated
- [ ] Test API call from frontend
- [ ] Verify CORS works

---

## 🎉 Success!

Your backend is now deployed on Render! 

**Next Steps:**
1. Test all API endpoints
2. Monitor logs for any issues
3. Consider upgrading to Starter plan for production
4. Set up custom domain (optional)
5. Configure monitoring/alerts

**Support:**
- Render Docs: https://render.com/docs
- Render Community: https://community.render.com

