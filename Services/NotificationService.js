
// New Fixes Added : remove flags (alert80sent , alert100sent , isFinalDay,.....) since every request in api has its own fresh instance so the notification will be checked if should be sent ot not every time.. the notification will not be recorded as a flag

class NotificationService {
    sendThresholdAlerts(percentageUsed) {
        if (percentageUsed >= 80 && percentageUsed < 100) {
            return{
                type: 'warning',
                message: `Alert: You've used ${percentageUsed}% of your budget!`
            }
        }
        return null; // returning null if no threshold alert is triggered, indicating that the budget usage has not yet reached the 80% threshold or the alert has already been sent
    }

    sendBudgetExhaustedAlert(percentageUsed) {
        if (percentageUsed >= 100 ) {
            return {
                type: 'danger',
                message: `Alert: You've exhausted your budget!`
            }
        }
        return null; // returning null if no budget exhausted alert is triggered, indicating that the budget usage has not yet reached 100% or the alert has already been sent
    }

    sendFinalDayWarning(daysLeft) {
        if (daysLeft === 1) {
            return {
                type: 'info',
                message: `Alert: This is your final day with the budget!`
            }
        }
        return null; // returning null if no final day warning is triggered, indicating that there are more than 1 day left in the cycle or the alert has already been sent
    }

    checkAllAlerts(percentageUsed, daysLeft) {
        const alerts = [];
        const exhaustedAlert = this.sendBudgetExhaustedAlert(percentageUsed);
        if (exhaustedAlert) alerts.push(exhaustedAlert);
        const thresholdAlert = this.sendThresholdAlerts(percentageUsed);
        if (thresholdAlert) alerts.push(thresholdAlert);
        const finalDayAlert = this.sendFinalDayWarning(daysLeft);
        if (finalDayAlert) alerts.push(finalDayAlert);
        return alerts; // returning an array of all triggered alerts based on the current budget usage and days left in the cycle
    }
}

export default NotificationService; // exporting the NotificationService class to be used in other parts of the application