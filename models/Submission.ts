import mongoose, { Schema, model, models } from 'mongoose';

const SubmissionSchema = new Schema({
    formId: {
        type: Schema.Types.ObjectId,
        ref: 'Form',
        required: true,
    },
    data: {
        type: Map,
        of: Schema.Types.Mixed, // Allows flexible key-value pairs
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

const Submission = models.Submission || model('Submission', SubmissionSchema);

export default Submission;
