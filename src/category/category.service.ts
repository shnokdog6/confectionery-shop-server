import { Injectable } from "@nestjs/common";
import { Category } from "@/category/category.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateCategoryDto } from "@/category/dto/CreateCategoryDto";

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category) private category: typeof Category) {}

    public async getAll(): Promise<Category[]> {
        return this.category.findAll();
    }

    public async getByID(id: number): Promise<Category> {
        return this.category.findByPk(id);
    }

    public async create(dto: CreateCategoryDto) {
        return this.category.create({ ...dto });
    }
}
