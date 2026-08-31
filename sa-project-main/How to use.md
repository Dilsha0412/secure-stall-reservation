# How to Run the Book Fair Stall Reservation System

## Prerequisites

Before starting, ensure you have the following installed on your system:

1. **Java 25**
2. **MySQL**
3. **Node.js**
4. **Intellij IDEA**

## How to Run

### Step 1: Clone the Repository

```bash
git clone https://github.com/nalinduash/sa-project.git
cd sa-project
```

### Step 2: Set Up backend configurations

1. Update these configurations in `src/main/resources/application.properties` in backend: 
   - `spring.datasource.username`
   - `spring.datasource.password`
   - `spring.mail.username` (Gmail account)
   - `spring.mail.password` (App password)

### Step 3: Run the Backend

1. Use Intellij IDEA
2. The backend will start on `http://localhost:8080`

### Step 4: Run the Vendor Frontend

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. The vendor frontend will be available at `http://localhost:3000`

### Step 5: Run the Employee Frontend

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. The employee frontend will be available at `http://localhost:3001`

### Default Employee Account
The system includes a default employee account for testing:
- Email: `employee@bookfair.lk`
- Password: `employee123`