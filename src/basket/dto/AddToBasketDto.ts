export class AddToBasketDto {
    public readonly userID: string;
    public readonly products: Array<{ id: number; count: number }>;
}
