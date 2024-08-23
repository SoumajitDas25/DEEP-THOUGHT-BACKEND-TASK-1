# *TASK 1: Event CRUD API Implementation*

Welcome to the Event Management API repository! This project provides a robust and scalable backend solution for creating, updating, and managing events with comprehensive timestamp handling and querying capabilities. The API is built using Node.js, Express, and MongoDB, ensuring high performance and flexibility for various event management needs.

## *Table of Contents*

- [Project Structure](#project-structure)
- [Prerequisites](#)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [File Upload Handling](#file-upload-handling)

## *Project Structure*

```plaintext
project-root/
│
├── public/                # Static files
├── src/
│   ├── controllers/       # CRUD operations for events
│   ├── db/                # Database configuration  
│   ├── routes/            # API route definitions
│   ├── utils/             # Utility functions (e.g., multer for file upload)
│   ├── app.js             # Express app setup
│   └── index.js           # Entry point of the application
├── .env                   # Environment variables
└── package.json           # Node.js dependencies and scripts
```

## *Prerequisites*
Before you begin, ensure you have met the following requirements:
- Node.js: v14.x or later
- npm: v6.x or later
- MongoDB: v4.x or later (local or remote instance)
- Git: For cloning the repository

## *Installation*

1. *Clone the repository:*
   ```bash
   git clone https://github.com/yourusername/yourrepository.git
   cd yourrepository```

 2. **Install dependencies**
    ```bash
      npm install
    ```

## *Configuration*
     
1. **Environment Variables:**

    Create a .env file in the root directory and add the following configurations: 

   ```env
    PORT= 3000
    DATABASE_URL= your_mongodb_connection_string
    DATABASE_NAME= your_database_name
    CORS_ORIGIN=*
   ```
   - PORT: The port on which the server will run.
   - DATABASE_URL: Connection string for your MongoDB cluster.
   - DATABASE_NAME: Name of your Database
   - CORS_ORIGIN: Cors origin to white-list the data
     
## *Running the Application*
 
1. **Start the Server**
   ```bash
   npm start
   ```
   
 # *Scripts*

   - npm start: Starts the production server.
   - npm run dev: Starts the development server using nodemon.


 # *API Endpoints*
- **Base URL**
    ```bash
    http://localhost:3000/api/v3/app
    ```

- **Endpoints**

   - *Create Event*: POST /events
   - *Get Paginated Events*: GET /events?type=latest&limit=5&page=1
   - *Get Event by ID*: GET /events?id=:event_id
   - *Update Event*: PUT /events/:id
   - *Delete Event*: DELETE /events/:id

 # *File Upload Handling*   
 
 File uploads (e.g., images) are handled using multer middleware which is configured in the utils/ directory