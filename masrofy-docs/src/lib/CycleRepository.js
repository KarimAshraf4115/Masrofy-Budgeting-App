/**
 * @fileoverview CycleRepository — Data access layer for BudgetCycle entities.
 * Provides all CRUD operations for budget cycles using prepared SQL statements.
 * Follows the Repository Pattern to keep database logic separate from business logic.
 * @module lib/CycleRepository
 * @author Karim Ashraf Ahmed, Eyad Hatem Fouad, Sherif Ahmed Metwally, Ahmed Sherif Ahmed
 */

import SQLiteHelper from './SQLiteHelper';

/**
 * @class CycleRepository
 * @classdesc Handles all database operations related to BudgetCycle records.
 * Each method uses a prepared statement for security against SQL injection.
 * A fresh instance is created per API request to maintain stateless behavior.
 */
class CycleRepository {
    /**
     * Creates a new CycleRepository and connects to the shared database instance.
     */
    constructor() {
        this.db = SQLiteHelper.getInstance().getWritableDatabase();
    }

    /**
     * Inserts a new budget cycle into the database.
     * @param {BudgetCycle} budgetCycle - The BudgetCycle object to persist.
     * @returns {number} The auto-generated ID of the newly inserted cycle row.
     */
    insertCycle(budgetCycle) {
        const stmt = this.db.prepare(
            'INSERT INTO BudgetCycle(totalAllowance, startDate, endDate, isActive, createdAt) VALUES (?, ?, ?, ?, ?)'
        );
        const result = stmt.run(
            budgetCycle.totalAllowance,
            budgetCycle.startDate,
            budgetCycle.endDate,
            budgetCycle.isActive,
            new Date().toISOString()
        );
        return result.lastInsertRowid;
    }

    /**
     * Retrieves the currently active budget cycle from the database.
     * Only one cycle should be active at any time — enforced at the application layer.
     * @returns {Object|undefined} A plain database row object, or undefined if no active cycle exists.
     */
    getActiveCycle() {
        const stmt = this.db.prepare('SELECT * FROM BudgetCycle WHERE isActive = 1');
        return stmt.get();
    }

    /**
     * Updates an existing budget cycle record in the database.
     * Typically used to deactivate the current cycle before creating a new one.
     * @param {BudgetCycle} budgetCycle - The BudgetCycle object with updated values.
     * @returns {void}
     */
    updateCycle(budgetCycle) {
        const stmt = this.db.prepare(
            'UPDATE BudgetCycle SET totalAllowance = ?, startDate = ?, endDate = ?, isActive = ? WHERE id = ?'
        );
        stmt.run(
            budgetCycle.totalAllowance,
            budgetCycle.startDate,
            budgetCycle.endDate,
            budgetCycle.isActive,
            budgetCycle.id
        );
    }

    /**
     * Deletes a budget cycle by its ID.
     * Due to the ON DELETE CASCADE constraint in the schema, all expenses
     * associated with this cycle are automatically deleted as well.
     * @param {number} cycleId - The ID of the cycle to delete.
     * @returns {boolean} True if the cycle was deleted, false if no matching row was found.
     */
    deleteCycle(cycleId) {
        const stmt = this.db.prepare('DELETE FROM BudgetCycle WHERE id = ?');
        const result = stmt.run(cycleId);
        return result.changes > 0;
    }

    /**
     * Checks whether any active budget cycle exists in the database.
     * @returns {boolean} True if at least one active cycle exists, false otherwise.
     */
    hasActiveCycle() {
        const stmt = this.db.prepare('SELECT COUNT(*) as count FROM BudgetCycle WHERE isActive = 1');
        const result = stmt.get();
        return result.count > 0;
    }
}

export default CycleRepository;
