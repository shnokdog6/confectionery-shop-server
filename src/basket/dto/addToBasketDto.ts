export class addToBasketDto {
    public readonly userID: string;
    public readonly products: Array<{ id: number; count: number }>;
}
