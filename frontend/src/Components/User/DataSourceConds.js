export const ConditionalExample = {
    "type": "object",
    "properties": {
        "grocery_info": {
            "title": "Grocery Information",
            "type": "object",
            "properties": {
                "items": {
                    "description": "What categories of groceries do you need?",
                    "title": "Grocery categories",
                    "type": "array",
                    "items": {
                        "type": "object",
                        "anyOf": [
                            {
                                "title": "Vegetables",
                                "properties": {
                                    "raw_vegetables": {
                                        "description": "Raw vegetables might get spoilt in a few days and must be cooked soon. Do you want to proceed?",
                                        "type": "string",
                                        "items": {
                                            "type": "string",
                                            "oneOf": [
                                                {
                                                    "title": "Yes",
                                                    "properties": {
                                                        "vegetables": {
                                                            "description": "Select the vegetables you would like to buy from the following list",
                                                            "type": "array",
                                                            "items": {
                                                                "type": "string",
                                                                "enum": [
                                                                    "Tomatoes",
                                                                    "Eggplant",
                                                                    "Carrots",
                                                                    "Potatoes"
                                                                ]
                                                            },
                                                            "uniqueItems": true,
                                                            "minItems": 1
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        "uniqueItems": true,
                                        "minItems": 1,
                                        "maxItems": 1
                                    }
                                },
                                "required": ["raw_vegetables"]
                            },
                            {
                                "title": "Fruits",
                                "properties": {
                                    "fruits_types": {
                                        "description": "What type(s) of fruits would you like?",
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "enum": [
                                                "Banana",
                                                "Mango",
                                                "Pear"
                                            ]
                                        },
                                        "uniqueItems": true,
                                        "minItems": 1
                                    }
                                },
                                "required": [ "fruits_types" ]
                            },
                            {
                                "title": "Bread",
                                "properties": {
                                    "bread_types": {
                                        "description": "What type of bread would you like?",
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "enum": [
                                                "Wheat",
                                                "Multi-grain",
                                                "Milk"
                                            ]
                                        },
                                        "uniqueItems": true,
                                        "minItems": 1,
                                        "maxItems": 1
                                    }
                                },
                                "required": [ "bread_types" ]
                            }
                        ]
                    }
                }
            },
            "required": [ "items" ]
        }
    },
    "required": [ "grocery_info" ]
};
