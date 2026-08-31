# Secure Stall Reservation Platform

An enterprise-grade, secure web application for **Exhibition Stall Vendors** and **Exhibition Organizers**, built with Spring Boot, React, TypeScript, and MySQL. It features cloud-based **OIDC/OAuth2 authentication**, fine-grained **role-based access control**, **HTTPS SSL support**, and comprehensive **OWASP Top 10 security mitigations**.

---

## 📋 Table of Contents
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Database Setup & Creation Script](#-database-setup--creation-script)
- [Configuration Instructions](#-configuration-instructions)
- [Building & Deploying the Application](#-building--deploying-the-application)
  - [1. Backend Service](#1-backend-service-spring-boot)
  - [2. Vendor Frontend Application](#2-vendor-frontend-application-react--vite)
  - [3. Exhibition Organizer Frontend Application](#3-exhibition-organizer-frontend-application-react--vite)
- [Security & OWASP Top 10 Mitigations](#-security--owasp-top-10-mitigations)
- [Default Test Accounts](#-default-test-accounts)

---

## ✨ Features

### Stall Vendors (`ROLE_VENDOR`)
- **IdP User Profile Display**: View authenticated profile details including Username, Full Name, Email, Phone, and Business Name.
- **Stall Reservation Request**: Submit requests specifying:
  - Authenticated Username (retrieved from IdP token)
  - Exhibition / Event Name (predefined list)
  - Reservation Date (calendar picker enforced $\ge$ current date)
  - Stall Type (Standard, Premium, Corner Stall)
  - Preferred Stall Size (Small, Medium, Large)
  - Number of Stalls Required (1–5)
  - Business Category (Food & Beverage, Clothing, Electronics, Handicrafts, Services, Books & Stationery)
  - Special Requirements or Comments
- **Reservation Tracking**: View request status (`PENDING APPROVAL`, `APPROVED`, `REJECTED`, `CANCELLED`) and access digital QR code passes.

### Exhibition Organizers (`ROLE_ORGANIZER`)
- **Organizer Management Dashboard**: View all vendor stall reservation requests across all vendors.
- **Approval Workflow**: Approve or Reject vendor reservation requests with real-time status updates.
- **Venue Stall Layout Map**: Interactive visual venue layout map.

---

## ⚙️ Prerequisites

Before deploying and running the application, ensure the following software is installed:

1. **Java Development Kit (JDK 23 or JDK 17+)**
2. **MySQL Server (v8.0+)**
3. **Node.js (v18.0+) & npm (v9.0+)**
4. **Git**

---

## 🗄️ Database Setup & Creation Script

The repository includes a complete MySQL database creation script at:
`sa-project-main/database_schema.sql` (also available at `sa-project-main/backend/src/main/resources/schema.sql`).

### Running the Database Creation Script

1. Open your MySQL client or terminal (e.g., MySQL Workbench, phpMyAdmin, or `mysql` CLI).
2. Execute the script to create the `bookfair_db` database, table schema, and seed initial data:

```sql
mysql -u root -p < database_schema.sql
```

Alternatively, manually execute the contents of `database_schema.sql`:

```sql
CREATE DATABASE IF NOT EXISTS `bookfair_db` DEFAULT CHARACTER SET utf8mb4;
USE `bookfair_db`;
-- Executes table creation and data seeding
```

---

## 🔧 Configuration Instructions

All configurable application parameters (database credentials, OIDC IdP settings, JWT secrets, HTTPS SSL options, and mail server credentials) are externalized in `sa-project-main/backend/src/main/resources/application.properties`.

Open `sa-project-main/backend/src/main/resources/application.properties` and update the parameters according to your environment:

```properties
# ============================================================
# Database Configuration
# ============================================================
spring.datasource.url=jdbc:mysql://localhost:3306/bookfair_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ============================================================
# JWT Security Properties
# ============================================================
jwt.secret=YOUR_SECURE_RANDOM_JWT_SECRET_KEY_MIN_32_CHARS
jwt.expiration=86400000

# ============================================================
# Cloud OIDC Identity Provider (Auth0 / Asgardeo / Okta / OneLogin)
# ============================================================
oidc.enabled=true
oidc.issuer-uri=https://YOUR_IDP_DOMAIN/
oidc.client-id=YOUR_OIDC_CLIENT_ID
oidc.client-secret=YOUR_OIDC_CLIENT_SECRET
oidc.logout-url=https://YOUR_IDP_DOMAIN/v2/logout
oidc.redirect-uri=http://localhost:3000/login

# ============================================================
# HTTPS SSL Configuration
# ============================================================
# Set server.ssl.enabled=true to run backend under HTTPS (default port 8080 or 8443)
server.ssl.enabled=false
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=YOUR_KEYSTORE_PASSWORD
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=bookfair

# ============================================================
# Mail Server Configuration (Optional for email passes)
# ============================================================
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_GMAIL_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## 🚀 Building & Deploying the Application

### 1. Backend Service (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd sa-project-main/backend
   ```
2. Build the Maven project:
   ```bash
   mvn clean package -DskipTests
   ```

3. Run the Spring Boot application:
   ```bash
   java -jar target/bookfair-app-0.0.1-SNAPSHOT.jar
   ```
   The backend service will start on **`http://localhost:8080`** (or **`https://localhost:8080`** if SSL is enabled).

---

### 2. Vendor Frontend Application (React / Vite)

1. Navigate to the vendor frontend directory:
   ```bash
   cd sa-project-main/frontend/vendor-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the Vendor Portal in your web browser at:
   **`http://localhost:3000`**

---

### 3. Exhibition Organizer Frontend Application (React / Vite)

1. Navigate to the employee/organizer frontend directory:
   ```bash
   cd sa-project-main/frontend/emplyee-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the Exhibition Organizer Portal in your web browser at:
   **`http://localhost:3001`**

---

## 🛡️ Security & OWASP Top 10 Mitigations

This application has been engineered following OWASP Top 10 security best practices:

| OWASP Vulnerability | Mitigation Strategy Implemented |
| :--- | :--- |
| **A01: Broken Access Control & IDOR** | Enforced Spring Security Role-Based Access Control (`ROLE_VENDOR`, `ROLE_ORGANIZER`). Single reservation lookups (`GET /api/reservations/{id}`) strictly check token principal ownership boundaries (`SecurityException` / `403 Forbidden`). |
| **A02: Cryptographic Failures** | Passwords hashed using BCrypt (`BCryptPasswordEncoder`). HTTPS SSL PKCS12 keystore support configured. |
| **A03: Injection (SQLi & XSS)** | All SQL queries parameterized via JPA. HTML/JS input string sanitizer (`XssSanitizer.java`) strips script tags, inline event attributes (`onload`, `onerror`), and `javascript:` URIs. |
| **A04: Insecure Design & Rate Limiting** | Server-side validation restricts reservation dates to $\ge$ current date. `RateLimitingFilter.java` implements sliding window request rate limiting to block DoS and brute-force attacks. |
| **A05: Security Misconfiguration** | Configured HTTP Security Headers (`X-Frame-Options: DENY`, `Content-Security-Policy`, `X-Content-Type-Options`). `GlobalExceptionHandler.java` intercepts unhandled exceptions to prevent stack trace leaks. |
| **A07: Authentication Failures** | Standard OIDC Bearer token verification and IdP session logout endpoint (`POST /api/auth/logout`). |

---

## 🔑 Default Test Accounts

For testing, the database creation script seeds the following default accounts:

- **Exhibition Organizer Account**:
  - Email: `organizer@bookfair.lk`
  - Password: `organizer123`
  - Role: `ORGANIZER`

- **Employee Account**:
  - Email: `employee@bookfair.lk`
  - Password: `employee123`
  - Role: `EMPLOYEE`

- **Vendor Account**: Register any new account via the Vendor Portal at `http://localhost:3000/register`.
