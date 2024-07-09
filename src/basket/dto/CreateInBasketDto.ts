import { UserAttributes } from "@/user/user.model";
import { ProductAttributes } from "@/product/product.model";

export class CreateInBasketDto {
    public readonly user: Pick<UserAttributes, "id">;
    public readonly product: Pick<ProductAttributes, "id">;
}
