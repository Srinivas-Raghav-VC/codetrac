# CodeTrac Deployment Guide

This guide explains how to deploy your enhanced CodeTrac application to various hosting platforms.

## 🌐 Platform Options

### 1. Vercel (Recommended)
**Best for**: Quick deployment, excellent for React apps with Supabase
**Pricing**: Free tier available, paid plans start at $20/month

#### Setup Instructions:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   vercel
   ```

4. **Configure Environment Variables** in Vercel Dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

5. **Set up Domain** (optional):
   - Go to your project settings in Vercel
   - Add your custom domain

#### Vercel Configuration (`vercel.json`):
```json
{
  "build": {
    "env": {
      "SUPABASE_URL": "@supabase-url",
      "SUPABASE_ANON_KEY": "@supabase-anon-key",
      "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key"
    }
  },
  "functions": {
    "app/api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

### 2. Netlify
**Best for**: Static sites with serverless functions
**Pricing**: Free tier available

#### Setup Instructions:

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Same as Vercel

#### Netlify Configuration (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Railway
**Best for**: Full-stack apps with database
**Pricing**: Free tier with usage limits

#### Setup Instructions:

1. **Connect GitHub**: Link your repository
2. **Set Environment Variables**: In Railway dashboard
3. **Auto-deploy**: Configured automatically

### 4. Self-Hosting with Docker

#### Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  codetrac:
    build: .
    ports:
      - "3000:3000"
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    restart: unless-stopped
```

## 🔧 Pre-Deployment Checklist

### 1. Environment Variables
Ensure you have these configured:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Public anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (keep private!)

### 2. Build Configuration
Update your `package.json` if needed:
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "start": "vite preview --port $PORT"
  }
}
```

### 3. Database Setup
Make sure your Supabase:
- Edge Functions are deployed (`supabase functions deploy`)
- Database is properly configured
- Authentication is set up

### 4. API Configuration
Verify your API endpoints work:
- Test problem creation/fetching
- Verify authentication flows
- Check heatmap data generation

## 🚀 Quick Vercel Deployment (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Enhanced CodeTrac with learning paths"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Git Repository"
   - Select your CodeTrac repository
   - Add environment variables
   - Click "Deploy"

3. **Your app will be live at**: `https://your-project-name.vercel.app`

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to Git
- Use platform-specific secret management
- Rotate keys periodically

### Database Security
- Enable Row Level Security (RLS) in Supabase
- Use service role key only in server functions
- Implement proper user authentication

### Content Security
- Set up CORS properly
- Use HTTPS in production
- Implement rate limiting if needed

## 📊 Performance Optimization

### Build Optimization
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react', 'sonner']
        }
      }
    }
  }
}
```

### CDN and Caching
- Vercel automatically handles CDN
- Configure cache headers for static assets
- Use image optimization services

## 🛠 Troubleshooting

### Common Issues:

1. **Build Errors**:
   - Check Node.js version (use 18+)
   - Clear node_modules and reinstall
   - Verify all dependencies are installed

2. **Environment Variable Issues**:
   - Check variable names match exactly
   - Ensure no trailing spaces
   - Verify Supabase keys are correct

3. **Supabase Connection**:
   - Test connection with `supabase status`
   - Check network connectivity
   - Verify project URL format

4. **Authentication Problems**:
   - Check Supabase Auth settings
   - Verify redirect URLs
   - Test with simple login flow

### Debug Commands:
```bash
# Check build locally
npm run build
npm run preview

# Test Supabase connection
npx supabase status

# Check environment variables
echo $SUPABASE_URL
```

## 🎯 Custom Domain Setup

### For Vercel:
1. Go to Project Settings → Domains
2. Add your domain (e.g., `codetrac.yourdomain.com`)
3. Configure DNS records as shown
4. Wait for SSL certificate generation

### DNS Configuration:
```
Type: CNAME
Name: codetrac
Value: cname.vercel-dns.com
```

## 📈 Monitoring and Analytics

### Built-in Analytics:
- Vercel Analytics (free)
- Netlify Analytics
- Google Analytics integration

### Custom Monitoring:
```javascript
// Add to your app
const analytics = {
  track: (event, properties) => {
    // Your analytics implementation
    console.log('Event:', event, properties);
  }
};

// Track user actions
analytics.track('problem_added', { platform: 'codeforces' });
analytics.track('learning_path_created', { difficulty: 'intermediate' });
```

## 🔄 Continuous Deployment

### GitHub Actions (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🎉 You're Ready to Deploy!

Your enhanced CodeTrac application with learning paths, pattern tracking, and custom content creation is now ready for deployment. Choose Vercel for the easiest setup, or pick the platform that best fits your needs.

**Need help?** Check the troubleshooting section or create an issue in your repository.