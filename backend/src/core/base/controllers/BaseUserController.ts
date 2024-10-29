import { Request, Response } from 'express';

export interface BaseUserController {
    login(req: Request, res: Response): Promise<any>;
    register(req: Request, res: Response): Promise<any>;
    all(req: Request, res: Response): Promise<any>;
    one(req: Request, res: Response): Promise<any>;
    save(req: Request, res: Response): Promise<any>;
    remove(req: Request, res: Response): Promise<any>;
}