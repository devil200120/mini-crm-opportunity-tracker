# Mini CRM Opportunity Tracker

A premium, secure full-stack MERN web application designed for sales teams to track opportunities, deal stages, and follow-up activities. The application features a high-fidelity **Neumorphic UX/UI design** with device responsiveness, support for dynamic light/dark mode, and real-time analytical summaries.

---

## 💻 Tech Stack Used

- **Frontend:**
  - **Framework:** React.js (via Vite)
  - **Styling:** Vanilla CSS (Tailored Neumorphic Design System with HSL palettes)
  - **Icons:** Lucide React
  - **HTTP Client:** Axios (with automatic JWT authentication interceptors)
- **Backend:**
  - **Runtime:** Node.js
  - **Framework:** Express.js
  - **Database:** MongoDB (via Mongoose ODM)
  - **Logging:** Winston Logger (centralized error & server access logging)
- **Testing:**
  - Jest & Supertest (covering Auth endpoints and Ownership authorization validation)
- **DevOps & Containerization:**
  - Docker & Docker Compose (Multi-stage builds)

---

## 🚀 Key Features

### Core Operations
1. **Secure Authentication:** Registration and login using JWT session state.
2. **Shared Sales Pipeline:** All authorized team members can view all active opportunities in the pipeline.
3. **Strict Ownership Control:** Opportunities can only be edited, deleted, or annotated with activity logs by the user who created them. Backend checks ownership via JWT token validation; the UI hides modify options for unauthorized users.

### Optional Bonus Enhancements
4. **Visual Board (Kanban & List Mode):** Toggle between a Kanban stage board (`New`, `Contacted`, `Qualified`, `Proposal Sent`, `Won`, `Lost`) with category value sums, and a Grid List view.
5. **Dashboard Analytics:** Real-time counters showing Pipeline Value, Won Value, Average Value, and High-Priority ratios.
6. **Activity Log & Follow-Up History:** Chronological activity streams per opportunity.
7. **Server-Side API Pagination:** Dynamic grid limits (12 items per page) to prevent empty rows on widescreen monitors.
8. **Smart Sticky Navbar:** Automatically hides when scrolling down to maximize reading space, and slides back down when hovering cursor at the top of the screen (25px) or scrolling to the top.

---

## 📁 Project Structure

```
/assignment_mini_crm
├── backend/
│   ├── src/
│   │   ├── config/db.js              # MongoDB connection hook
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration & login
│   │   │   └── opportunityController.js # Opportunity CRUD & activity logs
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT validation and user context injection
│   │   │   └── errorMiddleware.js    # Global error handler with Winston logging
│   │   ├── models/
│   │   │   ├── User.js               # User Schema with pre-save hashing
│   │   │   └── Opportunity.js        # Opportunity Schema with nested activity logs
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Authentication endpoints mapping
│   │   │   └── opportunityRoutes.js  # Protected Opportunity CRUD endpoints
│   │   ├── tests/
│   │   │   ├── auth.test.js          # Authentication endpoint tests
│   │   │   └── opportunity.test.js   # Opportunity authorization tests
│   │   ├── utils/
│   │   │   └── logger.js             # Winston logger configurations
│   │   ├── app.js                    # Express app configuration
│   │   └── server.js                 # Port server listener
│   ├── logs/
│   │   ├── server.log                # Winston server operational logs
│   │   └── error.log                 # Winston server error stack traces
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomSelect.jsx      # Neumorphic select dropdown
│   │   │   ├── Navbar.jsx            # Sleek header with hover-reveal and theme selectors
│   │   │   ├── OpportunityCard.jsx   # Card containing follow-up timeline drawer
│   │   │   └── OpportunityForm.jsx   # Create/Edit Modal with validation hooks
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # State coordinator for User Session
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Neumorphic Sign-in
│   │   │   ├── Register.jsx          # User signup
│   │   │   └── Dashboard.jsx         # Metrics dashboard & board controls
│   │   ├── services/
│   │   │   └── api.js                # Axios client with JWT request interceptor
│   │   ├── App.jsx                   # View Router and Toast host
│   │   ├── index.css                 # Global Neumorphic Stylesheet
│   │   └── main.jsx                  # React DOM Renderer
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml                # Multi-container orchestrator
└── README.md                         # Project documentation
```

---

## 🔑 Environment Variables Required

