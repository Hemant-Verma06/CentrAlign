import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Form from '@/models/Form';
import { storeFormMemory } from '@/lib/memory';

export async function POST(req: Request) {
    try {
        const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
        const user = token ? verifyToken(token) : null;
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { title, description, purpose, schema } = await req.json();

        if (!title || !schema) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const form = await Form.create({
            userId: user.userId,
            title,
            description,
            purpose: purpose || title,
            schema,
        });

        // Store in Memory (now uses FREE local embeddings)
        const schemaSummary = JSON.stringify(schema.map((f: any) => ({ label: f.label, type: f.type })));
        storeFormMemory(form._id.toString(), user.userId, purpose || title, schemaSummary);
        console.log('✓ Form memory stored');

        return NextResponse.json({ form }, { status: 201 });
    } catch (error) {
        console.error('Save form error:', error);
        return NextResponse.json({ error: 'Failed to save form' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
        const user = token ? verifyToken(token) : null;
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const forms = await Form.find({ userId: user.userId }).sort({ createdAt: -1 });

        return NextResponse.json({ forms }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 });
    }
}
