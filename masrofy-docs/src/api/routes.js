/**
 * @fileoverview API Routes Documentation — Masroofy REST API.
 * Documents all Next.js App Router API endpoints including their HTTP methods,
 * request parameters, response shapes, and error codes.
 * @module api
 * @author Karim Ashraf Ahmed, Eyad Hatem Fouad, Sherif Ahmed Metwally, Ahmed Sherif Ahmed
 */

/**
 * @namespace API_Cycle
 * @description Budget Cycle API — /api/cycle
 *
 * Manages the user's budget cycle. Only one cycle can be active at a time.
 */

/**
 * GET /api/cycle
 * Retrieves the currently active budget cycle.
 *
 * @function GET_cycle
 * @memberof API_Cycle
 * @returns {200} { message: string, cycle: BudgetCycle } — Active cycle found.
 * @returns {404} { message: 'No active cycle found' } — No active cycle exists.
 *
 * @example
 * // Response 200:
 * {
 *   "message": "Active cycle found",
 *   "cycle": {
 *     "id": 1,
 *     "totalAllowance": 3000,
 *     "startDate": "2026-05-01",
 *     "endDate": "2026-05-31",
 *     "isActive": 1,
 *     "createdAt": "2026-05-01T00:00:00.000Z"
 *   }
 * }
 */

/**
 * POST /api/cycle
 * Creates a new budget cycle. Automatically deactivates any existing active cycle.
 * Calculates and returns the initial daily limit for the new cycle.
 *
 * @function POST_cycle
 * @memberof API_Cycle
 * @param {Object} body - Request body.
 * @param {number} body.totalAllowance - The total budget for the new cycle in EGP.
 * @param {string} body.startDate - Cycle start date in ISO 8601 format.
 * @param {string} body.endDate - Cycle end date in ISO 8601 format.
 * @returns {201} { message, cycleid, dailyLimit } — Cycle created successfully.
 * @returns {400} { message: 'Missing required fields' } — Validation failed.
 *
 * @example
 * // Request body:
 * { "totalAllowance": 3000, "startDate": "2026-05-01", "endDate": "2026-05-31" }
 *
 * // Response 201:
 * { "message": "New cycle created successfully", "cycleid": 1, "dailyLimit": "96.77" }
 */

/**
 * DELETE /api/cycle
 * Deletes the currently active budget cycle and all associated expenses (CASCADE).
 * Used by the Settings page "Reset Current Cycle" button.
 *
 * @function DELETE_cycle
 * @memberof API_Cycle
 * @returns {200} { message: 'Active cycle deleted successfully' }
 * @returns {404} { message: 'No active cycle to delete' }
 */

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @namespace API_Expense
 * @description Expense API — /api/expense
 *
 * Manages individual expense transactions. Supports filtering by category and date range.
 */

/**
 * GET /api/expense
 * Retrieves expenses for a specific cycle. Supports optional filtering.
 *
 * @function GET_expense
 * @memberof API_Expense
 * @param {string} cycleId - (Required) URL query param. The ID of the cycle.
 * @param {string} [categoryId] - (Optional) URL query param. Filter by category.
 * @param {string} [startDate] - (Optional) URL query param. Filter range start.
 * @param {string} [endDate] - (Optional) URL query param. Filter range end.
 * @returns {200} { expenses: Expense[] } — List of matching expenses.
 * @returns {400} { message: 'cycleId is required' } — Missing required param.
 *
 * @example
 * // GET /api/expense?cycleId=1
 * // GET /api/expense?cycleId=1&categoryId=2
 * // GET /api/expense?cycleId=1&startDate=2026-05-01&endDate=2026-05-15
 */

/**
 * POST /api/expense
 * Logs a new expense. Returns updated financial metrics and any triggered alerts.
 *
 * @function POST_expense
 * @memberof API_Expense
 * @param {Object} body - Request body.
 * @param {number} body.amount - The expense amount in EGP.
 * @param {number} body.categoryId - The category ID (1–4).
 * @param {number} body.cycleId - The active cycle ID.
 * @param {string} [body.note] - Optional note for the expense.
 * @returns {201} { expenseId, totalSpent, remainingBalance, newDailyLimit, alerts }
 * @returns {400} { message: 'Missing required fields' }
 */

