import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];

        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        await dbConnect();
        const user = await User.findById(payload.userId);

        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json({
            user: { id: user._id, email: user.email }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
