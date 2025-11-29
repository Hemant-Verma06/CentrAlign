import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Form from '@/models/Form';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // Await params in Next.js 15

        const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
        const user = token ? verifyToken(token) : null;
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Verify ownership
        const form = await Form.findOne({ _id: id, userId: user.userId });
        if (!form) {
            return NextResponse.json({ error: 'Form not found or unauthorized' }, { status: 404 });
        }

        const submissions = await Submission.find({ formId: id }).sort({ submittedAt: -1 });

        return NextResponse.json({ submissions }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }
}
