import {
    Body,
    Controller,
    FileTypeValidator,
    Get,
    Param,
    ParseFilePipe,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { GetProductDto } from "@/product/dto/GetProductDto";
import { CreateProductDto } from "@/product/dto/CreateProductDto";
import { Product } from "@/product/product.model";
import { ProductService } from "@/product/product.service";

@Controller({ path: "product", version: "1" })
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get()
    public async get(@Query() query: GetProductDto) {
        return await this.productService.get(query);
    }

    @Get(":id")
    public async getByID(@Param("id") id: number) {
        return await this.productService.getByID(id);
    }

    // @Roles([RoleType.ADMIN])
    // @UseGuards(JwtAccessGuard, RolesGuard)
    @UseInterceptors(FileInterceptor("preview"))
    @Post()
    public async create(
        @Body() dto: CreateProductDto,
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
