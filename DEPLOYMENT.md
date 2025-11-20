# Deployment Guide - Render Free Plan

This guide will walk you through deploying the Fake User Generator application on Render's free plan.

## Prerequisites

- GitHub account
- Render account (sign up at https://render.com)
- Git installed on your local machine

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Initialize Git Repository** (if not already done)
```bash
cd fake-user-generator
git init
git add .
git commit -m "Initial commit: Fake User Generator"
```

2. **Create GitHub Repository**
   - Go to GitHub and create a new repository
   - Don't initialize with README (we already have one)
   - Copy the repository URL

3. **Push to GitHub**
```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

#### Method 1: Using Blueprint (Easiest)

1. **Access Render Dashboard**
   - Go to https://dashboard.render.com/
   - Sign in or create an account (free)

2. **Create New Blueprint**
   - Click "New +" button in the top right
   - Select "Blueprint"
   
3. **Connect Repository**
   - Click "Connect account" to link your GitHub
   - Authorize Render to access your repositories
   - Select your repository
   - Click "Connect"

4. **Apply Blueprint**
   - Render will automatically detect the `render.yaml` file
   - Review the configuration:
     - Service name: fake-user-generator
     - Type: Web Service
     - Environment: Node
     - Plan: Free
   - Click "Apply"

5. **Wait for Deployment**
   - Initial deployment takes 5-10 minutes
   - Watch the build logs for any errors
   - Once complete, you'll see "Live" status

6. **Access Your Application**
   - Click on the service name
   - Find the URL (e.g., `https://fake-user-generator.onrender.com`)
   - Click to open your deployed application

#### Method 2: Manual Web Service Setup

If you prefer manual setup:

1. **Create Web Service**
   - Dashboard → "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

2. **Configure Service**
   ```
   Name: fake-user-generator
   Region: Oregon (or nearest to you)
   Branch: main
   Runtime: Node
   Build Command: npm install && cd frontend && npm install && npm run build && cd ..
   Start Command: npm start
   Instance Type: Free
   ```

3. **Environment Variables**
   ```
   NODE_ENV = production
   PORT = 10000
   ```
   (PORT is usually auto-set by Render)

4. **Advanced Settings** (Optional)
   - Health Check Path: `/health`
   - Auto-Deploy: Yes

5. **Create Web Service**
   - Click "Create Web Service"
   - Wait for deployment

### Step 3: Verify Deployment

1. **Check Health Endpoint**
   - Visit: `https://your-app.onrender.com/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

2. **Test the Application**
   - Open the main URL
   - Create a test task with a small number of users (e.g., 5)
   - Monitor the progress
   - Verify task completion

3. **Check Logs**
   - In Render dashboard → Your service → Logs
   - Look for any errors or warnings

### Step 4: Understanding Free Plan Limitations

⚠️ **Important Free Plan Behaviors**

1. **Automatic Spin Down**
   - Service goes to sleep after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds (cold start)
   - All tasks in progress will pause during sleep

2. **Automatic Spin Up**
   - Any incoming HTTP request wakes the service
   - Tasks will resume from where they left off
   - May show brief loading state

3. **Monthly Hours**
   - 750 free hours per month
   - More than enough for testing and demos

4. **Data Persistence**
   - In-memory storage means tasks are lost on restarts
   - For persistence, upgrade to paid plan with database

## Troubleshooting

### Build Fails

**Problem**: Build command fails during deployment

**Solutions**:
- Check that `package.json` is in the root directory
- Ensure `frontend/package.json` exists
- Verify Node version compatibility (requires Node 18+)
- Check build logs for specific error messages

**Fix**:
```bash
# Test locally first
npm install
cd frontend && npm install && npm run build && cd ..
npm start
```

### Application Won't Start

**Problem**: Service shows "Failed" or won't start

**Solutions**:
- Check start command is correct: `npm start`
- Verify `backend/server.js` exists
- Ensure all dependencies are installed
- Check environment variables are set

**Check**:
- Logs tab in Render dashboard
- Look for "Error" or "Failed" messages

### Blank Page After Deployment

**Problem**: App loads but shows blank page

**Solutions**:
- Check browser console for errors
- Verify API requests are going to correct URL
- Ensure build command completed successfully
- Check that `frontend/build` directory was created

**Fix**:
```bash
# Rebuild frontend locally
cd frontend
npm run build
# Check that build folder is created
ls -la build/
```

### API Requests Fail

**Problem**: Frontend can't communicate with backend

**Solutions**:
- Check that `proxy` is set in `frontend/package.json`
- Verify backend is running (check logs)
- Test health endpoint: `/health`
- Check CORS settings

### Cold Start Takes Too Long

**Problem**: First request takes > 60 seconds

**Solutions**:
- This is normal for free plan
- Keep service warm with external monitoring (e.g., UptimeRobot - free tier)
- Upgrade to paid plan for instant availability

**Workaround**:
- Use a service like UptimeRobot to ping your app every 14 minutes
- Set up: https://uptimerobot.com (free tier available)

## Keeping Your Service Warm (Optional)

To avoid cold starts, use a monitoring service:

### Using UptimeRobot (Free)

1. Go to https://uptimerobot.com
2. Sign up (free account)
3. Add New Monitor:
   - Monitor Type: HTTP(s)
   - Friendly Name: Fake User Generator
   - URL: Your Render URL + /health
   - Monitoring Interval: 14 minutes
4. Save monitor

This will ping your service every 14 minutes, keeping it warm.

## Updating Your Deployment

### Automatic Updates

When you push to GitHub main branch:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render automatically:
1. Detects the push
2. Rebuilds the application
3. Deploys the new version

### Manual Deploy

In Render dashboard:
1. Go to your service
2. Click "Manual Deploy"
3. Select "Clear build cache & deploy"

## Monitoring Your Application

### Render Dashboard

- **Logs**: View real-time application logs
- **Metrics**: CPU and memory usage
- **Events**: Deployment history
- **Settings**: Update configuration

### Application Monitoring

The app includes:
- Health check endpoint: `/health`
- Real-time task monitoring in UI
- Activity logs for each task
- Error tracking

## Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Render Web Service | Free | $0.00 |
| GitHub Repository | Free | $0.00 |
| Domain (render.com) | Included | $0.00 |
| SSL Certificate | Included | $0.00 |
| **Total** | | **$0.00/month** |

## Upgrade Options (Optional)

If you need more reliability:

| Feature | Free Plan | Starter Plan ($7/month) |
|---------|-----------|------------------------|
| Auto-sleep | After 15 min | Never |
| Hours/month | 750 | Unlimited |
| Cold starts | Yes | No |
| Custom domain | No | Yes |
| SSL | Yes | Yes |

## Production Checklist

Before going live with real users:

- [ ] Test all features thoroughly
- [ ] Add authentication/authorization
- [ ] Implement rate limiting
- [ ] Add database for persistence
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure custom domain
- [ ] Add analytics
- [ ] Implement backup strategy
- [ ] Set up monitoring alerts
- [ ] Document API thoroughly
- [ ] Add user documentation

## Security Considerations

For production use:

1. **Add Authentication**
   - Implement user login
   - Use JWT tokens
   - Protect API endpoints

2. **Rate Limiting**
   - Limit task creation per user
   - Throttle API requests
   - Prevent abuse

3. **Input Validation**
   - Sanitize all inputs
   - Validate URLs
   - Check user count limits

4. **Environment Variables**
   - Use secrets for sensitive data
   - Don't commit .env files
   - Rotate keys regularly

## Support Resources

- **Render Documentation**: https://render.com/docs
- **Render Community**: https://community.render.com
- **GitHub Issues**: (your repo)/issues
- **Node.js Docs**: https://nodejs.org/docs
- **React Docs**: https://react.dev

## Next Steps

After successful deployment:

1. ✅ Share your app URL
2. ✅ Test with real scenarios
3. ✅ Gather user feedback
4. ✅ Plan feature enhancements
5. ✅ Consider upgrading if needed

---

🎉 **Congratulations!** Your Fake User Generator is now live and accessible from anywhere!

Remember: Use this tool responsibly and only with proper authorization.
