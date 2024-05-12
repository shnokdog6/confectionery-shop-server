import { Category } from "@/category/category.model";
import { FileService } from "@/file/file.service";
import { createProductDto } from "@/product/dto/createProductDto";
import { Product, ProductCategories } from "@/product/product.model";
import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import sequelize from "sequelize";
import { Op } from "sequelize";

@Injectable()
export class ProductService {

    constructor(
        @InjectModel(Product) private product: typeof Product,
        @InjectModel(ProductCategories) private productCategories: typeof ProductCategories,
        private fileService: FileService) {
    }

    public async getAll(options: { categories?: number[]; }) {

        if (options.categories) {
            return this.getAllByCategories(options.categories);
        }

        return this.product.findAll({
            include: {
                model: Category,
                through: {
                    attributes: []
                }
            }
        });
    }

    private async getAllByCategories(categories: number[]) {
        const identifiers = await this.product.findAll({
            attributes: ["id"],
            include: {
                model: Category,
                attributes: [],
                through: {
                    attributes: []
                },
                where: {
                    id: categories
                },
            },
            group: ["Product.id"],
            having: sequelize.where(sequelize.fn('COUNT', '*'), '=', categories.length)
        });

        return Promise.all(identifiers.map(item => this.product.findByPk(item.id, {
            include: {
                model: Category,
                through: {
                    attributes: []
                }
            }
        })));
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
