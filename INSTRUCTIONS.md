# Project Setup Instructions

## 1. Prerequisites
-   **Node.js**: Ensure you have Node.js installed.
-   **MongoDB Atlas Account**: You need a free MongoDB database.

## 2. Setting up MongoDB
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up/login.
2.  Create a new **Cluster** (the free tier is fine).
3.  Click **Connect** on your cluster.
4.  Add your IP address to the allowlist (or allow all IPs `0.0.0.0/0` for easier access).
5.  Create a database user (username and password). **Remember these!**
6.  Choose **Drivers** as your connection method.
7.  Copy the connection string. It looks like this:
    `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`

## 3. Configuring Environment Variables
1.  Open the file `.env.local` in your project root.
2.  Add the `MONGODB_URI` variable with your connection string.
3.  Replace `<username>` and `<password>` with the user you created in step 2.5.

**Example `.env.local`:**
```env
VITE_GEMINI_API_KEY=your_gemini_key_here
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/lovequests?retryWrites=true&w=majority
```

## 4. Running the Project
You need to run **two** commands in separate terminals:

**Terminal 1 (Backend API):**
```bash
npm run server
```

**Terminal 2 (Frontend App):**
```bash
npm run dev
```

## 5. Using Admin Mode
1.  Open the app in your browser (usually `http://localhost:3000`).
2.  Click the title text "For [Name]" **5 times** quickly.
3.  Enter the password: `love123`.
4.  You can now add tasks and rewards!
