import { Category } from "@/category/category.model";
import { FileService } from "@/file/file.service";
import { CreateProductDto } from "@/product/dto/CreateProductDto";
import { Product } from "@/product/product.model";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import sequelize from "sequelize";
import { GetProductDto } from "@/product/dto/GetProductDto";
import { ProductCategories } from "@/products-categories/product-categories.model";

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product) private product: typeof Product,
        @InjectModel(ProductCategories)
        private productCategories: typeof ProductCategories,
        private fileService: FileService,
    ) {}

    public async get(dto: GetProductDto) {
        if (dto.categories) {
            return this.getByCategories(dto);
        }
        return this.product.findAll({
            include: {
                model: Category,
                through: {
                    attributes: [],
                },
            },
            where: {
                ...dto,
            },
        });
    }

    private async getByCategories(dto: GetProductDto) {
        const identifiers = await this.product
            .findAll({
                attributes: ["id"],
                include: {
                    model: Category,
                    attributes: [],
                    through: {
                        attributes: [],
                    },
                    where: {
                        id: dto.categories,
                    },
                },
                group: ["Product.id"],
                having: sequelize.where(
                    sequelize.fn("COUNT", "*"),
                    "=",
                    dto.categories.length,
                ),
                raw: true,
            })
            .then((array) => array.map((item) => item.id));

        delete dto.categories;
        return this.product.findAll({
            include: {
                model: Category,
                through: {
                    attributes: [],
                },
            },
            where: {
                ...dto,
                id: identifiers,
            },
        });
    }

    public async getById(id: number) {
        return this.product.findByPk(id, {
            include: {
                model: Category,
                through: {
                    attributes: [],
                },
            },
        });
    }

    public async include(identifiers: number[]) {
        const products = await this.product.findAll({
            where: {
                id: identifiers,
            },
        });
        return products.length === identifiers.length;
    }

    public async create(dto: CreateProductDto) {
        const filename =
            (await this.fileService.create(dto.preview)) || "empty";
        const product = await this.product.create({
            name: dto.name,
            preview: filename,
            cost: dto.cost,
        });

        for (const id of dto.categories) {
            await this.productCategories.create({
                productID: product.id,
                categoryID: id,
            });
        }

        return this.getById(product.id);
    }

    public async getSumOfProducts(identifiers: number[]) {
        return await this.product
            .findAll({
                where: {
                    id: identifiers,
                },
                attributes: [
                    [sequelize.fn("sum", sequelize.col("cost")), "cost"],
                ],
                raw: true,
            })
            .then((result) => result[0].cost);
    }
}
