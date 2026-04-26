const Database = require('better-sqlite3'); // importing the SQLite3 library into Database variable
const path = require('path'); // importing the path module to handle file paths
const fs = require('fs'); // importing the file system module to handle file operations (reading/writing files)

class SQLiteHelper {
    constructor(){
        this.DATABASE_VERSION = 1; // defining a constant for the database version, which can be used for managing database schema updates in the future
        const dbpath = path.join(process.cwd(),'masrofy.db'); // constructing the path to the database file by joining the current working directory with 'masrofy.db'
        this.db = new Database(dbpath); // creating a new instance of the Database class, connecting to the SQLite database at the specified path
        this.db.pragma('journal_mode = WAL'); // setting the journal mode of the database to Write-Ahead Logging (WAL) for better performance and concurrency
        this.db.pragma('foreign_keys = ON'); // enabling foreign key constraints in the database
        this.onCreate(); // calling the onCreate method to initialize the database schema
    }

    onCreate(){
        const schemaPath = path.join(process.cwd(),'db','init.sql'); // constructing the path to the SQL schema file by joining the current working directory with 'db/init.sql'
        const schema = fs.readFileSync(schemaPath, 'utf-8'); // reading the contents of the SQL schema file synchronously and storing it in the 'schema' variable
        this.db.exec(schema); // executing the SQL schema to create the necessary tables and structure in the database
    }
    
    getWritableDatabase(){
        return this.db; // returning the database instance, allowing other parts of the application to perform read/write operations on the database
    }

    getReadableDatabase(){
        return this.db; // returning the database instance, allowing other parts of the application to perform read operations on the database
    }

    onUpgrade(oldVersion, newVersion){
        // When you need to change the database structure in the future
        // (add columns, rename tables, etc.) you will write the SQL here
        // and increase DATABASE_VERSION by 1
    }

}
    let instance = null; // declaring a variable to hold the singleton instance of the SQLiteHelper class
    
    module.exports = {
        getInstance: function() { // any file will use the database will call this method to get the singleton instance of the SQLiteHelper class (connecting to the database)
            if (!instance) { // checking if the instance does not already exist
                instance = new SQLiteHelper(); // creating a new instance of the SQLiteHelper class
            }
            return instance; // returning the singleton instance
        }
    };