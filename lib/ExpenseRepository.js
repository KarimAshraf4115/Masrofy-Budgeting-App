const SQLhelper = require('./SQLiteHelper'); // importing the SQLiteHelper class from the local file './SQLiteHelper.js' to manage database connections and operations

class ExpenseRepository{
    constructor(){
        this.db = SQLhelper.getInstance().getWritableDatabase(); // getting a writable database instance from the SQLiteHelper singleton to perform database operations
    }

    insertExpense(expense){
        const stmt = this.db.prepare('INSERT INTO Expense(amount, categoryId, cycleId, timestamp, note) VALUES (?, ?, ?, ?, ?)');
        const result = stmt.run(
            expense.amount,
            expense.categoryId,
            expense.cycleId,
            expense.timestamp,
            expense.note
        );
        return result.lastInsertRowid; // returning the ID of the newly inserted expense, which can be used for reference in other operations
    }

    updateExpense(expense){
        const stmt = this.db.prepare('UPDATE Expense SET amount = ?, categoryId = ?, note = ? WHERE id = ?');
        const result = stmt.run(
            expense.amount,
            expense.categoryId,
            expense.note,
            expense.id
        );
        return result.changes > 0; // returning true if an expense was updated (changes > 0), otherwise returning false
    }

    deleteExpense(expenseId){
        const stmt = this.db.prepare('DELETE FROM Expense WHERE id = ?');
        const result = stmt.run(expenseId);
        return result.changes > 0; // returning true if an expense was deleted (changes > 0), otherwise returning false
    }

    getAllByCycle(cycleId){
        const stmt = this.db.prepare('SELECT * FROM Expense WHERE cycleId = ? ORDER BY timestamp DESC');
        return stmt.all(cycleId); // returning all expenses for the specified cycle, ordered by timestamp in descending order (all returns multiple rows)
    }

    filterByCategory(cycleId, categoryId){
        const stmt = this.db.prepare('SELECT * FROM Expense WHERE cycleId = ? AND categoryId = ? ORDER BY timestamp DESC');
        return stmt.all(cycleId, categoryId); // returning all expenses for the specified cycle and category, ordered by timestamp in descending order
    }

    filterByDateRange(cycleId, startDate, endDate){
        const stmt = this.db.prepare('SELECT * FROM Expense WHERE cycleId = ? AND timestamp BETWEEN ? AND ? ORDER BY timestamp DESC');
        const result = stmt.all(cycleId, startDate, endDate);
        return result;  // returning all expenses for the specified cycle that fall within the specified date range, ordered by timestamp in descending order
    }

    getTotalSpent(cycleId){
        const stmt = this.db.prepare('SELECT SUM(amount) as total FROM Expense WHERE cycleId = ?');
        const result = stmt.get(cycleId);
        return result.total || 0; // returning the total amount spent for the specified cycle, or 0 if there are no expenses
    }

    getTotalByCategory(cycleId){
        const stmt = this.db.prepare('SELECT categoryId, SUM(amount) as total FROM Expense WHERE cycleId = ? GROUP BY categoryId');
        return stmt.all(cycleId); // returning the total amount spent for each category in the specified cycle, grouped by category ID
    }

    getCategoryById(categoryId){
        const stmt = this.db.prepare('SELECT * FROM Category WHERE id = ?');
        return stmt.get(categoryId); // returning the category with the specified ID
    }
}

    export default ExpenseRepository; // exporting the ExpenseRepository class so that it can be used in other parts of the application