Create a `.env` file inside the `backend` directory. Refer to [backend/.env.example](file:///Users/subhankar/MyApps/assignment_mini_crm/backend/.env.example) for reference:

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/minicrm?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
LOG_LEVEL=info
```

* **PORT**: The port the backend server runs on (defaults to `5001`).
* **MONGO_URI**: The MongoDB connection string (Atlas cloud cluster or local mongodb).
* **JWT_SECRET**: Random hash signature used to sign and verify JSON Web Tokens.
* **LOG_LEVEL**: Logger level for Winston (`info`, `error`, `debug`).

---

## 🏃 Setup & Run Instructions

### Option A: Using Docker Compose (Recommended)
This runs the entire full-stack app (MongoDB connectivity, Node API backend, and static production-built frontend) as container services in the background.

1. Ensure Docker is installed and running.
2. In the root directory, build and run the services:
   ```bash
   docker-compose up --build
   ```
3. Open [http://localhost:8080](http://localhost:8080) to access the client, communicating with the API on [http://localhost:5001](http://localhost:5001).

### Option B: Local Setup Instructions

#### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm start
   ```
   The backend will be running on [http://localhost:5001](http://localhost:5001).

#### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch Vite Dev server:
   ```bash
   npm run dev
   ```
   The app will open on [http://localhost:5173](http://localhost:5173).

---

## 🧪 Running the Backend Tests
We utilize Jest and Supertest to run unit and integration tests checking auth logic and ownership restrictions.

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Run the test script:
   ```bash
   npm test
   ```

---

## 📡 API Details

### Authentication Endpoints
- **POST `/api/auth/register`**
  - Registration request body: `{"name": "...", "email": "...", "password": "..."}`
  - Returns user model and signed token.
- **POST `/api/auth/login`**
  - Sign-in request body: `{"email": "...", "password": "..."}`
  - Returns user model and signed token.
- **GET `/api/auth/me`**
  - Header: `Authorization: Bearer <token>`
  - Returns authenticated user details (excludes password).

### Opportunity Endpoints
- **GET `/api/opportunities`**
  - Header: `Authorization: Bearer <token>`
  - Optional Query Params: `page=1`, `limit=12`, `search=Acme`, `stage=New`, `priority=High`, `sortBy=value-desc`
  - Returns:
    - Paginated (if page/limit set): `{"opportunities": [...], "page": 1, "pages": 2, "total": 12}`
    - Array (if no page/limit query): `[...]`
- **POST `/api/opportunities`**
  - Header: `Authorization: Bearer <token>`
  - Request body: `{"customerName": "...", "requirement": "..."}`
  - Returns created opportunity object.
- **PUT `/api/opportunities/:id`**
  - Header: `Authorization: Bearer <token>`
  - Updates only if current authenticated user matches the owner. Returns updated object.
- **DELETE `/api/opportunities/:id`**
  - Header: `Authorization: Bearer <token>`
  - Removes only if current user matches owner. Returns confirmation status.
- **POST `/api/opportunities/:id/activities`**
  - Header: `Authorization: Bearer <token>`
  - Request body: `{"note": "Talked to client."}`
  - Appends follow-up log to opportunity history stream. Only accessible to owner.

---

## ☁️ Deployment Steps

To host the application live on cloud platforms like **Render**, **Railway**, or **AWS**:

### Deploying the Backend (API)
1. Commit the project to a GitHub repository.
2. Sign up on **Render.com** and choose **New Web Service**.
3. Link the GitHub repository and select the subfolder path as `backend`.
4. Configure Environment Variables (`MONGO_URI`, `JWT_SECRET`, `PORT=10000`).
5. Set build command to `npm install` and start command to `npm start`.

### Deploying the Frontend (Client)
1. On Render, choose **New Static Site**.
2. Link the repository, setting the root directory to `frontend`.
3. Set the Build Command to `npm run build` and the Publish Directory to `dist`.
4. Create an environment variable `VITE_API_URL` pointing to the deployed backend service URL.

---

## ⚠️ Known Limitations & Pending Improvements

1. **Real-time pipeline synchronization:** Pipeline updates currently rely on polling or page refreshes. Implementing WebSockets (e.g. Socket.io) would allow real-time collaborative edits to reflect on dashboards instantly.
2. **Multi-tenant data isolation:** All authenticated users see a shared pipeline by design. True multi-tenancy with isolated workspace accounts is a recommended future upgrade.
3. **Advanced Activity Notes:** Activity history is text-only. Rich text comments, document attachments, and @mentions would provide a more robust experience.
4. **Soft Deletions:** Deleting an opportunity immediately purges it from the MongoDB database. Adding a "Recycle Bin" or status flags like `deletedAt` is recommended.
