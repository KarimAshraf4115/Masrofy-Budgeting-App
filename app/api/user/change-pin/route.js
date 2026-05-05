import UserRepository from '@/lib/UserRepository';
import User from '@/models/User';

export async function PUT(request) {
    const body = await request.json();

    if (!body.pin || body.pin.length !== 4 || !/^\d+$/.test(body.pin)) {
        return Response.json({ message: 'Valid 4-digit PIN is required' }, { status: 400 });
    }

    const userRepo = new UserRepository();
    const user = userRepo.getUser();

    if (!user) {
        return Response.json({ message: 'No user found' }, { status: 404 });
    }

    const newPinHash = User.hashPin(body.pin);
    userRepo.updatePin(user.id, newPinHash);

    return Response.json({ message: 'PIN updated successfully' }, { status: 200 });
}