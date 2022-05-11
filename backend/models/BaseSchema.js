export const BaseSchema = {
    "type": "object",
    "title": "Required Ticket Details",
    "properties": {
        "title": {
            "type": "string",
            "title": "Ticket title",
            "minLength": 1
        },
        "description": {
            "type": "string",
            "title": "Description",
            "description": "Additional required information about the ticket"
        },
        "due_date": {
            "type": "string",
            "title" : "Due Date",
            "format": "date"
        },
        "priority": {
            "type": "integer",
            "maximum": 3,
            "title": "Priority",
            "default" : 2,
            "description" : "Task priority for completion on the specified due date"
        },
        "mentions": {
            "type": "array",
            "items": {
                "type": "string",
                "enum": [
                    "shruthi@motorq.com",
                    "ashwin@motorq.com"
                ]
            },
            "uniqueItems": true,
            "minItems": 1,
            "title": "Mentions in comments",
            "description": "These users will be mentioned in the ticket comments"
        },
        "attachments": {
            "title": "Support Attachments if any",
            "description": "Currently supporting upload of 3 files with maximum of 10mb each",
            "type": "array",
            "items": {
                "type": "string",
                "format": "data-url"
            },
            "minItems" : 0,
            "maxItems" : 3
        }
    },
    "required": [
        "title",
        "due_date",
        "priority",
        "mentions"
    ]
};
