# nest-auth-rbac

This project is built with **NestJS** to provide the backend API, using **TypeORM** and **PostgreSQL** as the database.

It features a role- and permission-based authentication system.  

API documentation is generated with **Swagger** and can be accessed at `${BACKEND_URL}/api/v1`.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (recommended LTS version)
- [Docker](https://www.docker.com/get-started) and Docker Compose
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

---

## 🚀 Project Overview

This backend implements a robust authentication and authorization system based on roles and permissions. It allows users to register, log in, and securely manage their accounts.


### 🔐 Key Features

- **Nodemailer Integration**  
  The project leverages [Nodemailer](https://nodemailer.com/) to send transactional emails such as account confirmation and password reset links. This ensures users can verify their accounts and recover access when necessary.  
  > ✉️ **Gmail Setup:** You can use your Gmail account to send emails by configuring your Gmail credentials in the `.env` file as shown below.  


  ```env
   # Email Service (Gmail via Nodemailer)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   SMTP_SERVICE=gmail
   ```

**Cloudinary Integration**  
   The backend integrates with [Cloudinary](https://cloudinary.com/) to handle file uploads such as profile images and PDF documents. Uploaded files are securely stored in your Cloudinary account. The system validates file types and sizes before accepting uploads, ensuring only supported formats are allowed (e.g., `jpeg`, `png`, `webp`, `avif`, and `pdf`).  

   To enable this functionality, sign in to your Cloudinary account and configure the following environment variables in your `.env` file:


  ```env
   # Cloudinary Credentials
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

- **Security**  
  All sensitive operations are protected by JWT authentication and permission-based guards, ensuring that only authorized users can access specific resources.

---

## Getting Started

1. Clone this repository:

   ```bash
       git clone https://github.com/Antonio-Conrado/nest-auth-rbac.git your-new-project-name
   ```




2. Navigate to the project folder:

   ```bash
      cd your-new-project-name
   ```

3. After cloning and navigating to the project folder, run the rename script to update all instances of the old project name (`nest-auth-rbac`) with your new project name:

   ```bash
      node rename-project.ts
   ```
   - It is **strongly recommended** to delete the `rename-project.ts` script after running it to prevent confusion or accidental reuse.
- Delete the `.git` folder to start a new Git repository.

  > **Note:**  
  > After deleting the `.git` folder, you should create a new Git repository for your project.
 



4. Create a `.env` file in the root directory by copying the template and updating the values with your own:

   ```bash
      cp .env.template .env
   ```

5. Install the dependencies:

   ```bash
      npm i
   ```

6. Start the database using Docker:

   ```bash
      docker compose up -d
   ```

7. To run the standard development server:

   ```bash
      npm run start:dev
   ```
8. Access the API documentation once the server is running:

👉 **Swagger UI:** [`${BACKEND_URL}/api/v1`](http://localhost:3000/api/v1)

---


