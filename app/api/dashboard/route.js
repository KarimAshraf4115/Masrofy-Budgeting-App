// this file contains the API route for the dashboard, which is responsible for fetching the data needed to display the user's dashboard, including the active cycle information and the total expenses for the current cycle. It also calculates the percentage of the budget used and the remaining balance to provide insights into the user's spending habits.

import CycleRepository from '@/lib/CycleRepository';
import ExpenseRepository from '@/lib/ExpenseRepository';
import DailyLimitCalculator from '@/services/DailyLimitCalculator';
import BudgetCycle from '@/models/BudgetCycle';
import NotificationService from '@/services/NotificationService';

const cycleRepo = new CycleRepository();
const expenseRepo = new ExpenseRepository();
const calculator = new DailyLimitCalculator();
const notificationService = new NotificationService();

export async function GET(){
    const cycleData = cycleRepo.getActiveCycle();
    if(!cycleData){
        return Response.json({ message: 'No active cycle found' }, { status: 404 });
    }

    const cycle = new BudgetCycle(
        cycleData.id,
        cycleData.totalAllowance,
        cycleData.startDate,
        cycleData.endDate,
        cycleData.isActive,
        cycleData.createdAt
    );

    const totalSpent = expenseRepo.getTotalSpent(cycle.id); 
    const categoryTotals = expenseRepo.getAllByCycle(cycle.id);
    const percentageUsed = calculator.checkThreshold(totalSpent, cycle.totalAllowance);
    const remainingBalance = calculator.calculateRemainingBalance(cycle.totalAllowance, totalSpent);
    const remainingDays = cycle.getRemainingDays();
    const dailyLimit = calculator.calculateDailyLimit(remainingBalance, remainingDays); 
    const aggregatedByCategory = calculator.aggregateByCategory(categoryTotals);

    const categoryBreakdown = Object.entries(aggregatedByCategory).map(([categoryId, total]) => {
        return {
            categoryId: categoryId,
            totalSpent: total,
            percentage: calculator.calculateCategoryPercentage(total, totalSpent)
        };
    });

    let finalDayWarning = null;
    if(cycle.isLastDay()){
        finalDayWarning = notificationService.sendFinalDayWarning(remainingDays); // FIX: Pass remainingDays, not remainingBalance
    }

    return Response.json({
        hasActiveCycle: true,
        cycle: { // Cycle info
            id: cycle.id,
            startDate: cycle.startDate,
            endDate: cycle.endDate,
            duration: cycle.getDurationDays(),
        },

        financials: { // Financial info
            totalAllowance: cycle.totalAllowance,
            totalSpent : totalSpent,
            percentageUsed : percentageUsed.toFixed(1) + '%',
            remainingBalance : remainingBalance.toFixed(2),
            remainingDays : remainingDays,
            dailyLimit : dailyLimit.toFixed(2)
        },

        categoryBreakdown: categoryBreakdown,

        alerts : { // Alerts info
            finalDayWarning : finalDayWarning
        }
    },{status:200});
}












