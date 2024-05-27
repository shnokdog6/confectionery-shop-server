import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "@/user/user.service";
import { addToBasketDto } from "@/basket/dto/addToBasketDto";
import { InjectModel } from "@nestjs/sequelize";
import { Basket, ProductsInBasket } from "@/basket/basket.model";
import { ProductService } from "@/product/product.service";
import { Product } from "@/product/product.model";

@Injectable()
export class BasketService {

    constructor(
        @InjectModel(Basket) private basketModel: typeof Basket,
        @InjectModel(ProductsInBasket) private productInBasketModel: typeof ProductsInBasket,
        private userService: UserService,
        private productService: ProductService,
    ) {
    }

    public async add(dto: addToBasketDto) {
        const user = await this.userService.getById(dto.userID);
        if (!user) {
            throw new BadRequestException("Пользоветель не найден");
        }

        const isProductsExist = await this.productService.include(dto.products.map(product => product.id));
        if (!isProductsExist) {
            throw new BadRequestException("Указан продукт, которого не существует");
        }

        const basket = await this.basketModel.findOrCreate({
            where: {
                userID: dto.userID,
            },
        }).then(result => result[0]);

        for (const product of dto.products) {
            const instance = await this.productInBasketModel.findOne({
                where: {
                    productID: product.id,
                },
            });

            if (!instance) {
                await this.productInBasketModel.create({
                    basketID: basket.id,
                    productID: product.id,
                    count: product.count,
                });
                continue;
            }

            instance.count += product.count;
            await instance.save();
        }
    }

    public async getAll(userID: number) {
        const basket = await this.basketModel.findOne({
            where: {
                userID
            }
        });
        return this.productInBasketModel.findAll({
            include: {
                model: Product
            },
            where: {
                basketID: basket.id
            },
            attributes: {
                exclude: ["basketID", "productID"]
            }
        });
    }
}
