import { ProductAttributes } from "@/product/product.model";

export class DeleteFromBasketDto {
    public readonly userID: string;
    public readonly product: Pick<ProductAttributes, "id">;
}
