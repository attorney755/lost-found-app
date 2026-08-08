# 🔍 Lost & Found Finder Platform

> A state-of-the-art, real-time community web application connecting people who have lost belongings with finders across Kigali & Rwanda.

Developed with ❤️ by **Attorney Valois NIYIGABA**

---

## 🌟 Key Features

- **🔍 Smart Item Reporting & Search**: Easily post lost or found items with photos, category tags, location details, occurrence date, contact info, and reward amounts.
- **🗺️ Address Autocomplete Engine**: Real-time location suggestions for districts and landmarks in Kigali & Rwanda (e.g., *Remera, Kimironko, Kacyiru, Nyamirambo, Gikondo*).
- **🔑 Google Single Sign-On (SSO) & Email Auth**: One-click Google login and traditional email/password registration with JWT session management.
- **👑 Super Admin Analytics Dashboard**: Comprehensive admin control panel featuring interactive rating distribution bar charts, user management, item moderation, and system statistics.
- **🔔 Real-time Notifications Popover**: Floating header bell popover dropdown with unread count badges for instant notification previews.
- **💬 Found Claims & Photo Verification**: Secure finder-owner claim verification workflow with built-in messaging.
- **🌟 Community Feedback & Random Testimonials**: User reviews and ratings displayed dynamically on the homepage with an option to post feedback anonymously.
- **☕ Support / Buy me a Coffee (MoMo)**: Integrated MTN Mobile Money (`0794729150`) support modal with 1-click number copying and USSD dialing helper (`*182*8*1*0794729150#`).
- **🌙 Sleek Dark Mode & Modern Aesthetics**: Modern glassmorphism UI built with TailwindCSS, smooth micro-animations, and full dark/light theme switching.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18 (SPA)
- **Routing**: React Router DOM v6
- **Styling**: TailwindCSS, Vanilla CSS, Custom Glassmorphism System
- **Icons**: Lucide React
- **Charts & Data**: Recharts, Tailwind Utilities
- **Bundler**: esbuild / Vite

### **Backend**
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Authentication**: JSON Web Tokens (JWT), bcryptjs, Google Identity Services (GIS)
- **Security**: Helmet, CORS, Input Sanitization
- **Database**: MongoDB Atlas (Mongoose ODM) with automatic local in-memory database fallback (`mongodb-memory-server`)

---

## 📁 Directory Structure

```text
lost-found-app/
├── client/                     # React Frontend Application
│   ├── dev-server.cjs          # Express dev server proxying API to port 5000
│   ├── index.html              # HTML5 entrypoint with SEO meta tags
│   ├── public/                 # Static assets (images, banners, favicon)
│   │   ├── app.js              # Bundled JavaScript distribution
│   │   └── signup_banner.jpg   # High-resolution signup banner asset
│   └── src/
│       ├── App.jsx             # Main Application routing & layout tree
│       ├── index.jsx           # React DOM root entrypoint
│       ├── components/
│       │   ├── admin/          # AdminSidebar, AdminLayout, StatCard
│       │   ├── auth/           # GoogleAuthButton
│       │   ├── common/         # Navbar, Footer, AddressAutocompleteInput
│       │   ├── items/          # ItemCard, ItemDetailModal
│       │   └── public/         # HeroSection, TestimonialsSection
│       ├── context/
│       │   └── AuthContext.jsx # Global Authentication & session state
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
    ├── package.json            # Server dependencies & scripts
    └── src/
        ├── server.js           # Server entrypoint & database connection
        ├── config/
        │   └── database.js     # MongoDB Atlas connection & in-memory fallback
        ├── middleware/
        │   ├── auth.js         # JWT verification & admin route protection
        │   └── validation.js   # Request payload validation middleware
        ├── models/
        │   ├── auth/User.js    # User Mongoose Schema
        │   ├── items/Item.js  # Item (Lost/Found) Mongoose Schema
        │   └── Feedback.js     # Feedback & Rating Mongoose Schema
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

## 💻 OS-Specific Setup & Installation Guide

Follow the instructions below for your specific operating system (**Linux**, **macOS**, or **Windows**).

### 📋 Prerequisites (All Operating Systems)
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher (comes bundled with Node.js)
- **Git**: Installed on your system

---

### 🐧 1. Linux Setup (Ubuntu / Debian / Fedora / Arch)

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/lost-found-app.git
   cd lost-found-app
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configure Environment Variables**:
   Create a `.env` file inside the `server/` directory:
   ```bash
   cat <<EOT > server/.env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://your_user:your_password@cluster0.lvl8yrj.mongodb.net/lostfound?retryWrites=true&w=majority
   JWT_SECRET=super_secret_jwt_key_lost_found_app_2026
   JWT_EXPIRE=7d
   EOT
   ```

5. **Start the Application**:
   - **Terminal 1 (Backend Server)**:
     ```bash
     cd server
     node src/server.js
     ```
   - **Terminal 2 (Frontend Client)**:
     ```bash
     cd client
     node dev-server.cjs
     ```
   - Open your browser at **`http://localhost:3000`**.

