## ⚙️ Requirements

Make sure the following are installed on your system to be
able to run the application:

- **Node.js** (recommended: v18 or v20 LTS)
- **npm**
- **Git**

-----

## 🧩 Backend Setup (Required)

### 🛠️ Create and edit environment file (.\backend\.env)
NODE_ENV = development

PORT = 8000

MONGO_URI = mongodb+srv://[your_username]:[your_password]@[your_database]

JWT_SECRET = [type here your hash for encryption]

JWT_EXPIRES_IN = 1d

### 📂 Go to the backend folder
cd backend

### 📦 Install backend dependecies
npm install

### ▶️ Start the backend server
npm run server


## 🖥️ Frontend Setup (Also required)

### 📂 Open another terminal and go to the frontend folder
cd ..\frontend

### 📦 Install frontend dependecies
npm install

### ▶️ Start the frontend
npm run client

This should open up the application in your default web browser at http://localhost:3000
If it does not open automatically, you can manually navigate to that URL

