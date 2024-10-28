import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";

const createServer = () => {
    const app = express();

    // Configure middleware
    app.use(cors({
        origin: '*',
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

const registerRoutes = (app: express.Application) => {
    Routes.forEach(route => {
        const controllerInstance = new (route.controller as any)();
        app[route.method as keyof express.Application](route.route, async (req: Request, res: Response) => {
            try {
                const result = await controllerInstance[route.action](req, res);
                if (result !== undefined) {
                    return res.json(result);
                }
            } catch (error) {
                console.error("Error processing request:", error);
                if (!res.headersSent) {
                    return res.status(500).send("Internal Server Error");
                }
            }
        });
    });
};

const startServer = async () => {
    const app = createServer();

    try {
        await AppDataSource.initialize();
        const port = Number(process.env.SERVER_PORT) || 3000;
        app.listen(port, () => {
            console.log(`Express server has started on ${process.env.BACKEND_HOST}.`);
        });
    } catch (error) {
        console.error("Error initializing AppDataSource:", error);
    }
};

startServer();