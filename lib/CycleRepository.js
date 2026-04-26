// This file is responsible for managing the cycle data in the database, providing methods of CRUD operations
const SQLiteHelper = require('./SQLiteHelper'); // importing the SQLiteHelper class from the SQLiteHelper.js file

class CycleRepository{
    constructor(){
        this.db = SQLiteHelper.getInstance().getWritableDatabase();
    }

    insertCycle(budgetCycle){
        const stmt = this.db.prepare('INSERT INTO BudgetCycle(totalAllowance, startDate, endDate, isActive, createdAt) VALUES (?, ?, ?, ?, ?)'); // preparing an SQL statement to insert a new cycle into the BudgetCycle table
        const result = stmt.run(
            budgetCycle.totalAllowance, // passing the total allowance value from the budgetCycle object to the SQL statement
            budgetCycle.startDate, // passing the start date value from the budgetCycle object to the SQL statement
            budgetCycle.endDate, // passing the end date value from the budgetCycle object to the SQL statement
            budgetCycle.isActive, // passing the active status value from the budgetCycle object to the SQL statement
            new Date().toISOString() // passing the current date and time to the SQL statement
        );
        return result.lastInsertRowid; // returning the ID of the newly inserted cycle, which can be used for reference in other operations
    }

    getActiveCycle(){
        const stmt = this.db.prepare('SELECT * FROM BudgetCycle WHERE isActive = 1'); // preparing an SQL statement to select the active cycle from the BudgetCycle table
        return stmt.get(); // returning the result of the query
    }

    updateCycle(budgetCycle){
        const stmt = this.db.prepare('UPDATE BudgetCycle SET totalAllowance = ?, startDate = ?, endDate = ?, isActive = ? WHERE id = ?');
         // preparing an SQL statement to update an existing cycle in the BudgetCycle table based on the cycle's ID
        stmt.run(
            budgetCycle.totalAllowance, // passing the total allowance value from the budgetCycle object to the SQL statement
            budgetCycle.startDate, // passing the start date value from the budgetCycle object to the SQL statement
            budgetCycle.endDate, // passing the end date value from the budgetCycle object to the SQL statement
            budgetCycle.isActive, // passing the active status value from the budgetCycle object to the SQL statement
            budgetCycle.id // passing the ID of the cycle to be updated to the SQL statement
        );
    }

    deleteCycle(cycleId){
        const stmt = this.db.prepare('DELETE FROM BudgetCycle WHERE id = ?');
        const result = stmt.run(cycleId); // executing the SQL statement to delete the cycle with the specified ID from the BudgetCycle table
        return result.changes > 0; // returning true if a cycle was deleted (changes > 0), otherwise returning false
    }

    hasActiveCycle(){
        const stmt = this.db.prepare('SELECT COUNT(*) as count FROM BudgetCycle WHERE isActive = 1'); // preparing an SQL statement to count the number of active cycles in the BudgetCycle table
        const result = stmt.get();
        return result.count > 0; // returning true if there is at least one active cycle, otherwise returning false
    }

}
    module.exports = CycleRepository; // exporting the CycleRepository class so that it can be used in other parts of the application

