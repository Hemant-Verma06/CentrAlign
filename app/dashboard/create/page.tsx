'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';
import { Loader2, Wand2 } from 'lucide-react';

export default function CreateFormPage() {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedSchema, setGeneratedSchema] = useState<any>(null);
    const router = useRouter();

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, imageUrl }),
            });
            const data = await res.json();
            if (data.schema) {
                setGeneratedSchema(data.schema);
            } else {
                alert('Failed to generate form');
            }
        } catch (error) {
            console.error(error);
            alert('Error generating form');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!generatedSchema) return;
        try {
            const res = await fetch('/api/forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(generatedSchema),
            });
            if (res.ok) {
                router.push('/dashboard');
            } else {
                alert('Failed to save form');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving form');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Form with AI</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Input */}
                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Describe your form
                            </label>
                            <textarea
                                className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g. I need a job application form for a software engineer position..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reference Image (Optional)
                            </label>
                            <ImageUpload
                                value={imageUrl}
                                onChange={setImageUrl}
                                onRemove={() => setImageUrl('')}
                            />
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt}
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
                            Generate Form
                        </button>
                    </div>

                    {/* Right: Preview */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Preview</h2>
                        {generatedSchema ? (
                            <div className="space-y-4">
                                <div className="border-b pb-4">
                                    <h3 className="text-lg font-bold">{generatedSchema.title}</h3>
                                    <p className="text-gray-500">{generatedSchema.description}</p>
                                </div>
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                    {generatedSchema.schema.map((field: any, idx: number) => (
                                        <div key={idx}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                            </label>
                                            {field.type === 'textarea' ? (
                                                <textarea className="w-full p-2 border rounded bg-gray-50" disabled />
                                            ) : field.type === 'select' ? (
                                                <select className="w-full p-2 border rounded bg-gray-50" disabled>
                                                    <option>Select...</option>
                                                    {field.options?.map((opt: string) => <option key={opt}>{opt}</option>)}
                                                </select>
                                            ) : (
                                                <input type={field.type} className="w-full p-2 border rounded bg-gray-50" disabled />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                                >
                                    Save & Publish Form
                                </button>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-center">
                                <p>Generated form preview will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
