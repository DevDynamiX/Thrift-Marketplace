import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { upload, errorHandler } from './middleware/inventoryUpload';

// Circular reference handler
const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key: string, value: any) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return "[Circular]";
            }
            seen.add(value);
        }
        return value;
    };
};

// Safe JSON response handler
const safeSendJson = (res: Response, data: any) => {
    try {
        if (data === undefined) {
            return res.status(204).send();
        }
        const safeData = JSON.parse(JSON.stringify(data, getCircularReplacer()));
        return res.json(safeData);
    } catch (error) {
        console.error("Error serializing response:", error);
        return res.status(500).send("Error processing response data");
    }
};

const createServer = () => {
    const app = express();

    // Configure middleware
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }));

    app.use(requestLogger);
    app.use(bodyParser.json());

    // Register routes
    registerRoutes(app);

    // Global error handler
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error("Global error:", err);
        if (!res.headersSent) {
            const errorResponse = {
                message: err.message || "Internal Server Error",
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
            };
            safeSendJson(res.status(500), errorResponse);
        }
    });

    return app;
};

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
    }
    next();
};

const registerRoutes = (app: express.Application) => {
    Routes.forEach(route => {
        const controllerInstance = new (route.controller as any)();
        const isFileUploadRoute = route.action === "upload";

        app[route.method as keyof express.Application](
            route.route,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    if (isFileUploadRoute) {
                        if (!req.file) {
                            return res.status(400).json({ message: 'No file uploaded.' });
                        }
                        console.log('Received file:', req.file);
                    }

                    const result = await controllerInstance[route.action](req, res);
                    return safeSendJson(res, result);
                } catch (error) {
                    next(error); // Pass error to global error handler
                }
            },
            errorHandler
        );
    });
};

const startServer = async () => {
    const app = createServer();
    const port = Number(process.env.SERVER_PORT) || 3000;

    try {
        await AppDataSource.initialize();
        app.listen(port, () => {
            console.log(`[${new Date().toISOString()}] Server started on ${process.env.BACKEND_HOST}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error("[ERROR] Failed to start server:", error);
        process.exit(1);
    }
};

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

startServer();