import { ProductAttributes } from "@/product/product.model";
import { UserAttributes } from "@/user/user.model";

export class AddToBasketDto {
    public readonly user: Pick<UserAttributes, "id">;
    public readonly product: Pick<ProductAttributes, "id"> & { count: number };
}
