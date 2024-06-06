import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "@/user/dto/CreateUserDto";
import { InjectModel } from "@nestjs/sequelize";
import { UserModel } from "@/user/user.model";
import bcrypt from "bcrypt";
import { GetUserDto } from "@/user/dto/GetUserDto";

@Injectable()
export class UserService {
    constructor(@InjectModel(UserModel) private userModel: typeof UserModel) {}

    public async get(dto: GetUserDto) {
        return this.userModel.findAll({
            where: {
                ...dto,
            },
        });
    }

    public async create(dto: CreateUserDto) {
        const user = await this.get({ phoneNumber: dto.phoneNumber }).then(
            (result) => result[0],
        );
        if (user) {
            throw new BadRequestException(
                "Пользоветель с таким номер существует",
            );
        }
        const passwordHash = await bcrypt.hash(dto.password, 3);
        return this.userModel.create({
            phoneNumber: dto.phoneNumber,
            password: passwordHash,
        });
    }
}
