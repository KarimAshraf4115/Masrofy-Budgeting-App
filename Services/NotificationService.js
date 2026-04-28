class NotificationService {
    constructor() {
        this.alert80sent = false; // flag to track if the 80% alert has been sent for the current cycle
        this.alert100sent = false; // flag to track if the 100% alert has been sent for the current cycle
        this.finalDayAlertSent = false; // flag to track if the final day warning has been sent for the current cycle
    }

    resetAlerts() {
        this.alert80sent = false;
        this.alert100sent = false;
        this.finalDayAlertSent = false;
    }

    sendThresholdAlerts(percentageUsed) {
        if (percentageUsed >= 80 && percentageUsed < 100 && !this.alert80sent) {
            this.alert80sent = true;
            return{
                type: 'warning',
                message: `Alert: You've used ${percentageUsed}% of your budget!`
            }
        }
        return null; // returning null if no threshold alert is triggered, indicating that the budget usage has not yet reached the 80% threshold or the alert has already been sent
    
    }

    sendBudgetExhaustedAlert(percentageUsed) {
        if (percentageUsed >= 100 && !this.alert100sent) {
            this.alert100sent = true;
            return {
                type: 'danger',
                message: `Alert: You've exhausted your budget!`
            }
        }
        return null; // returning null if no budget exhausted alert is triggered, indicating that the budget usage has not yet reached 100% or the alert has already been sent
    }

    sendFinalDayWarning(daysLeft) {
        if (daysLeft === 1 && !this.finalDayAlertSent) {
            this.finalDayAlertSent = true;
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