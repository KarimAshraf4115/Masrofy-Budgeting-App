CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pinHash TEXT,
    pinEnabled INTEGER DEFAULT 0,
    failedAttempts INTEGER DEFAULT 0,
    lockoutTimestamp INTEGER
);

CREATE TABLE IF NOT EXISTS Category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    iconRes TEXT,
    isDefault INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS BudgetCycle (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    totalAllowance REAL NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    isActive INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS Expense (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    categoryId INTEGER NOT NULL,
    cycleId INTEGER NOT NULL,
    timestamp TEXT NOT NULL,
    note TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (categoryId) REFERENCES Category(id),
    FOREIGN KEY (cycleId) REFERENCES BudgetCycle(id) ON DELETE CASCADE
);

INSERT OR IGNORE INTO Category (id, name, iconRes, isDefault) VALUES
  (1, 'Food', '🍔', 1),
  (2, 'Transport', '🚗', 1),
  (3, 'Entertainment', '🎬', 1),
  (4, 'Other', '📦', 1);