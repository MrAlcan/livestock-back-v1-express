import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, './uploads/temp');
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const uploadSingle = (fieldName: string) => upload.single(fieldName);
export const uploadMultiple = (fieldName: string, maxCount: number = 5) =>
  upload.array(fieldName, maxCount);
