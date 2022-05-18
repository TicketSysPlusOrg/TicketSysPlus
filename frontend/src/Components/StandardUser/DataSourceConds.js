export const ConditionalExample = {
    "type": "object",
    "properties": {
        "enrollment_items": {
            "title": "Sources to add enrollment to:",
            "description": "What source(s) do we need to enable enrollment?",
            "type": "array",
            "items": {
                "type": "object",
                "anyOf": [
                    {
                        "title": "Toyota",
                        "properties": {
                            "choices": {
                                "description": "What type of service would you like to enroll Toyota in?",
                                "type": "array",
                                "items": {
                                    "type": "string",
                                    "enum": [
                                        "Driver Behavior",
                                        "Telemetry",
                                        "Geo Tracking"
                                    ]
                                },
                                "uniqueItems": true,
                                "minItems": 1
                            }
                        },
                        "required": ["choices"]
                    },
                    {
                        "title": "Geotab",
                        "properties": {
                            "choices": {
                                "description": "These enrollments may require authorization from the source. Proceed?",
                                "type": "array",
                                "items": {
                                    "type": "string",
                                    "enum": [
                                        "Yes",
                                        "No"
                                    ]
                                },
                                "uniqueItems": true,
                                "minItems": 1
                            }
                        },
                        "required": ["choices"]

                    },
                ]
            }
        },
        "required": ["items"]
    },
    "required": ["enrollment_items"]
};