---

### 🍏 2. macOS Setup (Intel & Apple Silicon M1/M2/M3)

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/lost-found-app.git
   cd lost-found-app
   ```

2. **Install Dependencies**:
   ```bash
   # Install server modules
   cd server && npm install && cd ..

   # Install client modules
   cd client && npm install && cd ..
   ```

3. **Configure Environment File**:
   Create `server/.env` using your text editor or terminal:
   ```bash
   nano server/.env
   ```
   Paste the following:
   ```ini
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://your_user:your_password@cluster0.lvl8yrj.mongodb.net/lostfound?retryWrites=true&w=majority
   JWT_SECRET=super_secret_jwt_key_lost_found_app_2026
   JWT_EXPIRE=7d
   ```

4. **Run the Application**:
   ```bash
   # Start backend
   cd server && node src/server.js &

   # Start frontend
   cd client && node dev-server.cjs
   ```
   - Open **`http://localhost:3000`** in Safari or Chrome.

---

### 🪟 3. Windows Setup (PowerShell / Command Prompt / WSL2)

1. **Open PowerShell as Administrator** or open Git Bash.

2. **Clone the Repository**:
   ```powershell
   git clone https://github.com/your-username/lost-found-app.git
   cd lost-found-app
   ```

3. **Install Dependencies**:
   ```powershell
   cd server
   npm install
   cd ..\client
   npm install
   cd ..
   ```

4. **Create Environment File (`server\.env`)**:
   Create a new file named `.env` in the `server` folder with:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://your_user:your_password@cluster0.lvl8yrj.mongodb.net/lostfound?retryWrites=true&w=majority
   JWT_SECRET=super_secret_jwt_key_lost_found_app_2026
   JWT_EXPIRE=7d
   ```

5. **Start the Servers**:
   - **Terminal 1**:
     ```powershell
     cd server
     node src/server.js
     ```
   - **Terminal 2**:
     ```powershell
     cd client
     node dev-server.cjs
     ```
   - Visit **`http://localhost:3000`**.

---

## ⚙️ Environment Variables Guide

### Server Environment (`server/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Running environment | `development` or `production` |
| `MONGODB_URI` | MongoDB Atlas Connection String | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `super_secret_jwt_key_2026` |
| `JWT_EXPIRE` | JWT token expiration time | `7d` |

> 💡 **Automatic Fallback**: If `MONGODB_URI` is omitted or loses network connection, the server automatically initializes an in-memory MongoDB database (`mongodb-memory-server`) with auto-seeded demo items!

---

## 🔑 Default Credentials

### 👑 **Super Admin Account**
- **Email**: `admin@lostfound.com`
- **Password**: `AdminPass123!`
- **Access**: Super Admin Panel (`/admin/dashboard`), User Management, Analytics, Feedback Stats.

### 👤 **Demo User Account**
- **Email**: `attorneyvalois@gmail.com` (or create any account via Sign Up / Google SSO)
- **Password**: `Password123!`

---

## 🛠️ Common Troubleshooting & FAQ

### 1. `Error: listen EADDRINUSE: address already in use :::5000`
- **Cause**: Another Node.js process is already running on port 5000 or 3000.
- **Solution (Linux/macOS)**:
  ```bash
  fuser -k 5000/tcp || pkill -f "server.js"
  fuser -k 3000/tcp || pkill -f "dev-server.cjs"
  ```
- **Solution (Windows)**:
  ```powershell
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
  ```

### 2. MongoDB Atlas Connection Timeout (`MongoServerSelectionError`)
- **Cause**: Network firewall blocking port 27017 or invalid MongoDB URI.
- **Solution**: The application handles this automatically by switching to an in-memory database instance! You will see:
  `💡 Attempting automatic local in-memory database fallback...`

### 3. Google Sign-In Duplicate Phone Index (`E11000`)
- **Cause**: Legacy unique index on the phone field in MongoDB.
- **Solution**: Run the provided repair script:
  ```bash
  node scratch/drop_phone_index.js
  ```

---

## 🚀 How to Push Changes to GitHub

If you are setting up or updating your GitHub repository:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add remote repository
git remote add origin https://github.com/your-username/lost-found-app.git

# 3. Stage all files
git add .

# 4. Commit changes
git commit -m "feat: complete lost and found platform with Google SSO, admin analytics, and MoMo support"

# 5. Push to GitHub
git branch -M main
git push -u origin main
```

---

## ☕ Support the Developer

If you find this project helpful or want to support ongoing development:

- **Developer**: Attorney Valois NIYIGABA
- **MTN Mobile Money (MoMo)**: `0794729150`
- **USSD Quick Dial (Rwanda)**: `*182*8*1*0794729150#`

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
