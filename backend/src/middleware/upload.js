import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const maxSize = 5 * 1024 * 1024; // 5MB

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxSize , files: 1},
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(ApiError.badRequest('Only PDF files are allowed'));
        }
        cb(null, true);
    },
});

const uploadPdf=(field='file')=>(req, res, next)=>{
    upload.single(field)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(ApiError.badRequest('File size exceeds the 5MB limit'));
            }
            return next(ApiError.badRequest(err.message));
        } 
        if (err) {
            return next(err);
        }
        if (!req.file) {
            return next(ApiError.badRequest('No file uploaded'));
        }
        next();
    });
}

export default uploadPdf;