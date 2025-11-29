import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Submission from '@/models/Submission';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { formId, data } = await req.json();

        if (!formId || !data) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const submission = await Submission.create({
            formId,
            data,
        });

        return NextResponse.json({ submission }, { status: 201 });
    } catch (error) {
        console.error('Submission error:', error);
        return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
    }
}
