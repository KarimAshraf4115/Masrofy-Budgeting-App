/**
 * @fileoverview ExpenseRepository — Data access layer for Expense entities.
 * Provides CRUD operations and filtering queries for expense records.
 * Follows the Repository Pattern to isolate all expense-related SQL from business logic.
 * @module lib/ExpenseRepository
 * @author Karim Ashraf Ahmed, Eyad Hatem Fouad, Sherif Ahmed Metwally, Ahmed Sherif Ahmed
 */

import SQLiteHelper from './SQLiteHelper';

/**
 * @class ExpenseRepository
 * @classdesc Handles all database operations related to Expense records.
 * Supports insertion, update, deletion, and multiple filtering strategies
 * (by cycle, category, and date range). All queries use prepared statements.
 */
class ExpenseRepository {
    /**
     * Creates a new ExpenseRepository and connects to the shared database instance.
     */
    constructor() {
        this.db = SQLiteHelper.getInstance().getWritableDatabase();
    }

    /**
     * Inserts a new expense record into the database.
     * @param {Expense} expense - The Expense object to persist.
     * @returns {number} The auto-generated ID of the newly inserted expense row.
     */
    insertExpense(expense) {
        const stmt = this.db.prepare(
            'INSERT INTO Expense(amount, categoryId, cycleId, timestamp, note) VALUES (?, ?, ?, ?, ?)'
        );
        const result = stmt.run(expense.amount, expense.categoryId, expense.cycleId, expense.timestamp, expense.note);
        return result.lastInsertRowid;
    }

    /**
     * Updates an existing expense's amount, category, and note.
     * @param {{id: number, amount: number, categoryId: number, note: string}} expense - Object containing the updated fields and the expense ID.
     * @returns {boolean} True if the expense was found and updated, false otherwise.
     */
    updateExpense(expense) {
        const stmt = this.db.prepare('UPDATE Expense SET amount = ?, categoryId = ?, note = ? WHERE id = ?');
        const result = stmt.run(expense.amount, expense.categoryId, expense.note, expense.id);
        return result.changes > 0;
    }

    /**
     * Deletes an expense by its ID.
     * @param {number} expenseId - The ID of the expense to delete.
     * @returns {boolean} True if the expense was deleted, false if not found.
     */
    deleteExpense(expenseId) {
        const stmt = this.db.prepare('DELETE FROM Expense WHERE id = ?');
        const result = stmt.run(expenseId);
        return result.changes > 0;
    }

    /**
     * Retrieves all expenses for a given budget cycle, ordered by most recent first.
     * @param {number} cycleId - The ID of the budget cycle.
     * @returns {Object[]} An array of plain expense row objects ordered by timestamp descending.
     */
    getAllByCycle(cycleId) {
        const stmt = this.db.prepare('SELECT * FROM Expense WHERE cycleId = ? ORDER BY timestamp DESC');
        return stmt.all(cycleId);
    }

    /**
     * Retrieves expenses filtered by a specific category within a budget cycle.
     * @param {number} cycleId - The ID of the budget cycle.
     * @param {number} categoryId - The ID of the category to filter by.
     * @returns {Object[]} An array of matching expense row objects ordered by timestamp descending.
     */
    filterByCategory(cycleId, categoryId) {
        const stmt = this.db.prepare(
            'SELECT * FROM Expense WHERE cycleId = ? AND categoryId = ? ORDER BY timestamp DESC'
        );
        return stmt.all(cycleId, categoryId);
    }

    /**
     * Retrieves expenses within a specific date range for a given budget cycle.
     * @param {number} cycleId - The ID of the budget cycle.
     * @param {string} startDate - The start of the date range in ISO 8601 format.
     * @param {string} endDate - The end of the date range in ISO 8601 format.
     * @returns {Object[]} An array of matching expense row objects ordered by timestamp descending.
     */
    filterByDateRange(cycleId, startDate, endDate) {
        const stmt = this.db.prepare(
            'SELECT * FROM Expense WHERE cycleId = ? AND timestamp BETWEEN ? AND ? ORDER BY timestamp DESC'
        );
        return stmt.all(cycleId, startDate, endDate);
    }

    /**
     * Calculates the total amount spent across all expenses in a budget cycle.
     * @param {number} cycleId - The ID of the budget cycle.
     * @returns {number} The total amount spent, or 0 if no expenses exist.
     */
    getTotalSpent(cycleId) {
        const stmt = this.db.prepare('SELECT SUM(amount) as total FROM Expense WHERE cycleId = ?');
        const result = stmt.get(cycleId);
        return result.total || 0;
    }

    /**
     * Retrieves the total amount spent per category within a budget cycle.
     * Used by the dashboard to build the category breakdown and donut chart.
     * Aggregation is performed in SQL for efficiency.
     * @param {number} cycleId - The ID of the budget cycle.
     * @returns {Array.<{categoryId: number, total: number}>} An array of objects with categoryId and total spent.
     */
    getTotalByCategory(cycleId) {
        const stmt = this.db.prepare(
            'SELECT categoryId, SUM(amount) as total FROM Expense WHERE cycleId = ? GROUP BY categoryId'
        );
        return stmt.all(cycleId);
    }

    /**
     * Retrieves a single category record by its ID.
     * @param {number} categoryId - The ID of the category to retrieve.
     * @returns {Object|undefined} The category row object, or undefined if not found.
     */
    getCategoryById(categoryId) {
        const stmt = this.db.prepare('SELECT * FROM Category WHERE id = ?');
        return stmt.get(categoryId);
    }
}

export default ExpenseRepository;
