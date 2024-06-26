import { ProductAttributes } from "@/product/product.model";

export class ReduceFromBasketDto {
    public readonly userID: string;
    public readonly product: Pick<ProductAttributes, "id"> & {
        count: number;
    };
}
