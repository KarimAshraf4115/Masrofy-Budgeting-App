# Masroofy — Personal Finance Tracker

**Cairo University — Faculty of Computers and Artificial Intelligence**
**Course:** Software Engineering
**Supervisor:** Dr. Mohamed El-Ramly
**Section:** S28

| Name | Role |
|---|---|
| Karim Ashraf Ahmed | Full Stack Developer |
| Eyad Hatem Fouad | Full Stack Developer |
| Sherif Ahmed Metwally | Full Stack Developer |
| Ahmed Sherif Ahmed | Full Stack Developer |

---

## Project Overview

Masroofy is a personal budget management web application built with Next.js and SQLite. It allows a single user to define monthly budget cycles, log daily expenses across categories, and track spending through a real-time dashboard. The application is secured with a 4-digit PIN authentication system.

### Key Features

- **Budget Cycles** — Define a custom time period with a total allowance
- **Expense Logging** — Log expenses across 4 categories (Food, Transport, Entertainment, Other)
- **Smart Daily Limit** — Automatically calculates how much can be spent per day based on remaining balance and remaining days
- **Category Breakdown** — Visual donut chart showing spending distribution across categories
- **Budget Alerts** — Notifications at 80% usage, 100% usage, and on the final day of the cycle
- **PIN Authentication** — Secure 4-digit PIN login with 5-attempt lockout and 30-second cooldown
- **Transaction History** — Grouped-by-date view of all expenses with delete functionality
- **Cycle Reset** — Danger zone option to delete all data and start fresh

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 16 (App Router) | React-based UI with server and client components |
| Backend | Next.js API Routes | RESTful API endpoints |
| Database | SQLite (better-sqlite3) | Local file-based relational database |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Documentation | JSDoc | JavaScript API documentation generator |

---

## Project Structure

```
masrofy/
├── app/
│   ├── api/
│   │   ├── cycle/route.js          # Budget cycle CRUD API
│   │   ├── expense/route.js        # Expense CRUD API
│   │   ├── dashboard/route.js      # Aggregated dashboard data API
│   │   └── user/
│   │       ├── route.js            # Auth: PIN check, signup, login
│   │       └── change-pin/route.js # Auth: PIN update
│   ├── dashboard/page.js           # Main dashboard view
│   ├── expenses/add/page.js        # Add expense form
│   ├── history/page.js             # Transaction history
│   ├── login/page.js               # PIN login screen
│   ├── signup/page.js              # PIN setup screen (first time)
│   ├── setup/page.js               # Budget cycle setup
│   ├── settings/page.js            # App settings
│   ├── layout.js                   # Root layout with AppShell sidebar
│   └── page.js                     # Landing page (redirects based on PIN status)
│
├── components/
│   └── AppShell.js                 # Sidebar navigation wrapper
│
├── models/
│   ├── User.js                     # User entity with PIN auth logic
│   ├── BudgetCycle.js              # Budget cycle entity with date calculations
│   ├── Expense.js                  # Expense entity with formatting helpers
│   └── Category.js                 # Category entity
│
├── lib/
│   ├── SQLiteHelper.js             # Singleton database connection manager
│   ├── CycleRepository.js          # Data access layer for BudgetCycle
│   ├── ExpenseRepository.js        # Data access layer for Expense
│   └── UserRepository.js           # Data access layer for User
│
├── services/
│   ├── DailyLimitCalculator.js     # Financial calculation business logic
│   └── NotificationService.js      # Budget alert generation logic
│
├── db/
│   └── init.sql                    # Database schema and seed data
│
└── docs/                           # Generated JSDoc HTML documentation
```

---

## Database Schema

```sql
User            — Single user row with PIN hash and lockout state
BudgetCycle     — One active cycle at a time with allowance and dates
Expense         — Individual transactions linked to a cycle and category
Category        — Pre-seeded: Food, Transport, Entertainment, Other
```

Foreign key relationships:
- `Expense.categoryId` → `Category.id`
- `Expense.cycleId` → `BudgetCycle.id` (ON DELETE CASCADE)

---

## Architecture Decisions

### Repository Pattern
All database operations are isolated in repository classes (`CycleRepository`, `ExpenseRepository`, `UserRepository`). API routes call repositories — they never write raw SQL directly. This keeps business logic separate from data access.

### Singleton Pattern
`SQLiteHelper` uses a Singleton pattern to ensure only one database connection exists throughout the application lifecycle, preventing connection duplication and improving performance.

### Stateless API Design
Every API request creates fresh instances of all repositories and services. No state is shared between requests, which ensures predictable behavior and eliminates cross-request data contamination.

### Single-User Model
Masroofy is designed as a personal device application. The User table contains at most one row, simplifying authentication and data ownership concerns.

---

## Installation & Setup

### Prerequisites
- Node.js 18 or higher
- npm

### Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd masrofy

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

On first launch, the application will redirect to `/signup` where you can set up your 4-digit PIN. The SQLite database file (`masrofy.db`) is created automatically in the project root on first run.

---

## API Reference

See the generated JSDoc documentation in the `/docs` folder for the complete API reference including all endpoints, parameters, and example responses.

---

## Design Patterns Used

| Pattern | Where Applied | Purpose |
|---|---|---|
| Singleton | `SQLiteHelper` | Single database connection |
| Repository | `CycleRepository`, `ExpenseRepository`, `UserRepository` | Separate data access from business logic |
| Service Layer | `DailyLimitCalculator`, `NotificationService` | Isolate business logic from API routes |
| Model | `User`, `BudgetCycle`, `Expense`, `Category` | Represent database entities as objects |
