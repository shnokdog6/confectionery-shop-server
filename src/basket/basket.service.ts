import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "@/user/user.service";
import { AddToBasketDto } from "@/basket/dto/AddToBasketDto";
import { InjectModel } from "@nestjs/sequelize";
import { Basket } from "@/basket/basket.model";
import { ProductService } from "@/product/product.service";
import { Product } from "@/product/product.model";
import { Sequelize } from "sequelize-typescript";
import { ProductsInBasket } from "@/products-in-basket/products-in-basket.model";
import { ReduceFromBasketDto } from "@/basket/dto/ReduceFromBasketDto";
import { DeleteFromBasketDto } from "@/basket/dto/DeleteFromBasketDto";

@Injectable()
export class BasketService {
    constructor(
        @InjectModel(Basket) private basketModel: typeof Basket,
        @InjectModel(ProductsInBasket)
        private productInBasketModel: typeof ProductsInBasket,
        private userService: UserService,
        private productService: ProductService,
    ) {}

    public async add(dto: AddToBasketDto) {
        await this.validateRequest(dto);
        const basket = await this.getOrCreateBasket(dto.userID);

        const instance = await this.productInBasketModel.findOne({
            where: {
                productID: dto.product.id,
            },
        });

        if (!instance) {
            await this.productInBasketModel.create({
                basketID: basket.id,
                productID: dto.product.id,
                count: dto.product.count,
            });
            return;
        }

        instance.count += dto.product.count;
        await instance.save();
    }

    public async reduce(dto: ReduceFromBasketDto) {
        await this.validateRequest(dto);
        const basket = await this.getOrCreateBasket(dto.userID);

        const instance = await this.productInBasketModel.findOne({
            where: {
                basketID: basket.id,
                productID: dto.product.id,
            },
        });

        if (!instance) {
            return;
        }

        instance.count -= dto.product.count;
        if (instance.count < 1) {
            await this.delete(dto);
            return;
        }
        await instance.save();
    }

    public async delete(dto: DeleteFromBasketDto) {
        const basket = await this.getOrCreateBasket(dto.userID);
        await this.productInBasketModel.destroy({
            where: {
                basketID: basket.id,
                productID: dto.product.id,
            },
        });
    }

    public async get(userID: string) {
        const basket = await this.getOrCreateBasket(userID);
        return this.productInBasketModel.findAll({
            include: {
                model: Product,
                attributes: [],
            },
            where: {
                basketID: basket.id,
            },
            attributes: {
                exclude: ["basketID", "productID"],
                include: [
                    [Sequelize.col('"product"."id"'), "id"],
                    [Sequelize.col('"product"."name"'), "name"],
                    [Sequelize.col('"product"."preview"'), "preview"],
                    [Sequelize.col('"product"."cost"'), "cost"],
                ],
            },
        });
    }

    private async getOrCreateBasket(userID: string) {
        const [basket] = await this.basketModel.findOrCreate({
            where: {
                userID,
            },
            defaults: {
                userID,
            },
        });
        return basket;
    }

    private async validateRequest(dto: AddToBasketDto | ReduceFromBasketDto) {
        const user = await this.userService.get({ id: dto.userID });
        if (!user) {
            throw new BadRequestException("Пользоветель не найден");
        }

        const isProductExist = await this.productService.include([
            dto.product.id,
        ]);
        if (!isProductExist) {
            throw new BadRequestException(
                "Указан продукт, которого не существует",
            );
        }
    }
}
