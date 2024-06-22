import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CategoryService } from "@/category/category.service";
import { CreateCategoryDto } from "@/category/dto/CreateCategoryDto";

@Controller({ path: "category", version: "1" })
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

    // @Roles([RoleType.ADMIN])
    // @UseGuards(JwtAccessGuard, RolesGuard)
    @Post()
    public async create(@Body() dto: CreateCategoryDto) {
        return this.categoryService.create(dto);
    }
}
