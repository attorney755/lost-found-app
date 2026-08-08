# Lost and Found Finder Platform

A web application connecting people who have lost belongings with finders across Kigali and Rwanda.

Developed by Attorney Valois NIYIGABA.

---

## Features

- Item Reporting and Search: Report lost or found items with photos, category tags, location details, occurrence date, contact info, and reward amounts.
- Address Autocomplete Engine: Real-time location suggestions for districts and landmarks in Kigali and Rwanda.
- Google Single Sign-On (SSO) and Email Authentication: One-click Google login and traditional email/password registration with JWT session management.
- Admin Analytics Dashboard: Control panel featuring interactive rating distribution charts, user management, item moderation, and system statistics.
- Real-time Notifications Popover: Floating header bell popover dropdown with unread count badges for notification previews.
- Found Claims and Photo Verification: Finder-owner claim verification workflow with built-in messaging.
- Community Feedback and Testimonials: User reviews and ratings displayed dynamically on the homepage with an option to post feedback anonymously.
- Support and Buy Me a Coffee (MoMo): Integrated MTN Mobile Money (0794729150) support modal with 1-click number copying and USSD dialing helper (*182*8*1*0794729150#).
- Dark Mode and Modern Interface: Modern glassmorphism UI built with TailwindCSS, micro-animations, and theme switching.

---

## Technology Stack

### Frontend
- Framework: React 18 (Single Page Application)
- Routing: React Router DOM v6
- Styling: TailwindCSS, Vanilla CSS
- Icons: Lucide React
- Charts: Recharts
- Bundler: esbuild / Vite

### Backend
- Runtime: Node.js (v18+)
- Framework: Express.js
- Authentication: JSON Web Tokens (JWT), bcryptjs, Google Identity Services
- Security: Helmet, CORS, Input Sanitization
- Database: MongoDB Atlas (Mongoose ODM) with automatic in-memory fallback (mongodb-memory-server)

---

## Project Directory Structure

```text
lost-found-app/
├── client/                     # React Frontend Application
│   ├── dev-server.cjs          # Express dev server proxying API to port 5000
│   ├── index.html              # HTML5 entrypoint with SEO meta tags
│   ├── public/                 # Static assets (images, banners, favicon)
│   │   ├── app.js              # Bundled JavaScript distribution
│   │   └── signup_banner.jpg   # Signup banner asset
│   └── src/
│       ├── App.jsx             # Main Application routing and layout tree
│       ├── index.jsx           # React DOM root entrypoint
│       ├── components/
│       │   ├── admin/          # AdminSidebar, AdminLayout, StatCard
│       │   ├── auth/           # GoogleAuthButton
│       │   ├── common/         # Navbar, Footer, AddressAutocompleteInput
│       │   ├── items/          # ItemCard, ItemDetailModal
│       │   └── public/         # HeroSection, TestimonialsSection
│       ├── context/
│       │   └── AuthContext.jsx # Global Authentication and session state
│       ├── pages/
│       │   ├── admin/          # AdminDashboard, AdminUsers, AdminFeedback, AdminItems
│       │   ├── auth/           # Login, Register, ForgotPassword, ResetPassword
│       │   ├── public/         # Home, Browse, HowItWorksPage, PricingPage, ContactPage
│       │   └── Dashboard.jsx   # User Dashboard (My Items, Post Item, Claims)
│       └── services/
│           └── api.js          # Axios API instance configuration
│
└── server/                     # Node.js Express REST API Backend
    ├── .env                    # Environment variables configuration
    ├── package.json            # Server dependencies and scripts
    └── src/
        ├── server.js           # Server entrypoint and database connection
        ├── config/
        │   └── database.js     # MongoDB Atlas connection and in-memory fallback
        ├── middleware/
        │   ├── auth.js         # JWT verification and admin route protection
        │   └── validation.js   # Request payload validation middleware
        ├── models/
        │   ├── auth/User.js    # User Mongoose Schema
        │   ├── items/Item.js  # Item (Lost/Found) Mongoose Schema
        │   └── Feedback.js     # Feedback and Rating Mongoose Schema
        ├── controllers/
        │   ├── auth/           # login.js, register.js, googleAuth.js, password.js
        │   ├── items/          # itemController.js
        │   ├── feedbackController.js
        │   └── adminController.js
        └── routes/
            ├── auth.js         # Authentication API routes (/api/auth)
            ├── items.js        # Items API routes (/api/items)
            ├── feedback.js     # Feedback API routes (/api/feedback)
            ├── admin.js        # Admin management routes (/api/admin)
            └── index.js        # API router aggregator
```

---

## Step-by-Step Installation and Initial Setup Guide

### Prerequisites
- Node.js version 18.0.0 or higher
- npm version 9.0.0 or higher
- Git installed on your operating system
- MongoDB database connection URI (MongoDB Atlas cluster or local MongoDB instance)

---

### 1. Linux Setup (Ubuntu / Debian / Fedora / Arch)

1. Clone the Repository:
   ```bash
   git clone https://github.com/your-username/lost-found-app.git
   cd lost-found-app
   ```

2. Install Server Dependencies:
   ```bash
   cd server
   npm install
   cd ..
   ```

3. Install Client Dependencies:
   ```bash
   cd client
   npm install
   cd ..
   ```

4. Configure Server Environment Variables:
   Create a `.env` file in the `server/` directory:
   ```ini
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_custom_secure_jwt_secret_key
   JWT_EXPIRE=7d
   ```

5. Start Backend Server:
   ```bash
   cd server
   node src/server.js
   ```

6. Start Frontend Client (in a separate terminal tab/window):
   ```bash
   cd client
   node dev-server.cjs
   ```

7. Access the Application:
   Open browser at `http://localhost:3000`.

---

### 2. macOS Setup (Intel and Apple Silicon M1/M2/M3)

1. Clone the Repository:
   ```bash
   git clone https://github.com/your-username/lost-found-app.git
   cd lost-found-app
   ```

2. Install Dependencies:
   ```bash
   cd server && npm install && cd ..
   cd client && npm install && cd ..
   ```

3. Configure Environment File (`server/.env`):
   ```ini
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_custom_secure_jwt_secret_key
   JWT_EXPIRE=7d
   ```

4. Start Server and Client Applications:
   - Terminal 1 (Server): `cd server && node src/server.js`
   - Terminal 2 (Client): `cd client && node dev-server.cjs`

5. Access Application:
   Open browser at `http://localhost:3000`.

---

### 3. Windows Setup (PowerShell / Command Prompt / WSL2)

1. Clone the Repository:
   ```powershell
   git clone https://github.com/your-username/lost-found-app.git
   cd lost-found-app
   ```

2. Install Dependencies:
   ```powershell
   cd server
   npm install
   cd ..\client
   npm install
   cd ..
   ```

3. Create Environment File (`server\.env`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_custom_secure_jwt_secret_key
   JWT_EXPIRE=7d
   ```

4. Start Both Applications:
   - Terminal 1: `cd server && node src/server.js`
   - Terminal 2: `cd client && node dev-server.cjs`

5. Access Application:
   Open browser at `http://localhost:3000`.

---

## Step-by-Step Account Creation and First-Time Registration

1. Open your browser and navigate to the registration page at `http://localhost:3000/register`.
2. Enter your personal details (Full Name, Email Address, Phone Number, and Password) or select "Sign up with Google".
3. Click "Create Account". The application will register your user profile and log you into your personal User Dashboard.
4. From your Dashboard (`http://localhost:3000/dashboard`), you can post lost or found items, view matches, manage claims, and edit profile settings.

### How to Assign an Administrator Account
To grant Super Admin access to a user account:
1. Open your MongoDB database management tool (MongoDB Compass, Mongo Shell, or MongoDB Atlas Dashboard).
2. Open the `users` collection inside the `lostfound` database.
3. Locate the document corresponding to the registered user email address.
4. Edit the `role` field value from `"user"` to `"admin"`.
5. Save the changes. Upon logging in, that account will have access to the Super Admin Dashboard at `http://localhost:3000/admin/dashboard`.

---

## Environment Variables Reference

| Variable | Description | Example / Required Format |
| :--- | :--- | :--- |
| `PORT` | Backend server port number | `5000` |
| `NODE_ENV` | Application environment | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/lostfound` |
| `JWT_SECRET` | Secret key used for signing JWT session tokens | `your_custom_secure_jwt_secret` |
| `JWT_EXPIRE` | Expiration timeline for JWT tokens | `7d` |

---

## Troubleshooting Guide

### 1. Address Already in Use Error (Port 5000 or 3000)
- Cause: A previous process is running on port 5000 or 3000.
- Solution (Linux / macOS):
  ```bash
  fuser -k 5000/tcp || pkill -f "server.js"
  fuser -k 3000/tcp || pkill -f "dev-server.cjs"
  ```
- Solution (Windows PowerShell):
  ```powershell
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
  ```

### 2. MongoDB Database Connection Timeout
- Cause: Missing or invalid `MONGODB_URI` connection string.
- Solution: Ensure IP network access (0.0.0.0/0) is enabled in your MongoDB Atlas Security settings. The server also includes an automatic fallback in-memory database mode for development testing.

### 3. Missing Dependencies
- Cause: Package dependencies not installed.
- Solution: Run `npm install` inside both `server/` and `client/` project folders.

---

## Push to GitHub Instructions

Execute the following commands to commit and push your project to GitHub:

```bash
git remote add origin https://github.com/your-username/lost-found-app.git
git add .
git commit -m "docs: update README with setup guide and user registration instructions"
git branch -M main
git push -u origin main
```

---

## Support

Developer: Attorney Valois NIYIGABA  
Mobile Money (MoMo): 0794729150  
USSD Code: *182*8*1*0794729150#

---

## License

MIT License.
