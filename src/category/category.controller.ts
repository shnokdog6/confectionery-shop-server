import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CategoryService } from "@/category/category.service";
import { createCategoryDto } from "@/category/dto/createCategoryDto";
import { Roles, RolesGuard } from "@/role/role.guard";
import { RoleType } from "@/role/role.enum";
import { JwtAccessGuard } from "@/auth/strategy/access.strategy";

@Controller("category")
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get(":id")
    public async getByID(@Param("id") id: number) {
        return this.categoryService.getByID(id);
    }

    @Get()
    public async getAll() {
        return this.categoryService.getAll();
    }

    @Roles([RoleType.ADMIN])
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Post()
    public async create(@Body() dto: createCategoryDto) {
        return this.categoryService.create(dto);
    }
}
