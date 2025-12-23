# 3D Interactive Virtual Bookshelf

A full-stack MERN application (MySQL, Express, React, Node) featuring a highly interactive 3D environment built with **React Three Fiber** and **GSAP**. Users can add, edit, view, and interact with a virtual library in a gamified 3D space.

## Key Features
- **Immersive 3D Scene:** Fully navigable bookshelf with responsive books.
- **Physics & Animation:** Smooth book transitions (hover, pull, open) using GSAP timelines.
- **Dynamic Materials:** "Glint" shaders that react to book completion status and ratings.
- **Full CRUD:** Add, Edit books and upload cover images.
- **Authentication:** Simple Login/Register system.

## 🛠 Tech Stack
- **Frontend:** React, React Three Fiber (R3F), Drei, GSAP, Zustand (or local state).
- **Backend:** Node.js, Express.js.
- **Database:** MySQL.
- **File Storage:** Local Multer storage for book covers.

## Setup Instructions

### 1. Prerequisites
- Node.js (v16+)
- MySQL Server
- Git

### 2. Database Setup
1. Open your MySQL Workbench or CLI.
2. Create a new database named `bookdb`.
3. Run the SQL script provided in `database_setup.sql` to create tables and populate initial data.

### 3. Backend Setup
1. Navigate to the server folder: `cd server`
2. Install dependencies:
    npm install
###Important: Open server.js and update the MySQL connection password to match your local setup.###
3. Start the server:
    node server.js
    nodemon run server.js
### 4. Frontend Setup
1. Open a new terminal and navigate to the client folder: `cd client`
2. Install dependencies:
    npm install
3. Start the application:
    npm run dev
    Open your browser at http://localhost:5173