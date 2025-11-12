import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import crypto from "node:crypto";
import {extname} from "node:path";

export default FileInterceptor('avatar', {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const randomName = `avatar-${crypto.randomUUID()}`;
            return cb(null, `${randomName}${extname(file.originalname)}`);
        },
    }),
});