import mongoose from "mongoose"
import { connectDB } from "./db.js";

await connectDB();
const db = mongoose.connection.db;
const client = mongoose.connection.getClient();

await db.command({
    collMod: "directories",
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                '_id',
                'name',
                'parentDirectoryId',
                'userId',
                'deletedAt',
                'isStarred'
            ],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                name: {
                    bsonType: 'string',
                    minLength: 1,
                    description: "Name should consists of atleast one character"
                },
                parentDirectoryId: {
                    bsonType: [
                        'null',
                        'objectId'
                    ]
                },
                userId: {
                    bsonType: 'objectId'
                },
                isStarred: {
                    bsonType: 'bool'
                },
                deletedAt: {
                    bsonType: ['date', 'null']
                },
                __v: {
                    bsonType: 'int'
                }
            },
            additionalProperties: false
        }
    },
    validationLevel: 'strict',
    validationAction: 'error'
})

await db.command({
    collMod: "files",
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                '_id',
                'extension',
                'name',
                'parentDirectoryId',
                'size',
                'userId',
                'deletedAt',
                'isStarred',
                'isShared'
            ],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                extension: {
                    bsonType: 'string'
                },
                name: {
                    bsonType: 'string',
                    minLength: 1,
                    description: "Filename should consist of atleast one character"
                },
                parentDirectoryId: {
                    bsonType: 'objectId'
                },
                size: {
                    bsonType: 'int'
                },
                userId: {
                    bsonType: 'objectId'
                },
                isStarred: {
                    bsonType: 'bool'
                },
                deletedAt: {
                    bsonType: ['date', 'null']
                },
                isShared: {
                    bsonType: 'bool'
                },
                __v: {
                    bsonType: 'int'
                }
            },
            additionalProperties: false
        }
    },
    validationLevel: 'strict',
    validationAction: 'error'
})

await db.command({
    collMod: "users",
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                '_id',
                'email',
                'name',
                'rootDirectory',
                'hasPassword'
            ],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                email: {
                    bsonType: 'string',
                    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$',
                    description: "Write a valid Email"
                },
                name: {
                    bsonType: 'string',
                    minLength: 3,
                    description: "User name should consist of atleast 3 characters"
                },
                hasPassword: {
                    bsonType: 'bool',
                },
                password: {
                    bsonType: 'string',
                    minLength: 8,
                    description: "The password should be atleast 8 characters long"
                },
                rootDirectory: {
                    bsonType: 'objectId'
                },
                picture: {
                    bsonType: ['string', 'null']
                },
                role: {
                    bsonType: 'string'
                },
                isDisabled: {
                    bsonType: 'bool'
                },
                __v: {
                    bsonType: 'int'
                }
            },
            additionalProperties: false
        }
    },
    validationLevel: 'strict',
    validationAction: 'error'
})

await client.close();