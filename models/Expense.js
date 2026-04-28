// models are the blueprints or data structures that represent the entities in your application. In this case, the User model represents the structure of a user in the system, including their properties and how they interact with the database.
class Expense {
    constructor(id, amount, categoryId, cycleId, timestamp, note) {
        this.id = id;
        this.amount = amount;
        this.categoryId = categoryId;
        this.cycleId = cycleId;
        this.timestamp = timestamp;
        this.note = note;
    }

    getFormattedDate(){
        const date = new Date(this.timestamp);
        return date.toLocaleDateString('en-US', {// converting the timestamp to a human-readable date format using the toLocaleDateString method
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }); 
    }

    getFormattedAmount(){
        return this.amount.toFixed(2) + ' EGP'; // formatting the amount to two decimal places for currency display
    }
}

export default Expense; // exporting the Expense class so that it can be imported and used in other parts of the application, such as repositories or controllers that manage expenses