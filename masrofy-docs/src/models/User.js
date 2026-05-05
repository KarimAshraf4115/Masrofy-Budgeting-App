/**
 * @fileoverview User model representing the application's single authenticated user.
 * Handles PIN hashing, verification, lockout logic, and failed attempt tracking.
 * @module models/User
 * @author Karim Ashraf Ahmed, Eyad Hatem Fouad, Sherif Ahmed Metwally, Ahmed Sherif Ahmed
 */

import crypto from 'crypto';

/**
 * @class User
 * @classdesc Represents the single application user. Manages PIN-based authentication
 * including hashing, verification, lockout enforcement, and attempt counting.
 * The application follows a single-user model — only one User row exists in the database.
 */
class User {
    /**
     * Creates a new User instance.
     * @param {number} id - The unique identifier from the database.
     * @param {string} pinHash - The SHA-256 hashed PIN stored in the database.
     * @param {number} pinEnabled - Whether PIN authentication is active (1 = enabled, 0 = disabled).
     * @param {number} failedAttempts - Number of consecutive failed login attempts.
     * @param {number|null} lockoutTime - Timestamp (ms) when the lockout expires, or null if not locked.
     */
    constructor(id, pinHash, pinEnabled, failedAttempts, lockoutTime) {
        this.id = id;
        this.pinHash = pinHash;
        this.isPinEnabled = pinEnabled;
        this.failedAttempts = failedAttempts;
        this.lockoutTime = lockoutTime;
    }

    /**
     * Hashes a plain-text PIN using SHA-256.
     * This is a static method so it can be called without instantiating a User object,
     * which is useful during signup and PIN change operations.
     * @static
     * @param {string} pin - The plain-text 4-digit PIN to hash.
     * @returns {string} The hexadecimal SHA-256 hash of the PIN.
     * @example
     * const hash = User.hashPin('1234');
     * // returns 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3'
     */
    static hashPin(pin) {
        return crypto.createHash('sha256').update(pin).digest('hex');
    }

    /**
     * Verifies a plain-text PIN against the stored hash.
     * Enforces lockout by returning false immediately if the user is currently locked out.
     * On failure, increments the failed attempt counter and triggers lockout after 5 failures.
     * On success, resets the failed attempt counter.
     * @param {string} inputPin - The plain-text PIN entered by the user.
     * @returns {boolean} True if the PIN matches and the user is not locked out, false otherwise.
     */
    verifyPin(inputPin) {
        if (this.isLockedOut()) return false;
        const inputHash = User.hashPin(inputPin);
        if (inputHash === this.pinHash) {
            this.failedAttempts = 0;
            return true;
        } else {
            this.failedAttempts += 1;
            if (this.failedAttempts >= 5) {
                this.lockoutTime = new Date().getTime() + 30 * 1000; // 30-second lockout
            }
            return false;
        }
    }

    /**
     * Checks whether the user is currently locked out due to too many failed attempts.
     * If the lockout period has expired, automatically resets the failed attempt counter.
     * @returns {boolean} True if the user is locked out, false otherwise.
     */
    isLockedOut() {
        if (!this.lockoutTime) return false;
        const currentTime = new Date().getTime();
        if (currentTime < this.lockoutTime) {
            return true;
        } else {
            this.resetFailedAttempts();
            return false;
        }
    }

    /**
     * Resets the failed attempt counter and clears the lockout timestamp.
     * Called automatically when a lockout period expires.
     * @returns {void}
     */
    resetFailedAttempts() {
        this.failedAttempts = 0;
        this.lockoutTime = null;
    }
}

export default User;
