import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { seedRoles } from "./seeders/seedRoles";

AppDataSource.initialize().then(async () => {

    // Seed roles into the database
    try {
        await seedRoles(AppDataSource); // Call the seedRoles function
        console.log("User roles seeded successfully.");
    } catch (error) {
        console.error("Failed to seed user roles:", error);
        process.exit(1); // Exit if seeding fails to prevent further errors
    }

    const app = express();
    app.use(cors({
        origin: process.env.DB_HOST,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }));

    app.use(bodyParser.json());

    app.use((req, res, next) => {
        console.log(`Received request: ${req.method} ${req.url}`);
        next();
    });

    // Seed roles into the database
    try {
        await seedRoles(AppDataSource); // Call the seedRoles function
        console.log("User roles seeded successfully.");
    } catch (error) {
        console.error("Failed to seed user roles:", error);
    }

    // Register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, async (req: Request, res: Response, next: Function) => {
            try {
                const result = (new (route.controller as any))[route.action](req, res, next);
                if (result instanceof Promise) {
                    const data = await result;
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
                } else if (result !== null && result !== undefined) {
                    res.json(result);
                }
            } catch (error) {
                console.error("Error in route:", error); // Log error
                res.status(500).json({ message: "An internal server error occurred" }); // Send error response
            }
        });
    });

    // start express server
    app.listen(Number(process.env.SERVER_PORT), () => {
        console.log(`Express server has started on port ${process.env.SERVER_PORT}`);
    });

}).catch(error => console.log("Error during Data Source initialization:", error));
