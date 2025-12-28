import { client, connectDB } from "./db.js";

const db = await connectDB();

await db.command({
    collMod: "directories",
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                '_id',
                'name',
                'parentDir',
                'userId'
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
                parentDir: {
                    bsonType: [
                        'null',
                        'objectId'
                    ]
                },
                userId: {
                    bsonType: 'objectId'
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
                'filename',
                'parDirId',
                'size',
                'userId'
            ],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                extension: {
                    bsonType: 'string'
                },
                filename: {
                    bsonType: 'string',
                    minLength: 1,
                    description: "Filename should consist of atleast one character"
                },
                parDirId: {
                    bsonType: 'objectId'
                },
                size: {
                    bsonType: 'int'
                },
                userId: {
                    bsonType: 'objectId'
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
                'password',
                'rootDirectory'
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
                password: {
                    bsonType: 'string',
                    minLength: 8,
                    description: "The password should be atleast 8 characters long"
                },
                rootDirectory: {
                    bsonType: 'objectId'
                }
            },
            additionalProperties: false
        }
    },
    validationLevel: 'strict',
    validationAction: 'error'
})

await client.close();