/**
 * @fileoverview DailyLimitCalculator — Business logic service for financial calculations.
 * Computes daily spending limits, remaining balances, budget usage percentages,
 * and category breakdowns. Stateless by design — no instance variables are used.
 * @module services/DailyLimitCalculator
 * @author Karim Ashraf Ahmed, Eyad Hatem Fouad, Sherif Ahmed Metwally, Ahmed Sherif Ahmed
 */

/**
 * @class DailyLimitCalculator
 * @classdesc Provides all financial calculation logic for the Masroofy application.
 * All methods are pure functions — they compute results based solely on their inputs
 * and produce no side effects. A fresh instance is created per API request.
 */
class DailyLimitCalculator {

    /**
     * Calculates the safe daily spending limit by dividing the remaining balance
     * evenly across the remaining days of the budget cycle.
     * @param {number} remainingBalance - The current remaining budget in EGP.
     * @param {number} remainingDays - The number of days left in the cycle including today.
     * @returns {number} The daily limit in EGP, or 0 if no days remain.
     * @example
     * calculator.calculateDailyLimit(900, 30); // 30 EGP per day
     */
    calculateDailyLimit(remainingBalance, remainingDays) {
        if (remainingDays <= 0) return 0;
        return remainingBalance / remainingDays;
    }

    /**
     * Calculates the remaining budget balance after subtracting total expenses.
     * @param {number} totalAllowance - The total budget for the cycle in EGP.
     * @param {number} totalSpent - The total amount spent so far in EGP.
     * @returns {number} The remaining balance. Can be negative if the user is over budget.
     * @example
     * calculator.calculateRemainingBalance(3000, 900); // 2100
     */
    calculateRemainingBalance(totalAllowance, totalSpent) {
        return totalAllowance - totalSpent;
    }

    /**
     * Recalculates the daily limit after a new expense is logged,
     * redistributing unspent funds across remaining days (rollover calculation).
     * @param {{totalAllowance: number, totalSpent: number, remainingDays: number}} cycle - An object with the cycle's financial snapshot.
     * @returns {number} The updated daily limit after accounting for current spending.
     */
    applyRollover(cycle) {
        const remainingBalance = this.calculateRemainingBalance(cycle.totalAllowance, cycle.totalSpent);
        return this.calculateDailyLimit(remainingBalance, cycle.remainingDays);
    }

    /**
     * Calculates the percentage of the total budget that has been spent.
     * Used to determine which budget threshold alerts to trigger.
     * @param {number} totalSpent - The total amount spent so far in EGP.
     * @param {number} totalAllowance - The total budget for the cycle in EGP.
     * @returns {number|boolean} The percentage used (0–100+), or false if totalAllowance is 0.
     * @example
     * calculator.checkThreshold(2400, 3000); // 80
     */
    checkThreshold(totalSpent, totalAllowance) {
        if (totalAllowance <= 0) return false;
        return (totalSpent / totalAllowance) * 100;
    }

    /**
     * Calculates what percentage of the total spending a single category represents.
     * Used to build the category breakdown on the dashboard donut chart.
     * @param {number} categoryTotal - The total spent in a specific category in EGP.
     * @param {number} totalSpent - The total amount spent across all categories.
     * @returns {number} The percentage (0–100). Returns 0 if totalSpent is 0 to avoid division by zero.
     * @example
     * calculator.calculateCategoryPercentage(600, 3000); // 20
     */
    calculateCategoryPercentage(categoryTotal, totalSpent) {
        if (totalSpent <= 0) return 0;
        return (categoryTotal / totalSpent) * 100;
    }

    /**
     * Groups a flat list of expense objects by category ID and sums their amounts.
     * @param {Array.<{categoryId: number, amount: number}>} expenses - Array of expense objects.
     * @returns {Object.<number, number>} An object mapping categoryId to total amount spent.
     * @example
     * // Input: [{categoryId: 1, amount: 100}, {categoryId: 1, amount: 50}, {categoryId: 2, amount: 200}]
     * // Output: { 1: 150, 2: 200 }
     */
    aggregateByCategory(expenses) {
        const categoryTotals = {};
        expenses.forEach(expense => {
            if (!categoryTotals[expense.categoryId]) {
                categoryTotals[expense.categoryId] = 0;
            }
            categoryTotals[expense.categoryId] += expense.amount;
        });
        return categoryTotals;
    }
}

export default DailyLimitCalculator;
