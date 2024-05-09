import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Product, ProductCategories} from "@/product/product.model";
import {createProductDto} from "@/product/dto/createProductDto";
import {Category} from "@/category/category.model";
import {FileService} from "@/file/file.service";

@Injectable()
export class ProductService {

    constructor(@InjectModel(Product) private product: typeof Product,
                @InjectModel(ProductCategories) private productCategories: typeof ProductCategories,
                private fileService: FileService) {
    }

    public async getById(id: number) {
        return this.product.findByPk(id, {
            include: {
                model: Category,
                through: {
                    attributes: []
                }
            }
        });
    }

    public async create(dto: createProductDto) {
        const filename = await this.fileService.create(dto.preview) || "empty";
        const product = await this.product.create({
            name: dto.name,
            preview: filename,
            cost: dto.cost
        });

        for (const id of dto.categories) {
            await this.productCategories.create({
                productID: product.id,
                categoryID: id
            });
        }

        return this.getById(product.id);
    }
}
