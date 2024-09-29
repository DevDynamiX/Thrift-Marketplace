import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import * as dotenv from 'dotenv';
import * as path from 'path';

// Construct the path dynamically to the local.env file
const envPath = path.resolve(__dirname, '../../../local.env');

// Load environment variables from the local.env file
dotenv.config({ path: envPath });

// Log to check if variables are loaded correctly
console.log("Loaded Environment Variables:", {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
