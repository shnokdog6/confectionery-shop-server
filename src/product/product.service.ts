import { Category } from "@/category/category.model";
import { FileService } from "@/file/file.service";
import { CreateProductDto } from "@/product/dto/CreateProductDto";
import { Product } from "@/product/product.model";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import sequelize from "sequelize";
import { GetProductDto } from "@/product/dto/GetProductDto";
import { ProductCategories } from "@/products-categories/product-categories.model";
import { ProductDetailsModel } from "@/product-details/product-details.model";

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product) private product: typeof Product,
        @InjectModel(ProductDetailsModel)
        private productDetails: typeof ProductDetailsModel,
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

    public async getByID(id: number) {
        return await this.product.findByPk(id, {
            include: [
                {
                    model: Category,
                    through: {
                        attributes: [],
                    },
                },
                {
                    model: ProductDetailsModel,
                    attributes: {
                        exclude: ["productID", "id"],
                    },
                },
            ],
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

        await this.productDetails.create({
            productID: product.id,
            description: dto.description,
            compound: dto.compound,
        });

        for (const id of dto.categories) {
            await this.productCategories.create({
                productID: product.id,
                categoryID: id,
            });
        }

        return this.getByID(product.id);
    }

    public async getProductCost(id: number) {
        return await this.product
            .findByPk(id, {
                attributes: ["cost"],
                raw: true,
            })
            .then((result) => result.cost);
    }
}
