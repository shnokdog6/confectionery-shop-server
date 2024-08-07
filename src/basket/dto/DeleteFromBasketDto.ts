import { ProductAttributes } from "@/product/product.model";
import { UserAttributes } from "@/user/user.model";

export class DeleteFromBasketDto {
    public readonly user: Pick<UserAttributes, "id">;
    public readonly product: Pick<ProductAttributes, "id">;
}
