'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';

export default function PublicFormPage() {
    const params = useParams();
    const [form, setForm] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<any>({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetch(`/api/forms/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    setForm(data.form);
                    setLoading(false);
                })
                .catch(err => setLoading(false));
        }
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ formId: form._id, data: formData }),
            });
            if (res.ok) {
                setSubmitted(true);
            } else {
                alert('Submission failed');
            }
        } catch (error) {
            alert('Error submitting form');
        }
    };

    const handleInputChange = (label: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [label]: value }));
    };

    if (loading) return <div className="p-8 text-center">Loading form...</div>;
    if (!form) return <div className="p-8 text-center text-red-500">Form not found</div>;
    if (submitted) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
                <p className="text-gray-600">Your submission has been received.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                <div className="mb-8 border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
                    {form.description && <p className="mt-2 text-gray-600">{form.description}</p>}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {form.schema.map((field: any, idx: number) => (
                        <div key={idx}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>

                            {field.type === 'textarea' ? (
                                <textarea
                                    required={field.required}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-black placeholder-gray-500"
                                    placeholder={field.placeholder}
                                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    required={field.required}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-black"
                                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                                >
                                    <option value="">Select an option</option>
                                    {field.options?.map((opt: string) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : field.type === 'radio' ? (
                                <div className="space-y-2">
                                    {field.options?.map((opt: string) => (
                                        <div key={opt} className="flex items-center">
                                            <input
                                                type="radio"
                                                name={field.label}
                                                value={opt}
                                                required={field.required}
                                                onChange={(e) => handleInputChange(field.label, e.target.value)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <label className="ml-2 block text-sm text-gray-700">{opt}</label>
                                        </div>
                                    ))}
                                </div>
                            ) : field.type === 'file' || field.type === 'image' ? (
                                <ImageUpload
                                    value={formData[field.label] || ''}
                                    onChange={(url) => handleInputChange(field.label, url)}
                                    onRemove={() => handleInputChange(field.label, '')}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    required={field.required}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-black placeholder-gray-500"
                                    placeholder={field.placeholder}
                                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                                />
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
