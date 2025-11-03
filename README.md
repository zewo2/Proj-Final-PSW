# Gym Management System

> **Academic Project** - Programação de Serviços Web (PSW) | ISTEC

A complete gym management system developed with Node.js, Express, MySQL and Pug. This project was created as the final assignment for the Programação de Serviços Web (PSW) course at ISTEC, demonstrating the implementation of a complete CRUD system with web interface and RESTful API.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Configuration](#database-configuration)
- [How to Run](#how-to-run)
- [Functionalities](#functionalities)
- [API Endpoints](#api-endpoints)
- [About the Project](#about-the-project)

## Features

- **Interactive Dashboard** - Real-time visualization of gym statistics
- **Client Management** - Complete CRUD for clients with subscriptions
- **Employee Management** - Staff and personal trainers administration
- **Subscription System** - Different membership plans
- **Personal Trainer Assignment** - Client-to-trainer association
- **Modern Interface** - Responsive UI with Bootstrap 5
- **RESTful API** - Endpoints for integration with other applications
- **Environment Variables** - Secure credential management with dotenv

## Technologies Used

- **Backend:**
  - [Node.js](https://nodejs.org/) - JavaScript runtime environment
  - [Express.js](https://expressjs.com/) - Web framework
  - [MySQL2](https://www.npmjs.com/package/mysql2) - MySQL driver for Node.js
  - [dotenv](https://www.npmjs.com/package/dotenv) - Environment variables management
  
- **Frontend:**
  - [Pug](https://pugjs.org/) - Template engine
  - [Bootstrap 5](https://getbootstrap.com/) - CSS framework
  - [Bootstrap Icons](https://icons.getbootstrap.com/) - Icon library

## Prerequisites

Before you begin, make sure you have installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MySQL](https://www.mysql.com/) (version 5.7 or higher)
- [npm](https://www.npmjs.com/) (usually included with Node.js)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/zewo2/Proj-Final-PSW.git
   cd Proj-Final-PSW
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Copy the `.env.example` file to `.env`:
   ```bash
   # Windows (PowerShell)
   Copy-Item .env.example .env
   
   # Linux/Mac
   cp .env.example .env
   ```
   
   Edit the `.env` file with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=gymdb
   PORT=3000
   ```
   
   **⚠️ Important:** The `.env` file contains sensitive information and is included in `.gitignore`. Never commit this file to the repository.

## Database Configuration

The project includes migration scripts to automatically create and populate the database.

1. **Run the initialization script:**
   ```bash
   node init_connection.js
   ```

This script will:
- Create the `gymdb` database
- Create the necessary tables (funcionarios, clientes, subscription_tiers)
- Insert sample data

### Database Structure

**Table: funcionarios (employees)**
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- nome (VARCHAR) - name
- idade (INT) - age
- email (VARCHAR)
- telefone (VARCHAR) - phone
- tipo (ENUM: 'personal_trainer', 'rececionista', 'gerente') - type
- morada (VARCHAR) - address
- codigo_postal (VARCHAR) - postal code

**Table: clientes (clients)**
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- nome (VARCHAR) - name
- idade (INT) - age
- email (VARCHAR)
- telefone (VARCHAR) - phone
- subscription_tier_id (INT, FOREIGN KEY)
- ptrainer_id (INT, FOREIGN KEY)

**Table: subscription_tiers**
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- name (VARCHAR)
- description (TEXT)
- monthly_price (DECIMAL)
- features (TEXT)

## How to Run

1. **Make sure you configured the `.env` file** (see Installation section)

2. **Start the server:**
   ```bash
   npm start
   ```
   
   Or using the direct command:
   ```bash
   node index.js
   ```

3. **Access the application:**
   
   Open your browser and go to: `http://localhost:3000`
   (or the port defined in your `.env` file)


## Functionalities

### Main Dashboard
- Display total number of clients
- Display total number of employees
- Statistics of clients with personal trainers
- Quick navigation to all sections

### Client Management
- Create new clients
- Edit client information
- Delete clients
- View complete list
- Assign subscriptions

### Employee Management
- Add new employees
- Update employee data
- Remove employees
- List all employees
- Categorize by type (personal trainer, receptionist, manager)

### Subscription Management
- Create new plans
- Edit existing plans
- Delete plans
- Set monthly prices
- List features

### Personal Trainers
- Associate clients with personal trainers
- View client-trainer relationship
- Update assignments

## API Endpoints

### Clients
```
GET    /api/clientes          - List all clients
GET    /api/clientes/:id      - Get specific client
POST   /api/clientes          - Create new client
PUT    /api/clientes/:id      - Update client
DELETE /api/clientes/:id      - Delete client
PUT    /api/clientes/:id/ptrainer - Assign personal trainer
```

### Employees
```
GET    /api/funcionarios      - List all employees
GET    /api/funcionarios/:id  - Get specific employee
POST   /api/funcionarios      - Create new employee
PUT    /api/funcionarios/:id  - Update employee
DELETE /api/funcionarios/:id  - Delete employee
```

### Subscriptions
```
GET    /api/subscricoes       - List all subscriptions
GET    /api/subscricoes/:id   - Get specific subscription
POST   /api/subscricoes       - Create new subscription
PUT    /api/subscricoes/:id   - Update subscription
DELETE /api/subscricoes/:id   - Delete subscription
```

### Personal Trainers
```
GET    /api/ptrainers         - List client-trainer relationships
```

## About the Project

This project was developed as the final assignment for the **Programação de Serviços Web (PSW)** course at **ISTEC - Instituto Superior de Tecnologias Avançadas**.

### Academic Objectives

- Implement a complete CRUD system using Node.js and Express
- Integrate a relational database (MySQL) with a web application
- Develop a functional RESTful API
- Create dynamic web interfaces using template engines (Pug)
- Apply MVC architecture concepts
- Implement table relationships (Foreign Keys)
- Use environment variables for secure configuration management

### Note

This project was developed exclusively for educational purposes and academic evaluation. It is not intended for production use or real-world environments.