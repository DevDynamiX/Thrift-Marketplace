import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";

AppDataSource.initialize().then(async () => {

    const app = express();
    app.use(cors({
        origin: 'http://192.168.1.117',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }));

    app.use(bodyParser.json());

    app.use((req, res, next) => {
        console.log(`Received request: ${req.method} ${req.url}`);
        next();
    });

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })

    app.get('/', (req, res) => {
        res.send('hello world');
    });

    // start express server
    app.listen(Number(process.env.SERVER_PORT), () => {
        console.log(`Express server has started on port ${process.env.SERVER_PORT}`);
    });

    console.log("Express server has started on port 3000. Open http://192.168.1.117:3000/users to see results")

}).catch(error => console.log(error))
