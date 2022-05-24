import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const TicketSchema = new Schema({
    title: {
        type: String,
        minlength: 1,
        required: true
    },
    description: {
        type: String,
        description: "Additional required information about the ticket"
    },
    due_date: {
        type: String,
        format: Date,
        required: true
    },
    priority: {
        type: Number,
        maximum: 4,
        title: "Priority",
        default: 2,
        description: "Task priority for completion on the specified due date",
        required: true
    },
    mentions: {
        type: Array,
        items: {
            type: String,
            enum: [
                "shruthi@motorq.com",
                "ashwin@motorq.com"
            ]
        },
        uniqueItems: true,
        minItems: 1,
        title: "Mentions in comments",
        description: "These users will be mentioned in the ticket comments",
        required: true
    },
    attachments: {
        title: "Support Attachments if any",
        description: "Currently supporting upload of 3 files with maximum of 10mb each",
        type: Array,
        items: {
            type: String,
            format: URL
        },
        minItems: 0,
        maxItems: 3
    },
    blocked: {
        type: Boolean,
        default: false
    },
    canceled: {
        type: Boolean,
        default: false
    },
});
