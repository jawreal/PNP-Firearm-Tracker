# CSJDM PNP Firearm Tracking System

A web-based firearm records management system developed for the Logistics Department of the Philippine National Police — City of San Jose del Monte, Bulacan. The system provides secure registration, tracking, and auditing of both long and short firearms assigned within the unit.

---

## Purpose

This system was built to replace manual record-keeping with a centralized, digital solution. It ensures that firearm records are accurate, traceable, and accessible only to authorized personnel — reducing the risk of data loss and improving accountability within the department.

---

## User Roles

The system supports two distinct user roles with different levels of access and authority.

**Head Admin** has full system control. This includes the ability to deactivate admin accounts, promote an Admin to Head Admin, and permanently delete firearm records.

**Admin** has operational access. This includes viewing records, adding new Admin accounts, and adding or archiving firearms. Admins cannot deactivate accounts or delete records permanently.

---

## Features

**Firearm Registration** — Supports registration of both long and short firearms with complete record details stored in the database.

**QR Code Tracking** — Each registered firearm is assigned a unique QR code. Scanning is restricted to within the system, preventing unauthorized external access.

**Dashboard** — Provides an overview of system activity including key statistics, recent actions, and a bar graph displaying the total number of registered firearms over the past six months.

**Audit Logging** — Every action performed within the system is automatically logged and can be reviewed on the dedicated audit page, ensuring full accountability.

**Forgot Password** — Users can request a password reset link, which is delivered securely to their registered email address.

**Access Control** — All firearm records are protected and accessible only to registered, authenticated users.

---

## Tech Stack

| Layer              | Technology           |
| ------------------ | -------------------- |
| Frontend Framework | React (TypeScript)   |
| UI Components      | shadcn/ui            |
| Backend            | Node.js with Express |
| Database           | MongoDB              |
| Type Safety        | TypeScript           |

### Authentication & Session Libraries

| Library           | Scope  | Purpose                                                   |
| ----------------- | ------ | --------------------------------------------------------- |
| Zustand           | Client | Stores and manages the authentication session state       |
| @tanstack/query   | Client | Handles data fetching with caching from the server        |
| Passport.js       | Server | Manages user sessions via cookies                         |
| express-session   | Server | Used alongside Passport.js for session handling           |
| express-validator | Server | Validates request fields before processing in controllers |

> For a complete list of server-side libraries, refer to `server/src/index.ts`.

---

## Installation

### Development

Run the following at the root level to install shared dependencies:

```bash
npm install
```

Then install dependencies for both the client and server separately:

```bash
cd client && npm install
cd ../server && npm install
```

### Production (Render Deployment)

Set the build command to:

```bash
npm run build
```

This prepares both the client and server for production. To start the application:

```bash
npm run start
```

---
## Environment Variables

Create a `.env` file inside the `server` directory and configure the following variables:

| Variable          | Description                                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `PASSPORT_SECRET` | Secret key used by Passport.js for session encryption. Use a long, randomly generated string.                    |
| `PORT`            | Port the server runs on. Defaults to `3000`. If changed, update the proxy field in `vite.config.ts` accordingly. |
| `MONGO_URI`       | MongoDB connection string from your Atlas cluster or local instance.                                             |
| `SECRET_KEY`      | Cloudflare Turnstile **Secret Key** used on the server side to verify challenge tokens submitted by the client.  |
| `VITE_SITE_KEY`   | Cloudflare Turnstile **Site Key** used on the client side to render the Turnstile widget in the browser.         |
| `APP_PASS`        | Google App Password used to authenticate the email sender account.                                               |
| `DEV_EMAIL`       | The email address used by Nodemailer to send system emails such as password reset links.                         |
---

## Author

Developed as a practical system project for the Logistics Department of PNP - CSJDM, Bulacan.