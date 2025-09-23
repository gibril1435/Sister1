# CRUD Web App for "Perkuliahan" Database

This is a simple web application for managing the `Perkuliahan` (Lectures) database. It provides a RESTful API to perform Create, Read, Update, and Delete (CRUD) operations on the following tables: `Mhs` (Students), `MataKuliah` (Courses), `Dosen` (Lecturers), and `Kuliah` (Lectures).

## Tech Stack

  * **Backend:** Node.js, Express.js
  * **Database:** MySQL
  * **Dependencies:** `mysql2` for database connection, `cors` for handling Cross-Origin Resource Sharing, and `dotenv` for managing environment variables.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

  * **Node.js:** Version 18 or higher.
  * **MySQL:** A running MySQL server instance.

## Getting Started

Follow these instructions to get the project set up and running on your local machine.

### 1\. Database Setup

First, you need to create the `Perkuliahan` database and populate it with the required tables and initial data.

1.  **Log in to your MySQL server**. For many systems, you can do this with:

    ```bash
    sudo mysql -u root -p
    ```

2.  **Create and populate the database** by running the provided SQL script. You can do this in one of two ways:

      * **From the command line (recommended):**

        ```bash
        sudo mysql -u root -p < /path/to/your/project/perkuliahan.sql
        ```

        *(Replace `/path/to/your/project/` with the actual path to the `perkuliahan.sql` file)*

      * **From inside the MySQL prompt:**

        ```sql
        source /path/to/your/project/perkuliahan.sql;
        ```

### 2\. Application Setup

Next, set up the Node.js application.

1.  **Navigate to the `web` directory** of the project:

    ```bash
    cd /path/to/your/project/web
    ```

2.  **Install the necessary npm packages:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Now, open the `.env` file and edit the database credentials to match your MySQL setup.

    ```
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=Perkuliahan
    DB_PORT=3306
    PORT=3000
    ```

### 3\. Running the Application

Once everything is configured, you can start the server.

  * **To start in production mode:**

    ```bash
    npm start
    ```

  * **To start in development mode (with extra logging):**

    ```bash
    npm run dev
    ```

The application will be running at **http://localhost:3000**.

## API Endpoints

The following API endpoints are available for interacting with the database:

### Mahasiswa (Mhs)

  * `GET /api/mhs`: Get all students.
  * `POST /api/mhs`: Create a new student.
  * `PUT /api/mhs/:nim`: Update a student by their NIM.
  * `DELETE /api/mhs/:nim`: Delete a student by their NIM.

### Mata Kuliah (MK)

  * `GET /api/mk`: Get all courses.
  * `POST /api/mk`: Create a new course.
  * `PUT /api/mk/:kode`: Update a course by its code.
  * `DELETE /api/mk/:kode`: Delete a course by its code.

### Dosen

  * `GET /api/dosen`: Get all lecturers.
  * `POST /api/dosen`: Create a new lecturer.
  * `PUT /api/dosen/:nip`: Update a lecturer by their NIP.
  * `DELETE /api/dosen/:nip`: Delete a lecturer by their NIP.

### Kuliah

  * `GET /api/kuliah`: Get all lecture records.
  * `POST /api/kuliah`: Create a new lecture record.
  * `PUT /api/kuliah/:nim/:nip/:kode`: Update a lecture record.
  * `DELETE /api/kuliah/:nim/:nip/:kode`: Delete a lecture record.

### All Tables

  * `GET /api/all`: Get data from all tables in a single request.
