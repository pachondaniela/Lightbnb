# Property Listing App

This project is a full-stack web application that connects to a **PostgreSQL database** to manage and display property listings. It uses **JavaScript** to build all the SQL queries dynamically, allowing flexible filtering and rendering of the data in the front end.

## 🛠️ Technologies Used

- **Node.js**  
- **PostgreSQL**  
- **JavaScript (ES6+)**
- **Express.js**  
- **pg (PostgreSQL client for Node.js)**

## 📦 Features

- Fetch and display property listings from the database
- Dynamic filtering based on city, owner, price range, and rating
- Insert and update property data through JavaScript queries
- Render results seamlessly to the front end
- Secure and parameterized SQL queries to prevent SQL injection

## 📁 Project Structure
/project-root
│
├── db/ # Database connection and query files
│ ├── index.js # PostgreSQL connection pool
│ └── queries.js # All SQL queries written in JS
│
├── public/ # Front-end assets
│
├── routes/ # Express routes
│
├── server.js # Entry point of the server
│
└── README.md # Project documentation

## 💻 Getting Started

1. **Install dependencies**  
   ```bash
   npm install
   Set up the PostgreSQL database
    Make sure PostgreSQL is running, and configure your .env with the following:

    DB_USER=your_user
    DB_PASSWORD=your_password
    DB_NAME=your_database
    DB_HOST=localhost

    npm start

    open browser: http://localhost:3000