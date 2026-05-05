/**
 * @fileoverview Expense model representing a single financial transaction logged by the user.
 * Provides formatting utilities for display purposes.
 * @module models/Expense
 * @author Karim Ashraf Ahmed, Eyad Hatem Fouad, Sherif Ahmed Metwally, Ahmed Sherif Ahmed
 */

/**
 * @class Expense
 * @classdesc Represents a single expense transaction. Maps directly to a row
 * in the Expense table of the SQLite database. Provides helper methods
 * for formatting the amount and date for display in the UI.
 */
class Expense {
    /**
     * Creates a new Expense instance.
     * @param {number|null} id - The unique database identifier. Null when creating before saving.
     * @param {number} amount - The expense amount in EGP.
     * @param {number} categoryId - The foreign key referencing the Category table.
     * @param {number} cycleId - The foreign key referencing the BudgetCycle table.
     * @param {string} timestamp - The ISO 8601 timestamp when the expense was recorded.
     * @param {string} note - An optional note describing the expense. Empty string if not provided.
     */
    constructor(id, amount, categoryId, cycleId, timestamp, note) {
        this.id = id;
        this.amount = amount;
        this.categoryId = categoryId;
        this.cycleId = cycleId;
        this.timestamp = timestamp;
        this.note = note;
    }

    /**
     * Formats the expense timestamp into a human-readable date string.
     * @returns {string} A formatted date string (e.g., 'May 3, 2026').
     * @example
     * expense.getFormattedDate(); // 'May 3, 2026'
     */
    getFormattedDate() {
        const date = new Date(this.timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Formats the expense amount as a currency string with two decimal places.
     * @returns {string} A formatted amount string (e.g., '150.00 EGP').
     * @example
     * expense.getFormattedAmount(); // '150.00 EGP'
     */
    getFormattedAmount() {
        return this.amount.toFixed(2) + ' EGP';
    }
}

export default Expense;
