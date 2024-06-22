export class AddToBasketDto {
    public readonly userID: string;
    public readonly product: { id: number; count: number };
}
