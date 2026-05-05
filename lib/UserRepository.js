import SQLiteHelper from "./SQLiteHelper";
import User from '@/models/User';
class UserRepository{

    constructor(){
        this.db = SQLiteHelper.getInstance().getWritableDatabase();
    }
    // check the user has already a password or not to decide to login or password
    isPinSet(){
        const row = this.db.prepare('SELECT id FROM User WHERE pinHash IS NOT NULL LIMIT 1').get();
        return !!row;
    }

    // get the single row that ma
    getUser(){
        const row = this.db.prepare('SELECT * FROM User LIMIT 1').get();
        if(!row){return null;}
        return new User (
            row.id,
            row.pinHash,
            row.pinEnabled,
            row.failedAttempts,
            row.lockoutTimestamp
        );
    }

    createUser (pinHash){
        const result = this.db.prepare('INSERT INTO User (pinHash, pinEnabled, failedAttempts) VALUES (?, 1, 0)').run(pinHash);
        return result.lastInsertRowid;
    }

    updateUser(user){
        this.db.prepare('UPDATE User SET failedAttempts = ?, lockoutTimestamp = ? WHERE id = ?').run(user.failedAttempts, user.lockoutTime, user.id);
    }

    updatePin(userID,newPinHash){
        this.db.prepare('UPDATE User SET pinHash = ? , pinEnabled = 1 where id = ?').run(newPinHash, userID);
    }
}

export default UserRepository;