// models are the blueprints or data structures that represent the entities in your application. In this case, the User model represents the structure of a user in the system, including their properties and how they interact with the database.

import crypto from 'crypto';  // importing the crypto module to handle hashing of the user's PIN for secure storage (Node.js built-in module for cryptographic operations)

class User{
    constructor(id, pinHash, PinEnabled, failedAttempts, lockoutTime){
        this.id = id;
        this.pinHash = pinHash;
        this.isPinEnabled = PinEnabled;
        this.failedAttempts = failedAttempts;
        this.lockoutTime = lockoutTime;
    }

    static hashPin(pin){
        return crypto.createHash('sha256').update(pin).digest('hex'); // hashing the input PIN using SHA-256 algorithm and returning the hexadecimal representation of the hash for secure storage in the database
    }
    verifyPin(inputPin){
        if(this.isLockedOut())return false; // if the user is currently locked out due to too many failed attempts, immediately return false without checking the PIN
        const inputHash = User.hashPin(inputPin); // hashing the input PIN using the same hashPin method to compare it with the stored hash
        if(inputHash === this.pinHash){ // comparing the hashed input PIN with the stored PIN hash to verify if they match
            this.failedAttempts = 0;
            return true; // if the hashes match, reset failed attempts and return true indicating successful authentication
        } else {
            this.failedAttempts += 1;
            if(this.failedAttempts >= 3){ // if the number of failed attempts reaches 3, set the lockout time to the current time plus a certain duration
                this.lockoutTime = new Date().getTime() + 30 * 1000; // 30 seconds in milliseconds
            }
            return false; // if the hashes do not match, increment failed attempts and return false indicating failed authentication
        }
    }

    isLockedOut(){
        if(!this.lockoutTime) return false; // if there is no lockout time set, the user is not locked out
        const currentTime = new Date().getTime();
        if(currentTime < this.lockoutTime){ // if the current time is still before the lockout time, the user is locked out
            return true;
        } else {
            this.resetFailedAttempts(); // if the lockout time has passed, reset failed attempts and allow the user to try again
            return false;
        }
    }

    resetFailedAttempts(){
        this.failedAttempts = 0;
        this.lockoutTime = null; // resetting the failed attempts counter and clearing the lockout time, allowing the user to attempt authentication again without being locked out
    }

}

export default User; // exporting the User class so that it can be imported and used in other parts of the application, such as repositories or controllers that manage user authentication and data