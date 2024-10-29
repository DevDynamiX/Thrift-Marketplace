// global.d.ts
import { Request } from 'express';

interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
    path: string; // Add more properties as necessary
}

declare global {
    namespace Express {
        interface Request {
            files?: { [key: string]: MulterFile[] };
        }
    }
}
