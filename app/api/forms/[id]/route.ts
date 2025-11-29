import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Form from '@/models/Form';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // Await params in Next.js 15

        await dbConnect();
        const form = await Form.findById(id);

        if (!form) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        return NextResponse.json({ form }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch form' }, { status: 500 });
    }
}
