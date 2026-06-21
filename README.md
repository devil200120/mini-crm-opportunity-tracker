# Mini CRM Opportunity Tracker

A premium, secure full-stack MERN web application designed for sales teams to track opportunities, deal stages, and follow-up activities. The application features a high-fidelity **Neumorphic UX/UI design** with device responsiveness, support for dynamic light/dark mode, and real-time analytical summaries.

---

## 🔗 Live Links & Submission Details

- **GitHub Source Code Repository:** [https://github.com/devil200120/mini-crm-opportunity-tracker.git](https://github.com/devil200120/mini-crm-opportunity-tracker.git)
- **Live Application URL (Frontend):** *[Insert your deployed Vercel URL here, e.g., https://mini-crm-opportunity-tracker.vercel.app]*
- **Live Backend API URL:** [https://crm.subhankardash.com](https://crm.subhankardash.com)
- **Hosted Database:** MongoDB Atlas Cloud Cluster
- **Test Login Credentials (Pre-registered on Live Database):**
  - **User Account A:** `demo@example.com` (Password: `password123`)
  - **User Account B:** `demo2@example.com` (Password: `password123`)
  - *(Logging into both accounts demonstrates the strict backend ownership-based authorization: User Account A is restricted from editing or deleting opportunities created by User Account B).*

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

## 🚀 Key Features & Implementation Breakdown

### Core Operations

#### 🔒 1. Secure Authentication & Session Management
* **How I did that:**
  * **Backend:** I utilized `bcryptjs` to securely hash user passwords with a salt factor of 10 prior to database insertion via a Mongoose pre-save middleware. I generated stateless **JSON Web Tokens (JWT)** on successful registration or login. I created a custom `authMiddleware` that extracts the token from the standard HTTP `Authorization: Bearer <token>` header, verifies its cryptographic signature, and attaches the active user payload (`req.user`) to the request context.
  * **Frontend:** I built a custom React `AuthContext` to store and expose user session states globally. I configured an **Axios interceptor** to automatically fetch the JWT from `localStorage` and inject it into the headers of all outgoing API calls.
* **Why I did that:** Storing plain-text passwords is a critical security vulnerability. Using JWTs allows secure, stateless communication between the Vite client and the Express backend, meaning the API doesn't need to maintain server-side session stores, leading to better scalability.
* **Benefits:** User data remains protected against leaks. Session state is persistent across browser refreshes, providing a frictionless user experience.

#### 👥 2. Collaborative Shared Sales Pipeline
* **How I did that:** I built the query-based `GET /api/opportunities` API to fetch all database opportunities, using Mongoose `.populate()` to attach the respective owner's name and email. The React frontend retrieves this shared collection and renders them dynamically for all authenticated users.
* **Why I did that:** The assignment requirements specify a shared, collaborative pipeline where sales teams can view all deals to coordinate customer interactions.
* **Benefits:** Boosts team transparency. Multiple reps can see all active opportunities in one place, preventing duplicate customer outreach.

#### 🛡️ 3. Strict Backend Ownership Validation
* **How I did that:**
  * **Backend:** I set up the `PUT /api/opportunities/:id` and `DELETE /api/opportunities/:id` routes to retrieve the target opportunity and verify if `opportunity.owner.toString() === req.user._id.toString()`. If they don't match, the server blocks the action and returns a `403 Forbidden` response.
  * **Frontend:** I added conditional rendering checks matching the logged-in user's ID against the opportunity's owner ID, hiding the "Edit" and "Delete" actions in the UI for unauthorized users.
* **Why I did that:** Relying solely on hiding buttons on the frontend is a severe security risk, as requests can be easily spoofed using API clients. Real authorization must be validated directly at the database boundaries on the server.
* **Benefits:** Strong data integrity. Reps can view the overall pipeline to collaborate, but they cannot delete or alter other reps' deals, preventing accidental data loss or unauthorized modifications.

---

### Optional Bonus Enhancements

#### 📋 4. Visual Kanban Board & List View Toggle
* **How I did that:** I designed a responsive dashboard allowing users to toggle between a Grid List view and a Kanban Board view. The Kanban board groups opportunities by stage columns (`New`, `Contacted`, `Qualified`, `Proposal Sent`, `Won`, `Lost`), dynamically calculating deal counts and summing the total financial values per stage.
* **Why I did that:** Long data tables can make deal distributions difficult to digest. A Kanban board gives an immediate visual perspective of the pipeline.
* **Benefits:** Sales reps can visually monitor pipeline velocity, spot bottleneck stages, and view instant financial aggregates for revenue projections.

#### 📊 5. Real-Time Dashboard Analytics
* **How I did that:** I used React state hooks to calculate global metrics directly from the fetched opportunities array: Total Pipeline Value, Won Value, Average Deal Value, and High-Priority deal ratio.
* **Why I did that:** Visual summaries allow managers to track high-level sales progress without reading individual deals one by one.
* **Benefits:** Instant business intelligence. The stats recalculate in real-time as filters are applied or opportunities are updated.

#### 📝 6. Chronological Activity Logs & Follow-up History
* **How I did that:** I added an `activityHistory` array of subdocuments to the Mongoose `Opportunity` schema. I built a `POST /api/opportunities/:id/activities` endpoint that allows owners to append timestamped text logs (e.g., "Called customer, agreed to send proposal") directly to an opportunity.
* **Why I did that:** A CRM is only as good as its relationship audit trail. Reps need a timeline of touchpoints to know when and how to follow up.
* **Benefits:** Eliminates reliance on memory. Reps have a clear chronological audit trail of all previous client interactions.

#### ⚡ 7. Server-Side Pagination, Filtering, & Sorting
* **How I did that:** I implemented robust query handling in the `getOpportunities` backend controller. Using Express request parameters (`page`, `limit`, `search`, `stage`, `priority`, `sortBy`), I constructed Mongoose filters that handle case-insensitive text search (regex on customer names/needs), stage and priority filters, and dynamic sorting (by value or follow-up date).
* **Why I did that:** Fetching entire collections can crash browsers as data grows. Server-side pagination ensures that database loads scale gracefully.
* **Benefits:** Lightning-fast rendering. The frontend only fetches specified chunks (e.g. 12 deals at a time), keeping load times minimal, and allowing reps to locate deals quickly.

#### 🎨 8. Neumorphic Design System & Smart Hide Navbar
* **How I did that:** I crafted a custom modern interface utilizing pure CSS HSL color systems. I implemented a React "Smart Navbar" that monitors window scroll direction: it hides automatically when scrolling down to maximize vertical reading area and slides back down when scrolling up or hovering the cursor at the top of the viewport.
* **Why I did that:** Browser defaults feel basic. Modern web applications require premium, fluid visual systems to improve user engagement and retention.
* **Benefits:** Immersive user experience. The neumorphic card structures feel interactive and tactile, and the smart header maximizes readable area on mobile devices.

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
│   ├── .env.example                  # Environment template config
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
│   ├── .env.example                  # Environment template config
│   └── package.json
├── docker-compose.yml                # Multi-container orchestrator
└── README.md                         # Project documentation
```

---

## 🔑 Environment Variables Required

### Backend (`backend/.env`)
Create a `.env` file inside the `backend` directory. Refer to [backend/.env.example](file:///Users/subhankar/MyApps/assignment_mini_crm/backend/.env.example) for reference:
```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/minicrm?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
LOG_LEVEL=info
```

### Frontend (`frontend/.env`)
Create a `.env` file inside the `frontend` directory. Refer to [frontend/.env.example](file:///Users/subhankar/MyApps/assignment_mini_crm/frontend/.env.example) for reference:
```env
VITE_API_URL=http://localhost:5001/api
```

---

## 🏃 Setup & Run Instructions (Local)

### Option A: Using Docker Compose
This runs the entire full-stack app (MongoDB connectivity, Node API backend, and static production-built frontend) as container services locally in the background.

1. Ensure Docker is installed and running.
2. In the root directory, build and run the services:
   ```bash
   docker-compose up --build
   ```
3. Open [http://localhost:8080](http://localhost:8080) to access the client.

### Option B: Local Setup Instructions

#### 1. Backend Setup
1. Navigate to the `backend` directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Run the development server:
   ```bash
   npm start
   ```
   The backend will be running on [http://localhost:5001](http://localhost:5001).

#### 2. Frontend Setup
1. Navigate to the `frontend` directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Launch Vite Dev server:
   ```bash
   npm run dev
   ```
   The app will open on [http://localhost:5173](http://localhost:5173).

---

## 🧪 Running the Backend Tests
I utilize Jest and Supertest to run unit and integration tests checking auth logic and ownership restrictions.

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Run the test script:
   ```bash
   npm test
   ```

---

## 📡 API Details & JSON Schemas

All endpoints are prefixed with `/api` and expect/return JSON payloads.

### 🏛️ Theoretical Overview & Design Architecture

The backend follows a **RESTful JSON API architecture** and utilizes stateless communications. Below is a theoretical breakdown of the architectural design decisions and implementation details:

1. **RESTful Verb Conventions & Data Operations:**
   * *Design Choice:* The API uses standard HTTP verbs to map client actions to database CRUD operations:
     * `POST`: Used to create new resources (User registration, user login, creating new deals, adding timeline activities).
     * `GET`: Used to fetch read-only data (fetching all opportunities for the shared pipeline, retrieving specific opportunities, fetching user profiles).
     * `PUT`: Used to update existing resource properties.
     * `DELETE`: Used to permanently purge a resource from the cluster database.
   * *Benefits:* Strictly adheres to HTTP standards, making the endpoints clean, self-descriptive, and predictable for any frontend developer or external integration.

2. **Stateless JWT Authentication & Security Context:**
   * *Design Choice:* Rather than keeping user session states in the server's memory (which causes servers to crash or lag when thousands of users are connected simultaneously), the API uses stateless **JSON Web Tokens (JWT)**.
   * *Security Flow:* On successful registration/login, the server issues a signed, cryptographically secure token containing the user's database ID. The React client stores this token in browser local storage and attaches it as a bearer token (`Authorization: Bearer <token>`) to subsequent requests.
   * *Verification:* A custom Express middleware (`authMiddleware.js`) intercepts all protected routes, verifies the token's signature, and exposes the user's data context (`req.user`) to the route controllers.
   * *Benefits:* High scalability, resistance to CSRF (Cross-Site Request Forgery) attacks, and seamless distributed server compatibility.

3. **Server-Side Filtering, Pagination, and Sorting Mechanics:**
   * *Design Choice:* Instead of fetching the entire dataset and letting the browser process it (which wastes client bandwidth and causes performance lag on weak devices), all pagination, searching, and sorting are executed directly at the database layer.
   * *Execution:* Constructed a dynamic query builder inside the opportunity controller. If `search` or filtering flags are provided, Mongoose constructs a `$or` regex filter. Sorting parameters (`estimatedValue` or `nextFollowUpDate`) are passed directly into the MongoDB query index.
   * *Benefits:* Minimizes network payloads, maximizes client render speed, and keeps the user interface responsive.

4. **Ownership Authorization (Access Control Boundaries):**
   * *Design Choice:* While the pipeline is shared (all authenticated users can view all deals), write access must be restricted. The API ensures that the `owner` field of the requested opportunity matches the active user's ID derived from the JWT.
   * *Benefits:* Enforces data integrity at the database layer. Even if a user bypasses the UI and attempts direct REST calls via Postman, the server blocks unauthorized updates or deletions.

5. **Centralized Error Handling & Winston Logs:**
   * *Design Choice:* Unhandled exceptions can leak backend folder details or database schemas to users, presenting a security threat. I built a centralized `errorMiddleware.js` that catches all runtime errors, formats them into a consistent JSON payload, and logs them using the **Winston Logging Engine** to local files (`logs/server.log` and `logs/error.log`).
   * *Benefits:* Secure error masking for clients while retaining full debug traces for system administrators.

---

### 🔑 Authentication Endpoints

#### 1. Register User
* **Endpoint:** `POST /api/auth/register`
* **Access:** Public
* **Request Header:** `Content-Type: application/json`
* **Request Body Example:**
  ```json
  {
    "name": "Sarah Connor",
    "email": "sarah@cyberdyne.com",
    "password": "strongpassword123"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "_id": "6a378e1a817820813c557d28",
    "name": "Sarah Connor",
    "email": "sarah@cyberdyne.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
* **Error Response (400 Bad Request):**
  ```json
  {
    "message": "User already exists"
  }
  ```

#### 2. Login User
* **Endpoint:** `POST /api/auth/login`
* **Access:** Public
* **Request Header:** `Content-Type: application/json`
* **Request Body Example:**
  ```json
  {
    "email": "sarah@cyberdyne.com",
    "password": "strongpassword123"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "_id": "6a378e1a817820813c557d28",
    "name": "Sarah Connor",
    "email": "sarah@cyberdyne.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
* **Error Response (401 Unauthorized):**
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

#### 3. Get Logged-In User Profile
* **Endpoint:** `GET /api/auth/me`
* **Access:** Private (Requires authenticated JWT session)
* **Request Header:** `Authorization: Bearer <JWT_TOKEN>`
* **Success Response (200 OK):**
  ```json
  {
    "_id": "6a378e1a817820813c557d28",
    "name": "Sarah Connor",
    "email": "sarah@cyberdyne.com",
    "createdAt": "2026-06-21T08:50:32.000Z",
    "updatedAt": "2026-06-21T08:50:32.000Z"
  }
  ```

---

### 💼 Opportunity Tracker Endpoints

#### 1. Retrieve Shared Opportunity Pipeline
* **Endpoint:** `GET /api/opportunities`
* **Access:** Private (Requires authenticated JWT session)
* **Request Header:** `Authorization: Bearer <JWT_TOKEN>`
* **Query Parameters (Optional):**
  * `page`: Page index (default: `1` if limits applied).
  * `limit`: Grid item limit per page (default: `6` if paging requested).
  * `search`: Live search text filtering customer names or requirement descriptions.
  * `stage`: Stage enum filter (`New`, `Contacted`, `Qualified`, `Proposal Sent`, `Won`, `Lost`).
  * `priority`: Priority level filter (`Low`, `Medium`, `High`).
  * `sortBy`: Sorting criteria (`value-desc` | `value-asc` | `followup-date`).
* **Success Response (200 OK):**
  ```json
  [
    {
      "_id": "6a378e90817820813c557d42",
      "owner": {
        "_id": "6a378e1a817820813c557d28",
        "name": "Sarah Connor",
        "email": "sarah@cyberdyne.com"
      },
      "customerName": "Acme Corporation",
      "requirement": "Enterprise CRM custom portal",
      "estimatedValue": 75000,
      "stage": "Qualified",
      "priority": "High",
      "nextFollowUpDate": "2026-07-15T00:00:00.000Z",
      "notes": "Spoke to the procurement lead. Budget is approved.",
      "activityHistory": [
        {
          "_id": "6a378ea2817820813c557d45",
          "note": "Initial scoping call completed.",
          "createdBy": {
            "_id": "6a378e1a817820813c557d28",
            "name": "Sarah Connor"
          },
          "createdAt": "2026-06-21T09:12:00.000Z"
        }
      ],
      "createdAt": "2026-06-21T09:00:00.000Z",
      "updatedAt": "2026-06-21T09:12:00.000Z"
    }
  ]
  ```

#### 2. Retrieve Specific Opportunity Details
* **Endpoint:** `GET /api/opportunities/:id`
* **Access:** Private (Requires authenticated JWT session)
* **Request Header:** `Authorization: Bearer <JWT_TOKEN>`
* **Success Response (200 OK):**
  ```json
  {
    "_id": "6a378e90817820813c557d42",
    "owner": {
      "_id": "6a378e1a817820813c557d28",
      "name": "Sarah Connor",
      "email": "sarah@cyberdyne.com"
    },
    "customerName": "Acme Corporation",
    "requirement": "Enterprise CRM custom portal",
    "estimatedValue": 75000,
    "stage": "Qualified",
    "priority": "High",
    "nextFollowUpDate": "2026-07-15T00:00:00.000Z",
    "notes": "Spoke to the procurement lead."
  }
  ```

#### 3. Create New Opportunity
* **Endpoint:** `POST /api/opportunities`
* **Access:** Private (Requires authenticated JWT session)
* **Request Header:** `Authorization: Bearer <JWT_TOKEN>, Content-Type: application/json`
* **Request Body Example:**
  ```json
  {
    "customerName": "Acme Corporation",
    "contactName": "John Doe",
    "contactEmail": "john@acme.com",
    "contactPhone": "+1555019283",
    "requirement": "Enterprise CRM custom portal",
    "estimatedValue": 75000,
    "stage": "Qualified",
    "priority": "High",
    "nextFollowUpDate": "2026-07-15T00:00:00.000Z",
    "notes": "Spoke to the procurement lead."
  }
  ```
  *(Note: The owner field is derived dynamically from the JWT on the backend. Any owner or user_id passed in the body is ignored for security).*
* **Success Response (201 Created):** Returns the fully created opportunity document with populated owner details.

#### 4. Update Existing Opportunity (Owner Only)
* **Endpoint:** `PUT /api/opportunities/:id`
* **Access:** Private (Requires authenticated JWT session; must be the creator of the opportunity)
* **Request Header:** `Authorization: Bearer <JWT_TOKEN>, Content-Type: application/json`
* **Request Body Example:**
  ```json
  {
    "stage": "Proposal Sent",
    "estimatedValue": 80000,
    "notes": "Sent formal RFP document."
  }
  ```
* **Success Response (200 OK):** Returns the updated opportunity document.
* **Error Response (403 Forbidden - Attempted by Non-Owner):**
  ```json
  {
    "message": "Not authorized to update this opportunity: ownership required"
  }
  ```

#### 5. Delete Opportunity (Owner Only)
* **Endpoint:** `DELETE /api/opportunities/:id`
* **Access:** Private (Requires authenticated JWT session; must be the creator of the opportunity)
* **Request Header:** `Authorization: Bearer <JWT_TOKEN>`
* **Success Response (200 OK):**
  ```json
  {
    "message": "Opportunity removed successfully",
    "id": "6a378e90817820813c557d42"
  }
  ```
* **Error Response (403 Forbidden - Attempted by Non-Owner):**
  ```json
  {
    "message": "Not authorized to delete this opportunity: ownership required"
  }
  ```

#### 6. Add Activity Follow-Up Log (Owner Only)
* **Endpoint:** `POST /api/opportunities/:id/activities`
* **Access:** Private (Requires authenticated JWT session; must be the creator of the opportunity)
* **Request Header:** `Authorization: Bearer <JWT_TOKEN>, Content-Type: application/json`
* **Request Body Example:**
  ```json
  {
    "note": "Called procurement, contract is in final legal review."
  }
  ```
* **Success Response (200 OK):** Returns the populated opportunity document containing the appended activityHistory timeline log.

---

## ☁️ Step-by-Step Production Deployment Guide (VPS + Vercel)

This application uses a hybrid deployment architecture where the React frontend client is hosted on **Vercel** and the Node/Express backend API is hosted inside a **Docker Container** on a dedicated **Ubuntu VPS** at [https://crm.subhankardash.com](https://crm.subhankardash.com). 

Below is an architectural breakdown of the build type, security design, and deployment steps.

---

### 🐳 1. Containerized Backend Architecture (The Build Type)

The backend is built as an isolated **Docker Container** using a lightweight Node.js environment (`node:18-alpine`).

#### 🔍 Why do I do this?
- **Environment Parity (Consistency):** Docker guarantees that the backend runs in the exact same environment (OS version, Node version, library binaries) on my production VPS as it did during development. This completely eliminates the "works on my machine" bug.
- **Stateless Isolation:** The Express API runs in a sandboxed container namespace, meaning it cannot access or interfere with other applications running on my VPS.

---

### 🔒 2. Host Security & The Docker-UFW Bypass (How it's Secure)

A major security vulnerability on Linux servers is the **Docker UFW Bypass**:
- **The Vulnerability:** By default, if you map a container port publicly (e.g., `-p 5001:5001`), Docker automatically modifies the host's kernel routing rules (`iptables`). This manipulates routing *before* the Uncomplicated Firewall (UFW) rules are processed, exposing port `5001` directly to the public web even if UFW claims it is closed.
- **How I Secure It (Localhost Loopback Mapping):** I map the container port strictly to the host's loopback interface:
  ```bash
  -p 127.0.0.1:5001:5001
  ```
  This tells the system to bind port 5001 exclusively to `127.0.0.1`. The port is completely unreachable from external networks, making it impossible for hackers to bypass Nginx. 
- **Nginx Gateway:** Native Nginx acts as the secure host gateway, receiving encrypted public HTTPS traffic (port 443) and proxying it internally to `http://127.0.0.1:5001` (the isolated Docker container).

---

### 📋 3. System Requirements & Prerequisites
To run this deployment, the VPS requires:
1. **Docker Engine:** Version 20.10+ (active and running).
2. **Nginx Web Server:** Acting as the reverse proxy.
3. **Certbot (EFF):** For Let's Encrypt SSL certificate automation.
4. **Subdomain Record (A Record):** Pointing `crm.subhankardash.com` to the VPS IP address.
5. **MongoDB Atlas:** Remote cloud database cluster.

---

### 🛠️ 4. Execution Steps (How I Deployed It)

#### Step 1: Prepare the Production Folder on the VPS
* **Why:** Running application source files out of `/root/` is insecure. I place them under `/var/www/` which is the standard web directory with restricted user access.
* **How:**
  ```bash
  # Create the production folder structure
  mkdir -p /var/www/crm.subhankardash.com

  # Sync clean repository files from root to the web directory
  rsync -avz --exclude 'node_modules' --exclude '.git' /root/assignment_mini_crm/ /var/www/crm.subhankardash.com/
  ```

#### Step 2: Build the Docker Image
* **Why:** Compiles the Alpine Node image, installs production-only dependencies, and prepares the API container asset.
* **How:**
  ```bash
  cd /var/www/crm.subhankardash.com/backend
  docker build -t mini-crm-backend .
  ```

#### Step 3: Run the Backend Docker Container
* **Why:** Launches the server container in daemon mode, passes production database secrets via the env-file, and locks down ports.
* **How:**
  ```bash
  # Start the container bound strictly to localhost (127.0.0.1)
  docker run -d \
    --name mini-crm-backend \
    -p 127.0.0.1:5001:5001 \
    --env-file /var/www/crm.subhankardash.com/backend/.env \
    --restart unless-stopped \
    mini-crm-backend
  ```

#### Step 4: Configure Nginx as a Reverse Proxy
* **Why:** The backend application runs on local port `5001`. Leaving this port open to the public internet is a security risk. Instead, I use Nginx to listen to standard HTTP/HTTPS traffic (ports 80 and 443) on my subdomain `crm.subhankardash.com`, and securely proxy that traffic internally to `127.0.0.1:5001`.
* **How:**
  1. Create a configuration file at `/etc/nginx/sites-available/crm.subhankardash.com`:
     ```nginx
     server {
         listen 80;
         server_name crm.subhankardash.com;

         location / {
             # Forward all requests hitting crm.subhankardash.com to local port 5001
             proxy_pass http://127.0.0.1:5001;
             proxy_http_version 1.1;

             # Set headers to support WebSocket connections and keep-alive
             proxy_set_header Upgrade $http_upgrade;
             proxy_set_header Connection 'upgrade';
             proxy_set_header Host $host;
             proxy_cache_bypass $http_upgrade;

             # Forward the client's real IP address and protocol scheme
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
         }
     }
     ```
  2. Enable the site configuration block and restart Nginx:
     ```bash
     # Link the configuration file from sites-available to sites-enabled
     ln -sf /etc/nginx/sites-available/crm.subhankardash.com /etc/nginx/sites-enabled/crm.subhankardash.com

     # Test configuration file syntax for errors
     nginx -t

     # Restart the Nginx service to load the new config
     systemctl restart nginx
     ```

#### Step 5: Secure the Backend with Let's Encrypt SSL
* **Why:** Transmitting user passwords and authentication tokens (JWTs) over unencrypted HTTP exposes them to packet interception (Man-in-the-Middle attacks). I secure the server using an SSL certificate.
* **How:** Run Certbot to verify your domain ownership, download certificates, and automatically rewrite Nginx to redirect HTTP traffic to HTTPS:
  ```bash
  certbot --nginx -d crm.subhankardash.com --non-interactive --agree-tos -m subhankardash45585@gmail.com
  ```
  *(Certbot will automatically modify `/etc/nginx/sites-enabled/crm.subhankardash.com` to listen on port 443 with SSL enabled).*

#### Step 6: Deploy the Frontend Client to Vercel
* **Why:** Vercel provides a fast Edge Content Delivery Network (CDN) for serving static client assets (React build files), making the frontend load extremely quickly worldwide.
* **How:**
  1. Link your GitHub repository `devil200120/mini-crm-opportunity-tracker`.
  2. In the Vercel project configuration, click **Edit** next to **Root Directory** and set it to **`frontend`** (so Vercel runs package builds inside that subfolder).
  3. Under **Environment Variables**, add:
     * **Key:** `VITE_API_URL`
     * **Value:** `https://crm.subhankardash.com/api`
  4. Click **Deploy**. Vercel will compile the Vite assets and host your application.

---

## ⚠️ Known Limitations & Pending Improvements

> [!NOTE]
> All core and bonus requirements specified in the project PDF are **100% completed, tested, and fully functional**. 
> The following list details optional, production-grade enhancements that would be implemented for a high-traffic, real-world enterprise product expansion:

1. **Real-time Pipeline Synchronization (WebSockets):**
   * **Why & Benefits:** Currently, the board fetches updates via standard REST requests on page load or filter changes. Implementing a WebSocket layer (e.g., Socket.io) would push updates instantly across all active users' dashboards when anyone adds, moves, or edits a deal.
2. **Multi-Tenant Workspace Partitioning:**
   * **Why & Benefits:** Per the PDF requirements, this app utilizes a shared pipeline where all sales reps see all active deals. A production CRM could offer multi-tenant workspaces where different companies or teams have isolated, private database pipelines.
3. **Advanced Activity Timeline (Rich-Text & Attachments):**
   * **Why & Benefits:** The current opportunity activity logs are simple text notes. Upgrading this to support rich-text formatting, file uploads (PDF contracts, image proposals), and user @mentions would enable richer team collaboration.
4. **Soft Deletions (Recycle Bin):**
   * **Why & Benefits:** Deletions are currently permanent database purges to fulfill basic CRUD requirements. Implementing a "Soft Delete" strategy (using a `deletedAt` timestamp) or a "Recycle Bin" screen would allow recovering accidentally deleted deals.
