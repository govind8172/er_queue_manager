
# 🏥 ER Queue Management System

A Node.js-based Emergency Room Queue Management System that prioritizes patient treatment using triage levels and includes real-time alerts and updates via Socket.IO.

---

## 🚀 Features

- ✅ RESTful API for patient queue operations
- 📊 Priority-based queue (using triage level and wait time)
- 🔁 Real-time updates via WebSockets
- 🛎 Critical patient alerts
- ⏱ Wait time estimations
- ⚠ Staff-to-patient ratio monitoring
- 📄 Full API documentation and testing included

---

## 📁 Project Structure

er-queue-manager/ ├── client.html # Client interface to view real-time updates ├── server.js # Main backend server with REST + Socket.IO ├── queue.js # Priority queue logic for triage handling ├── api-docs/ │ └── ER_API_Documentation_Updated.docx # API documentation ├── tests/ │ └── queue.test.js # Unit tests for queue logic ├── .gitignore ├── package.json └── README.md # You're reading it!

## 📦 Installation & Setup

### Step 1: Clone the repo

For installation, run these commands in bash or cli
git clone https://github.com/your-username/er-queue-manager.git
cd er-queue-manager

### Step 2: Install dependencies
npm install

### Step 3: Run the backend server
node server.js
Server will run on: http://localhost:3000

### Step 4: For checking the notifications
🌐 Open the Client
Ensure server is running (node server.js)

Open client.html in your browser (double-click or use Live Server if using VS Code)

Make sure you are online to load Socket.IO from CDN.
