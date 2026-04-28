class DailyLimitCalculator {

    calculateDailyLimit(remainingBalance, remainingDays) {
        if (remainingDays <= 0) return 0;
        return remainingBalance / remainingDays;
    }

    calculateRemainingBalance(totalAllowance, totalSpent) {
        return totalAllowance - totalSpent;
    }

    applyRollover(cycle) {
        const remainingBalance = this.calculateRemainingBalance(
            cycle.totalAllowance,
            cycle.totalSpent
        );
        const newDailyLimit = this.calculateDailyLimit(
            remainingBalance,
            cycle.remainingDays
        );
        return newDailyLimit; // new daily limit after redistributing unspent funds across remaining days
    }

    checkThreshold(totalSpent, totalAllowance) {
        if (totalAllowance <= 0) return false; // no allowance set yet
        const percentageUsed = (totalSpent / totalAllowance) * 100;
        return percentageUsed >= 80;
}

    calculateCategoryPercentage(categoryTotal, totalSpent) {
        if (totalSpent <= 0) return 0;
        return (categoryTotal / totalSpent) * 100;
    }

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