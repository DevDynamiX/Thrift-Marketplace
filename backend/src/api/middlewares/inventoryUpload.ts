import multer from "multer";
import path from "path";


// this file is meant to handle the images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //TODO: See if can be stored on cloud -- look into 'Cloudinary'
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }else{
        cb (new Error("Invalid file type."));
    }
};

export const upload = multer ({
    storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter
});


export const errorHandler = (err: any, req: any, res: any, next: any) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(500).json({ message: err.message });
    } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(400).json({ message: err.message });
    }
    next();
};