// models are the blueprints or data structures that represent the entities in your application. In this case, the User model represents the structure of a user in the system, including their properties and how they interact with the database.
class BudgetCycle {
    constructor(id, totalAllowance, startDate, endDate, isActive, createdAt) {
        this.id = id;
        this.totalAllowance = totalAllowance;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    getDurationDays(){
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))+1; // converting milliseconds to days and rounding up to the nearest whole number
    }

    getRemainingDays(){
        const today = new Date();
        const end = new Date(this.endDate);
        today.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        if(end < today) return 0; // cycle is already over
        const diffTime = end - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include today
    }

    getRemainingBalance(totalSpent){
        return this.totalAllowance - totalSpent; // calculating the remaining balance by subtracting the total amount spent from the total allowance for the budget cycle
    }

    isLastDay(){
        const today = new Date();
        const end = new Date(this.endDate);
        today.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        return today.getTime() === end.getTime(); // checking if the current date is the same as the end date of the budget cycle, indicating that it is the last day of the cycle
    }
}

export default BudgetCycle; // exporting the BudgetCycle class so that it can be imported and used in other parts of the application, such as repositories or controllers that manage budget cycles
