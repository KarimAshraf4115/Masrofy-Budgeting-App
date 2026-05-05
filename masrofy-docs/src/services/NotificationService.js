/**
 * @fileoverview NotificationService — Business logic service for budget alert generation.
 * Evaluates budget usage and cycle timing to produce contextual alert messages
 * displayed on the dashboard and after each expense is logged.
 * Stateless by design — no flags or instance state are stored.
 * @module services/NotificationService
 * @author Karim Ashraf Ahmed, Eyad Hatem Fouad, Sherif Ahmed Metwally, Ahmed Sherif Ahmed
 */

/**
 * @typedef {Object} Alert
 * @property {'warning'|'danger'|'info'} type - The severity level of the alert.
 * @property {string} message - The human-readable alert message to display in the UI.
 */

/**
 * @class NotificationService
 * @classdesc Generates budget alert notifications based on spending percentage and remaining days.
 * All methods are stateless pure functions — the service creates no side effects and
 * stores no flags between calls. Alert display and dismissal logic is delegated to the frontend.
 * A fresh instance is created per API request.
 */
class NotificationService {

    /**
     * Generates a warning alert when budget usage is between 80% and 100%.
     * @param {number} percentageUsed - The current budget usage as a percentage (0–100+).
     * @returns {Alert|null} A warning alert object, or null if the threshold has not been reached.
     * @example
     * service.sendThresholdAlerts(85);
     * // { type: 'warning', message: "Alert: You've used 85% of your budget!" }
     */
    sendThresholdAlerts(percentageUsed) {
        if (percentageUsed >= 80 && percentageUsed < 100) {
            return {
                type: 'warning',
                message: `Alert: You've used ${percentageUsed}% of your budget!`
            };
        }
        return null;
    }

    /**
     * Generates a danger alert when budget usage reaches or exceeds 100%.
     * @param {number} percentageUsed - The current budget usage as a percentage.
     * @returns {Alert|null} A danger alert object, or null if under 100%.
     * @example
     * service.sendBudgetExhaustedAlert(105);
     * // { type: 'danger', message: "Alert: You've exhausted your budget!" }
     */
    sendBudgetExhaustedAlert(percentageUsed) {
        if (percentageUsed >= 100) {
            return {
                type: 'danger',
                message: `Alert: You've exhausted your budget!`
            };
        }
        return null;
    }

    /**
     * Generates an informational alert on the final day of the budget cycle.
     * @param {number} daysLeft - The number of days remaining in the cycle including today.
     * @returns {Alert|null} An info alert object if today is the last day, or null otherwise.
     * @example
     * service.sendFinalDayWarning(1);
     * // { type: 'info', message: "Alert: This is your final day with the budget!" }
     */
    sendFinalDayWarning(daysLeft) {
        if (daysLeft === 1) {
            return {
                type: 'info',
                message: `Alert: This is your final day with the budget!`
            };
        }
        return null;
    }

    /**
     * Evaluates all alert conditions and returns an array of triggered alerts.
     * Checks budget exhaustion first (highest priority), then threshold warning,
     * then final day warning. Multiple alerts can be active simultaneously.
     * @param {number} percentageUsed - The current budget usage as a percentage.
     * @param {number} daysLeft - The number of days remaining in the cycle.
     * @returns {Alert[]} An array of triggered alert objects. Empty array if no alerts apply.
     * @example
     * service.checkAllAlerts(95, 1);
     * // [
     * //   { type: 'warning', message: "Alert: You've used 95% of your budget!" },
     * //   { type: 'info', message: "Alert: This is your final day with the budget!" }
     * // ]
     */
    checkAllAlerts(percentageUsed, daysLeft) {
        const alerts = [];
        const exhaustedAlert = this.sendBudgetExhaustedAlert(percentageUsed);
        if (exhaustedAlert) alerts.push(exhaustedAlert);
        const thresholdAlert = this.sendThresholdAlerts(percentageUsed);
        if (thresholdAlert) alerts.push(thresholdAlert);
        const finalDayAlert = this.sendFinalDayWarning(daysLeft);
        if (finalDayAlert) alerts.push(finalDayAlert);
        return alerts;
    }
}

export default NotificationService;
