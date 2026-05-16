import UserRepository from '@/lib/UserRepository';
import User from '@/models/User';

// GET — check if a PIN has been set up
// Used by app/page.js on launch to decide: go to /login or /signup
export async function GET() {
    const userRepo = new UserRepository();
    const pinSet = userRepo.isPinSet();
    return Response.json({ pinSet }, { status: 200 });
}

// POST — create a new PIN (signup)
// Called once on first launch when user sets up their PIN
export async function POST(request) {
    const body = await request.json();

    if (!body.pin) {
        return Response.json({ message: 'PIN is required' }, { status: 400 });
    }

    if (body.pin.length !== 4) {
        return Response.json({ message: 'PIN must be 4 digits' }, { status: 400 });
    }

    if (!/^\d+$/.test(body.pin)) {
        return Response.json({ message: 'PIN must contain only numbers' }, { status: 400 });
    }

    const userRepo = new UserRepository();

    // Prevent creating a second user
    if (userRepo.isPinSet()) {
        return Response.json({ message: 'PIN already set up' }, { status: 409 });
    }

    const pinHash = User.hashPin(body.pin);
    const userId = userRepo.createUser(pinHash);

    return Response.json({ message: 'PIN created successfully', userId }, { status: 201 });
}

// PUT — verify PIN (login)
// Called when user enters their PIN on the login page
export async function PUT(request) {
    const body = await request.json();

    if (!body.pin) {
        return Response.json({ message: 'PIN is required' }, { status: 400 });
    }

    const userRepo = new UserRepository();
    const user = userRepo.getUser();

    if (!user) {
        return Response.json({ message: 'No user found' }, { status: 404 });
    }

    // Check lockout BEFORE verifying PIN
    if (user.isLockedOut()) {
        const timeLeft = Math.ceil((user.lockoutTime - new Date().getTime()) / 1000);
        return Response.json({
            message: `Too many attempts. Try again in ${timeLeft} seconds.`,
            locked: true,
            timeLeft
        }, { status: 429 });
    }

    const success = user.verifyPin(body.pin);

    // Always save state back to DB after every attempt 
    userRepo.updateUser(user);

    if (success) {
        return Response.json({ message: 'PIN verified successfully', success: true }, { status: 200 });
    } else {
        const attemptsLeft = 3 - user.failedAttempts;
        return Response.json({
            message: attemptsLeft > 0
                ? `Wrong PIN. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} left.`
                : 'Too many attempts. Locked out for 30 seconds.',
            success: false,
            attemptsLeft
        }, { status: 401 });
    }
}