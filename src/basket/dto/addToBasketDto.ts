export class addToBasketDto {
    public readonly userID: number;
    public readonly products: Array<{ id: number; count: number }>;

}