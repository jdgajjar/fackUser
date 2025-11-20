# Fake User Generator

A full-stack web application for creating and managing fake user generation tasks. The application allows you to create multiple simultaneous tasks that run in the background, simulating natural user behavior by visiting random pages with realistic timing patterns.

## Features

- 🎯 **Target Any Website**: Enter any website URL to create fake users
- 🔢 **Scalable**: Create up to 10,000 fake users per task
- 🔄 **Background Processing**: Tasks continue running even if you close the browser
- 📊 **Real-time Monitoring**: Track progress and view detailed statistics
- 🎭 **Natural Behavior**: Simulates realistic user behavior with random page visits and timing
- ⚡ **Multiple Concurrent Tasks**: Run multiple tasks for different URLs simultaneously
- 📝 **Activity Logs**: Detailed logging of all operations and errors
- 💯 **Free Deployment**: Fully configured for Render's free plan

## Technology Stack

### Backend
- **Node.js** with Express.js
- **Axios** for HTTP requests
- **Cheerio** for HTML parsing
- In-memory task storage (easily replaceable with a database)

### Frontend
- **React** 18
- **Axios** for API communication
- Modern, responsive UI with CSS animations
- Real-time task updates

## Architecture

```
┌─────────────────┐
│   React UI      │ ◄─── User Interface
└────────┬────────┘
         │ HTTP/REST API
┌────────▼────────┐
│  Express API    │ ◄─── API Layer
└────────┬────────┘
         │
┌────────▼────────┐
│ Task Processor  │ ◄─── Background Worker
└────────┬────────┘
         │
┌────────▼────────┐
│ Fake User       │ ◄─── User Simulation
│ Service         │
└─────────────────┘
```

## Installation & Local Development

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd fake-user-generator
```

2. **Install dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. **Run in development mode**

In one terminal, start the backend:
```bash
npm run dev:backend
```

In another terminal, start the frontend:
```bash
npm run dev:frontend
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3000/api

### Build for Production

```bash
# Build frontend
npm run build:frontend

# Start production server
npm start
```

## Deployment to Render (Free Plan)

### Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and configure everything
   - Click "Apply" to deploy

### Option 2: Manual Setup

1. **Create a new Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the service**
   - **Name**: fake-user-generator
   - **Region**: Oregon (or your preferred region)
   - **Branch**: main
   - **Runtime**: Node
   - **Build Command**: `npm install && cd frontend && npm install && npm run build && cd ..`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Environment Variables**
   - `NODE_ENV`: production
   - `PORT`: 10000 (automatically set by Render)

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)

### Important Notes for Free Plan

⚠️ **Render Free Plan Limitations**:
- Services spin down after 15 minutes of inactivity
- First request after inactivity may take 30-60 seconds (cold start)
- 750 hours of free usage per month
- Services are publicly accessible

💡 **Tips**:
- Tasks will pause when the service spins down but will resume when it restarts
- For production use, consider upgrading to a paid plan
- The application uses in-memory storage, so tasks will be lost on restart

## API Documentation

### Endpoints

#### Get All Tasks
```
GET /api/tasks
```

#### Get Task by ID
```
GET /api/tasks/:id
```

#### Create New Task
```
POST /api/tasks
Content-Type: application/json

{
  "targetUrl": "https://example.com",
  "userCount": 100
}
```

#### Stop Task
```
POST /api/tasks/:id/stop
```

#### Delete Task
```
DELETE /api/tasks/:id
```

#### Get Task Statistics
```
GET /api/tasks/:id/stats
```

#### Health Check
```
GET /health
```

## Usage Guide

### Creating a Task

1. Enter the target website URL (e.g., `https://example.com`)
2. Specify the number of users to create (1-10,000)
3. Click "Create Task"
4. The task will start automatically and run in the background

### Monitoring Tasks

- **Task List**: View all tasks with their current status
- **Progress Bar**: Visual indication of completion percentage
- **Status Badges**: 
  - ⏳ Pending - Task queued
  - 🔄 Running - Currently processing
  - ✅ Completed - Successfully finished
  - ⏹️ Stopped - Manually stopped
  - ❌ Failed - Encountered errors

### Task Details

Click on any task to view:
- Detailed progress information
- Real-time activity logs
- Error logs (if any)
- Task duration and statistics

### Managing Tasks

- **Stop**: Click the stop button (⏹️) to halt a running task
- **Delete**: Remove completed or stopped tasks
- **Resume**: Running tasks automatically resume after server restart

## Natural User Behavior Simulation

The application simulates realistic user behavior:

1. **Random User Data**: Generates unique usernames, emails, and profile information
2. **Page Navigation**: Visits 2-5 random pages from the target website
3. **Natural Timing**: Random delays between actions (500ms - 3000ms)
4. **Realistic Headers**: Uses various user agents and browser headers
5. **Referrer Tracking**: Maintains proper referrer chains

## Testing

Run the test suite:
```bash
npm test
```

## Project Structure

```
fake-user-generator/
├── backend/
│   ├── controllers/
│   │   └── taskController.js      # Request handlers
│   ├── models/
│   │   └── taskStore.js           # Data storage
│   ├── routes/
│   │   └── tasks.js               # API routes
│   ├── services/
│   │   ├── taskProcessor.js       # Background task processing
│   │   └── fakeUserService.js     # User simulation logic
│   └── server.js                  # Express server
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── TaskForm.js        # Create task form
│       │   ├── TaskList.js        # Task list view
│       │   └── TaskDetails.js     # Task details panel
│       ├── services/
│       │   └── api.js             # API client
│       ├── App.js                 # Main app component
│       └── index.js               # Entry point
├── render.yaml                    # Render deployment config
├── package.json                   # Backend dependencies
└── README.md                      # This file
```

## Security Considerations

⚠️ **Important**: This application is for educational purposes only.

- Always obtain permission before testing on any website
- Respect robots.txt and terms of service
- Use responsibly and ethically
- Consider implementing rate limiting in production
- Add authentication for multi-user scenarios

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication and authorization
- [ ] Task scheduling and cron jobs
- [ ] Export task results to CSV/JSON
- [ ] Advanced configuration options
- [ ] Captcha solving integration
- [ ] Proxy support for distributed requests
- [ ] Email notifications on task completion

## Troubleshooting

### Tasks not starting
- Check the browser console for errors
- Verify the backend is running
- Check network connectivity

### Deployment issues
- Ensure all dependencies are in package.json
- Verify build command runs successfully locally
- Check Render logs for errors

### Cold start delays
- This is normal for free plan services
- First request after inactivity takes 30-60 seconds
- Consider upgrading to paid plan for instant availability

## Cost Breakdown (Free!)

✅ **Everything is FREE**:
- Render Free Plan: $0/month
- Frontend Hosting: Included
- Backend Hosting: Included
- Database: In-memory (no cost)

Total Monthly Cost: **$0.00**

## License

MIT License - feel free to use this project for learning and development.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Render logs if deployed
3. Open an issue on GitHub

---

**Disclaimer**: This tool is for educational and testing purposes only. Always use responsibly and with proper authorization.
