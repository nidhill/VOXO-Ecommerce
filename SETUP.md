# WAVWAY E-Commerce Setup Guide

## Environment Variables

### Frontend (.env)
```
VITE_WHATSAPP_NUMBER=917025642617
VITE_API_URL=https://wavway.onrender.com
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID (Optional - for Google OAuth)
```

### Backend (.env)
```
PORT=5001
FRONTEND_URL=https://wavway.vercel.app
RESEND_API_KEY=YOUR_RESEND_API_KEY
FROM_EMAIL=your-email@resend.dev
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=wavway-uploads-og
R2_PUBLIC_URL=your_r2_public_url
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID (Optional - for Google OAuth)
```

## Features

### Authentication
- **Email/Password Login & Sign Up** ✅ (Fully implemented)
- **Google OAuth** (Optional - requires Google Client ID configuration)
- **Admin Login** (Hardcoded credentials: admin@wavway.com / admin123)
- **Guest Checkout** ✅

### Admin Panel
- **Dashboard** - View orders, products, sales analytics
- **Manage Products** - Add, edit, delete products with image upload
- **Manage Coupons** - Create and manage discount codes
- **Manage Banners** - Upload featured section banners and hero carousel images
- **Orders** - Track orders and update statuses

### E-Commerce Features
- **Product Catalog** - Browse and search products by category
- **Shopping Cart** - Add/remove items with quantity control
- **Checkout** - WhatsApp-based order confirmation
- **Order Tracking** - Track order status using order ID
- **Image Storage** - All images stored on Cloudflare R2
- **Cache Busting** - Automatic image cache invalidation on updates

### WhatsApp Integration
- **Order Confirmation** - Formatted order messages with product links
- **Direct Messaging** - "Buy Now via WhatsApp" buttons on products
- **Order Summaries** - Detailed order info with pricing breakdown

## Getting Started

### Local Development

**Backend:**
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5001
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5174
```

### Admin Access
1. Navigate to `/admin/login`
2. Use credentials: `admin@wavway.com` / `admin123`
3. Access admin dashboard at `/admin/dashboard`

### Optional: Google OAuth Setup

1. Create a Google Cloud project at https://console.cloud.google.com
2. Create an OAuth 2.0 credential (Web Application)
3. Add the following URIs:
   - Authorized JavaScript origins: `http://localhost:5173`, `http://localhost:5174`, `https://wavway.vercel.app`
   - Authorized redirect URIs: `https://wavway.vercel.app/auth`
4. Copy the Client ID
5. Add to frontend `.env`: `VITE_GOOGLE_CLIENT_ID=your_client_id`
6. Add to backend `.env`: `GOOGLE_CLIENT_ID=your_client_id`
7. Restart both servers

## API Endpoints

### Authentication
- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google OAuth (requires valid credential)
- `GET /api/auth/me` - Get current user (requires token)

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id` - Update order status (admin)

### WhatsApp
- `POST /api/whatsapp/generate-order-message` - Generate order message
- `POST /api/whatsapp/create-order-summary` - Create detailed order summary

### Settings (Admin)
- `GET /api/settings/homepage-banners` - Get featured banners
- `PUT /api/settings/homepage-banners` - Update featured banners
- `GET /api/settings/hero-images` - Get hero carousel images
- `PUT /api/settings/hero-images` - Update hero carousel images

## Troubleshooting

### Google Sign-In Shows "Client ID not found" Error
- **Solution**: The VITE_GOOGLE_CLIENT_ID is not configured. Either:
  - Configure it following the setup steps above, OR
  - Disable Google OAuth (it's optional - the app works fine with email/password)

### Images Not Loading from R2
- **Solution**: Ensure R2_PUBLIC_URL is correctly set in backend .env
- **Troubleshooting**: Test with `curl https://your-r2-public-url/test.jpg`

### Admin Panel 404 on `/admin/login`
- **Solution**: This is expected in production. Ensure vercel.json SPA rewrite is in place:
  ```json
  {
    "rewrites": [
      { "source": "/((?!api/|.*\\..*).*)", "destination": "/index.html" }
    ]
  }
  ```

### Orders API Returns 404
- **Solution**: Backend is offline or not redeployed after code changes
- **Check**: Visit https://wavway.onrender.com/api/storage (should return JSON)

## Deployments

- **Frontend**: Deployed to Vercel (https://wavway.vercel.app)
- **Backend**: Deployed to Render (https://wavway.onrender.com)
- **Database**: MongoDB Atlas
- **Image Storage**: Cloudflare R2

To redeploy:
1. Push changes to GitHub main branch
2. Vercel/Render auto-deploy from main (configured via webhooks)
