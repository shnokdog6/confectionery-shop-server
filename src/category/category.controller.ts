import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CategoryService } from "@/category/category.service";
import { createCategoryDto } from "@/category/dto/createCategoryDto";

@Controller("category")
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get(":id")
    public async getByID(@Param("id") id: number) {
        return await this.categoryService.getByID(id);
    }

    @Get()
    public async getAll() {
        return await this.categoryService.getAll();
    }

    @Post()
    public async create(@Body() dto: createCategoryDto) {
        return await this.categoryService.create(dto);
    }
}
