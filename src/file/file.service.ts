import { Injectable } from "@nestjs/common";
import { v4 as uuidV4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import fsExists from "fs.promises.exists";

@Injectable()
export class FileService {
    async create(file: Express.Multer.File): Promise<string> {
        try {
            console.log(file);
            const fileExtension = file.originalname.split(".")[1];
            const fileName = `${uuidV4()}.${fileExtension}`;
            const filePath = path.resolve(__dirname, "..", "public");
            const pathExist = await fsExists(filePath);

            if (!pathExist) {
                await fs.mkdir(filePath, { recursive: true });
            }
            await fs.writeFile(path.join(filePath, fileName), file.buffer);

            return fileName;
        } catch (e) {
            console.log(e);
        }
    }
}
