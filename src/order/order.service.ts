import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Order } from "@/order/order.model";
import { createOrderDto } from "@/order/dto/createOrderDto";
import { ProductService } from "@/product/product.service";
import { Product } from "@/product/product.model";
import { Sequelize } from "sequelize-typescript";
import { UserModel } from "@/user/user.model";
import { JwtPayloadDto } from "@/jwt/dto/JwtPayloadDto";
import { RoleType } from "@/role/role.enum";
import { ProductsInOrder } from "@/products-in-order/products-in-order.model";

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order) private orderModel: typeof Order,
        @InjectModel(ProductsInOrder)
        private productsInOrderModel: typeof ProductsInOrder,
        private productService: ProductService,
    ) {}

    public async getAll() {
        return this.orderModel.findAll();
    }

    public async get(dto: JwtPayloadDto) {
        return this.orderModel.findAll({
            where: {
                ...(!dto.roles.includes(RoleType.ADMIN) && { userID: dto.id }),
            },
        });
    }

    public async create(dto: createOrderDto) {
        const sum = await this.productService.getSumOfProducts(
            dto.products.map((item) => item.id),
        );
        const order = await this.orderModel.create({
            userID: dto.userID,
            sum,
        });
        for (const product of dto.products) {
            await this.productsInOrderModel.create({
                orderID: order.id,
                productID: product.id,
                count: product.count,
            });
        }
        return this.orderModel.findByPk(order.id, {
            include: [
                {
                    model: UserModel,
                    attributes: ["id", "phoneNumber"],
                },
                {
                    model: Product,
                    through: {
                        attributes: [],
                    },
                },
            ],
            attributes: {
                exclude: ["userID"],
                include: [
                    [Sequelize.col('"products"."id"'), "products.id"],
                    [Sequelize.col('"products"."name"'), "products.name"],
                    [Sequelize.col('"products"."preview"'), "products.preview"],
                    [Sequelize.col('"products"."cost"'), "products.cost"],
                    [
                        Sequelize.col('"products".ProductsInOrder"."count"'),
                        "products.count",
                    ],
                ],
            },
        });
    }
}