/**
 * PUT /api/expense
 * Updates an existing expense's amount, category, or note.
 *
 * @function PUT_expense
 * @memberof API_Expense
 * @param {Object} body - Request body.
 * @param {number} body.id - The ID of the expense to update.
 * @param {number} body.amount - The new amount.
 * @param {number} body.categoryId - The new category ID.
 * @param {string} [body.note] - The new note.
 * @returns {200} { message: 'Expense updated successfully' }
 * @returns {404} { message: 'Expense not found' }
 */

/**
 * DELETE /api/expense
 * Deletes a single expense by its ID.
 *
 * @function DELETE_expense
 * @memberof API_Expense
 * @param {string} id - (Required) URL query param. The ID of the expense to delete.
 * @returns {200} { message: 'Expense deleted successfully' }
 * @returns {404} { message: 'Expense not found' }
 * @example
 * // DELETE /api/expense?id=5
 */

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @namespace API_Dashboard
 * @description Dashboard API — /api/dashboard
 *
 * Aggregates all data needed for the main dashboard view in a single request.
 */

/**
 * GET /api/dashboard
 * Returns a complete snapshot of the user's current financial state including
 * cycle info, financial metrics, category breakdown, and active alerts.
 *
 * @function GET_dashboard
 * @memberof API_Dashboard
 * @returns {200} Full dashboard data object.
 * @returns {404} { message: 'No active cycle found' }
 *
 * @example
 * // Response 200:
 * {
 *   "hasActiveCycle": true,
 *   "cycle": { "id": 1, "startDate": "2026-05-01", "endDate": "2026-05-31", "duration": 31 },
 *   "financials": {
 *     "totalAllowance": 3000,
 *     "totalSpent": 900,
 *     "percentageUsed": "30.0%",
 *     "remainingBalance": "2100.00",
 *     "remainingDays": 20,
 *     "dailyLimit": "105.00"
 *   },
 *   "categoryBreakdown": [
 *     { "categoryId": 1, "totalSpent": 500, "percentage": 55.5 }
 *   ],
 *   "alerts": []
 * }
 */

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @namespace API_User
 * @description User Authentication API — /api/user and /api/user/change-pin
 *
 * Manages PIN-based authentication for the single application user.
 */

/**
 * GET /api/user
 * Checks whether a PIN has been set up. Used on app launch to decide
 * whether to redirect to /login or /signup.
 *
 * @function GET_user
 * @memberof API_User
 * @returns {200} { pinSet: boolean }
 */

/**
 * POST /api/user
 * Creates a new user with a hashed PIN. Called once during initial setup.
 * Prevents duplicate users by checking if a PIN already exists.
 *
 * @function POST_user
 * @memberof API_User
 * @param {Object} body - Request body.
 * @param {string} body.pin - The plain-text 4-digit numeric PIN.
 * @returns {201} { message: 'PIN created successfully', userId: number }
 * @returns {400} { message: string } — Validation error (missing, wrong length, non-numeric).
 * @returns {409} { message: 'PIN already set up' } — User already exists.
 */

/**
 * PUT /api/user
 * Verifies a PIN during login. Enforces lockout after 5 failed attempts.
 * Persists authentication state to the database after every attempt.
 *
 * @function PUT_user
 * @memberof API_User
 * @param {Object} body - Request body.
 * @param {string} body.pin - The plain-text PIN entered by the user.
 * @returns {200} { message: 'PIN verified successfully', success: true }
 * @returns {401} { message: string, success: false, attemptsLeft: number }
 * @returns {404} { message: 'No user found' }
 * @returns {429} { message: string, locked: true, timeLeft: number } — Locked out.
 */

/**
 * PUT /api/user/change-pin
 * Updates the user's PIN from the Settings page.
 * Validates the new PIN before hashing and saving.
 *
 * @function PUT_changePin
 * @memberof API_User
 * @param {Object} body - Request body.
 * @param {string} body.pin - The new plain-text 4-digit PIN.
 * @returns {200} { message: 'PIN updated successfully' }
 * @returns {400} { message: 'Valid 4-digit PIN is required' }
 * @returns {404} { message: 'No user found' }
 */
