'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, X } from 'lucide-react';

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    onRemove: () => void;
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    };

    return (
        <div>
            <CldUploadWidget
                uploadPreset="ai_form_generator_preset" // User needs to create this in Cloudinary
                onSuccess={onUpload}
                options={{
                    maxFiles: 1
                }}
            >
                {({ open }) => {
                    return (
                        <div
                            onClick={() => open?.()}
                            className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 border-gray-300 flex flex-col justify-center items-center h-32 w-full rounded-lg bg-gray-50"
                        >
                            {value ? (
                                <div className="relative w-full h-full">
                                    <img src={value} alt="Upload" className="object-cover w-full h-full rounded-lg" />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove();
                                        }}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-sm"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-gray-500">
                                    <ImagePlus size={24} />
                                    <span className="text-sm mt-2">Upload an image (optional)</span>
                                </div>
                            )}
                        </div>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
}
