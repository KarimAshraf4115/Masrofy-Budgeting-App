/**
 * @fileoverview SQLiteHelper — Database connection manager using the Singleton design pattern.
 * Ensures only one database connection is created and shared across the entire application,
 * preventing duplicate connections and improving performance.
 * @module lib/SQLiteHelper
 * @author Karim Ashraf Ahmed, Eyad Hatem Fouad, Sherif Ahmed Metwally, Ahmed Sherif Ahmed
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

/**
 * @class SQLiteHelper
 * @classdesc Manages the SQLite database connection. On instantiation, it connects to
 * the database file, enables WAL journal mode and foreign key enforcement,
 * and runs the schema initialization script to create tables if they do not exist.
 * This class is not exported directly — access it through the SQLiteHelperSingleton.
 */
class SQLiteHelper {
    /**
     * Creates a new SQLiteHelper instance and initializes the database.
     * Sets WAL mode for better concurrent read performance and enforces foreign key constraints.
     * Calls {@link SQLiteHelper#onCreate} to apply the schema.
     */
    constructor() {
        this.DATABASE_VERSION = 1;
        const dbpath = path.join(process.cwd(), 'masrofy.db');
        this.db = new Database(dbpath);
        this.db.pragma('journal_mode = WAL');
        this.db.pragma('foreign_keys = ON');
        this.onCreate();
    }

    /**
     * Reads and executes the SQL schema file to initialize all database tables.
     * Uses IF NOT EXISTS clauses so it is safe to call on every application start
     * without dropping existing data.
     * @returns {void}
     */
    onCreate() {
        const schemaPath = path.join(process.cwd(), 'db', 'init.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        this.db.exec(schema);
    }

    /**
     * Returns the database instance for read and write operations.
     * @returns {Database} The active SQLite database connection.
     */
    getWritableDatabase() {
        return this.db;
    }

    /**
     * Returns the database instance for read-only operations.
     * In SQLite, the same connection handles both reads and writes,
     * so this returns the same instance as {@link SQLiteHelper#getWritableDatabase}.
     * @returns {Database} The active SQLite database connection.
     */
    getReadableDatabase() {
        return this.db;
    }

    /**
     * Placeholder for future database migration logic.
     * Should be implemented when the database schema needs structural changes
     * (e.g., adding columns, renaming tables). Increment DATABASE_VERSION when used.
     * @param {number} oldVersion - The previous schema version number.
     * @param {number} newVersion - The new schema version number to migrate to.
     * @returns {void}
     */
    onUpgrade(oldVersion, newVersion) {
        // Migration logic goes here in future versions
    }
}

/** @type {SQLiteHelper|null} */
let instance = null;

/**
 * @namespace SQLiteHelperSingleton
 * @description Singleton accessor for the SQLiteHelper instance.
 * Guarantees that only one database connection exists throughout the application lifecycle.
 * All repositories obtain their database connection through this object.
 *
 * @example
 * import SQLiteHelper from '@/lib/SQLiteHelper';
 * const db = SQLiteHelper.getInstance().getWritableDatabase();
 */
const SQLiteHelperSingleton = {
    /**
     * Returns the shared SQLiteHelper instance, creating it on first call.
     * Subsequent calls return the same instance without re-initializing.
     * @returns {SQLiteHelper} The singleton SQLiteHelper instance.
     */
    getInstance() {
        if (!instance) {
            instance = new SQLiteHelper();
        }
        return instance;
    }
};

export default SQLiteHelperSingleton;
