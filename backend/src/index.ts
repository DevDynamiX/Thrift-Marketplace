import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { AppDataSource } from "./config/data-source";
import { Routes } from "./api/routes/routes";
import { seedRoles } from "./scripts/seeders/seedRoles";

const createServer = () => {
    const app = express();

    // Configure middleware
    app.use(cors({
        origin: process.env.DB_HOST,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }));

    app.use(bodyParser.json());
    app.use(requestLogger);

    // Register routes
    registerRoutes(app);

    return app;
};

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
};

// Register express routes from defined application routes
const registerRoutes = (app: express.Application) => {
    Routes.forEach(route => {
        app[route.method as keyof express.Application](route.route, async (req: Request, res: Response) => {
            try {
                const controllerInstance = new route.controller(); // Create instance
                const result = await controllerInstance[route.action](req, res); // Call method

                if (!res.headersSent) {
                    res.json(result);
                }
            } catch (error) {
                console.error("Error in route handler:", error);
                if (!res.headersSent) {
                    res.status(500).json({ message: "Internal Server Error" });
                }
            }
        });
    });
};

const startServer = async () => {
    const app = createServer();

    try {
        // Initialize the data source (database connection)
        await AppDataSource.initialize();

        // Seed roles into the database
        try {
            await seedRoles(AppDataSource); // Call the seedRoles function
            console.log("User roles seeded successfully.");
        } catch (error) {
            console.error("Failed to seed user roles:", error);
        }

        // Start the server
        const port = Number(process.env.SERVER_PORT) || 3000;
        app.listen(port, () => {
            console.log(`Express server has started on ${process.env.BACKEND_HOST}.`);
        });
    } catch (error) {
        console.error("Error initializing AppDataSource:", error);
    }
};

startServer().then(
    response => console.log("Server started successfully.")
).catch(
    error => console.error("Failed to start server:", error)
);