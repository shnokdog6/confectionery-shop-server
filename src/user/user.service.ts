import { Injectable } from "@nestjs/common";
import { createUserDto } from "@/user/dto/createUserDto";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "@/user/user.model";
import bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private userModel: typeof User) {}

    public async getAll() {
        return this.userModel.findAll();
    }

    public async getById(id: number) {
        return this.userModel.findByPk(id);
    }

    public async getByPhoneNumber(phoneNumber: string) {
        return this.userModel.findOne({
            where: {
                phoneNumber,
            },
        });
    }

    public async create(dto: createUserDto) {
        const user = await this.getByPhoneNumber(dto.phoneNumber);
        if (user) {
            throw new Error("Пользоветель с таким номер существует");
        }
        const passwordHash = await bcrypt.hash(dto.password, 3);
        return this.userModel.create({
            phoneNumber: dto.phoneNumber,
            password: passwordHash,
        });
    }
}
