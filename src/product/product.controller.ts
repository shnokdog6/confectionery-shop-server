import {
    Body,
    Controller,
    FileTypeValidator,
    Get,
    Param,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import {createProductDto} from "@/product/dto/createProductDto";
import {ProductService} from "@/product/product.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {Product} from "@/product/product.model";

@Controller('product')
export class ProductController {

    constructor(private productService: ProductService) {
    }

    @Get(":id")
    public async getById(@Param("id") id: number): Promise<Product> {
        return await this.productService.getById(id);
    }

    @UseInterceptors(FileInterceptor("preview"))
    @Post()
    public async create(
        @Body() dto: createProductDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({fileType: "image/*"})
                ]
            })
        ) preview: Express.Multer.File
    ): Promise<Product> {
        return this.productService.create({...dto, preview});
    }

}
