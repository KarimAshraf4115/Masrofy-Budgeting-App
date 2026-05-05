/**
 * @fileoverview BudgetCycle model representing a user's monthly or custom budget period.
 * Contains all date-related calculations for the cycle including duration,
 * remaining days, remaining balance, and last-day detection.
 * @module models/BudgetCycle
 * @author Karim Ashraf Ahmed, Eyad Hatem Fouad, Sherif Ahmed Metwally, Ahmed Sherif Ahmed
 */

/**
 * @class BudgetCycle
 * @classdesc Represents a budget cycle — a defined time period with a total spending allowance.
 * Only one cycle can be active at a time. Provides methods for calculating
 * time-related metrics used by the dashboard and notification system.
 */
class BudgetCycle {
    /**
     * Creates a new BudgetCycle instance.
     * @param {number|null} id - The unique database identifier. Null when creating a new cycle before saving.
     * @param {number} totalAllowance - The total budget amount for this cycle in EGP.
     * @param {string} startDate - The cycle start date in ISO 8601 format (e.g., '2026-05-01').
     * @param {string} endDate - The cycle end date in ISO 8601 format (e.g., '2026-05-31').
     * @param {number} isActive - Whether the cycle is currently active (1 = active, 0 = inactive).
     * @param {string} createdAt - The ISO timestamp when the cycle was created.
     */
    constructor(id, totalAllowance, startDate, endDate, isActive, createdAt) {
        this.id = id;
        this.totalAllowance = totalAllowance;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    /**
     * Calculates the total duration of the cycle in days, inclusive of both start and end dates.
     * @returns {number} The total number of days in the cycle.
     * @example
     * // Cycle from May 1 to May 31 → returns 31
     * cycle.getDurationDays();
     */
    getDurationDays() {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    /**
     * Calculates the number of days remaining in the cycle, including today.
     * If the cycle has already ended, returns 0.
     * @returns {number} The number of remaining days including today, or 0 if cycle has ended.
     * @example
     * // If today is May 29 and end date is May 31 → returns 3
     * cycle.getRemainingDays();
     */
    getRemainingDays() {
        const today = new Date();
        const end = new Date(this.endDate);
        today.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        if (end < today) return 0;
        const diffTime = end - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    /**
     * Calculates the remaining budget balance after subtracting total expenses.
     * @param {number} totalSpent - The total amount spent so far in this cycle.
     * @returns {number} The remaining balance. Can be negative if over budget.
     */
    getRemainingBalance(totalSpent) {
        return this.totalAllowance - totalSpent;
    }

    /**
     * Determines whether today is the last day of the budget cycle.
     * Used by the notification system to trigger final-day warnings.
     * @returns {boolean} True if today's date matches the cycle end date, false otherwise.
     */
    isLastDay() {
        const today = new Date();
        const end = new Date(this.endDate);
        today.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        return today.getTime() === end.getTime();
    }
}

export default BudgetCycle;
