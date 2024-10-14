import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from 'dotenv';
import * as path from 'path';

// Construct the path dynamically to the local.env file
const envPath = path.resolve(__dirname, '../../../local.env');

// Load environment variables from the local.env file
dotenv.config({ path: envPath });

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST  || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/*.ts"],
    subscribers: [],
})
