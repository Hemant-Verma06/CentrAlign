import mongoose, { Schema, model, models } from 'mongoose';

const FormFieldSchema = new Schema({
    label: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['text', 'email', 'number', 'textarea', 'select', 'radio', 'checkbox', 'file', 'date']
    },
    required: { type: Boolean, default: false },
    options: [String], // For select/radio/checkbox
    placeholder: String,
});

const FormSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    purpose: { // Important for semantic search
        type: String,
        required: true,
    },
    schema: [FormFieldSchema],
    published: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Form = models.Form || model('Form', FormSchema);

export default Form;
