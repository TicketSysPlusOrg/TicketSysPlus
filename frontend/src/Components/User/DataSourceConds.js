export const ConditionalExample = {
    "type": "object",
    "properties": {
        /*TODO: figure out how to handle a BaseSchema object. currently throws errors and crashes things if I don't put quotes.*/
        "detail": "BaseSchema",
        "grocery_info": {
            "title" : "Grocery Information",
            "type": "object",
            "properties" : {
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
                                        "title": "Raw vegetables might get spoilt in a few days and must be cooked soon. Do you want to proceed?",
                                        "description": "Raw vegetables might get spoilt in a few days and must be cooked soon. Do you want to proceed?",
                                        "type": "string",
                                        "enum" : ["Yes"]
                                    }
                                },
                                "required" : ["raw_vegetables"]
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
                                "required": ["fruits_types"]
                            }
                        ]
                    }
                }
            },
            "required" : ["items"]
        }
    },
    "required": ["grocery_info"]
};
