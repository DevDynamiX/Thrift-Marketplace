import { NextFunction, Request, Response } from "express";

export interface BaseInventoryController {
    all(req: Request, res: Response, next: NextFunction): Promise<any>;
    one(req: Request, res: Response, next: NextFunction): Promise<any>;
    save(req: Request, res: Response, next: NextFunction): Promise<any>;
    remove(req: Request, res: Response, next: NextFunction): Promise<any>;
}