import {BaseSchema} from "./BaseSchema";

export const ConditionalExample = {
    "type": "object",
    "properties": {
        "detail": BaseSchema,
        "grocery_info": {
            "title" : "Grocery Shopping",
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
                                "veggies" : [
                                    "celery",
                                    "artichoke",
                                    "chive",
                                    "lettuce",
                                    "carrot",
                                    "onion"
                                ],
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
                                "fruits" : [
                                    "banana",
                                    "tomato",
                                    "apple",
                                    "orange",
                                    "grape",
                                    "pear"
                                ],
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
