import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import crypto from "node:crypto";
import {extname} from "node:path";
import {BadRequestException} from "@nestjs/common";

export default FileInterceptor('avatar', {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const randomName = `avatar-${crypto.randomUUID()}`;
            return cb(null, `${randomName}${extname(file.originalname)}`);
        },
    }),

    limits: {
        fileSize: 20 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(
                new BadRequestException('Формат файла не поддерживается'),
                false
            );
        }

        cb(null, true);
    },
});