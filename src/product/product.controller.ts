import { createProductDto } from "@/product/dto/createProductDto";
import { Product } from "@/product/product.model";
import { ProductService } from "@/product/product.service";
import {
    Body,
    Controller,
    FileTypeValidator,
    Get,
    ParseFilePipe,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Roles, RolesGuard } from "@/role/role.guard";
import { RoleType } from "@/role/role.enum";
import { JwtAccessGuard } from "@/auth/strategy/access.strategy";
import { GetProductDto } from "@/product/dto/GetProductDto";

@Controller("product")
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get()
    public async get(@Query() query: GetProductDto) {
        return await this.productService.get(query);
    }

    @Roles([RoleType.ADMIN])
    @UseGuards(JwtAccessGuard, RolesGuard)
    @UseInterceptors(FileInterceptor("preview"))
    @Post()
    public async create(
        @Body() dto: createProductDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [new FileTypeValidator({ fileType: "image/*" })],
            }),
        )
        preview: Express.Multer.File,
    ): Promise<Product> {
        return this.productService.create({ ...dto, preview });
    }
}
