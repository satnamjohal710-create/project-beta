# Enterprise IT Asset Management System (Project Beta)

A high-performance, three-tier full-stack application engineered to register, audit, and track corporate hardware infrastructure assets across local network topologies.

## 🚀 System Architecture & Core Stack
- **Presentation Layer (Frontend):** React, Vite, Component State management.
- **Logic Layer (Backend API):** Node.js, Express, Environment configuration mapping.
- **Data Layer (Relational Database):** PostgreSQL (`beta_db`), Strict structural schema validation.

---

## 📸 Production Infrastructure Proof

### 1. Database Relational Schema Design
Designed a resilient PostgreSQL matrix tracking unique hardware constraints and primary key indexing.
![Database Schema](./screenshot_1_database.png)

### 2. Live Node.js API Pipeline Verification
Backend infrastructure actively listening on network Port 5001 with verified secure database handshake.
![Backend Pipeline Status](./screenshot_2_backend.png)

### 3. Administrative Asset Logging Interface
Clean UI form built to handle real-time corporate hardware asset registration data.
![IT Form Interface](./screenshot_3_frontend_form.png)

### 4. End-to-End Live Dynamic Inventory Grid
Successful database write confirmations instantly drawing live records back on screen via asynchronous GET channels.
![Data Grid Proof](./screenshot_4_live_matrix.png)

---

## 🛠️ Local Operational Deployment
To run this infrastructure ecosystem locally:

1. Clone the repository and initialize the PostgreSQL schema in TablePlus using the script in `server.js`.
2. Step into `/beta-backend`, add your local `.env` variables, and execute `node server.js`.
3. Step into `/beta-frontend`, execute `npm install`, and run `npm run dev`.