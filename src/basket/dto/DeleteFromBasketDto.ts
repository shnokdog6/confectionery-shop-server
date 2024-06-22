export class DeleteFromBasketDto {
    public readonly userID: string;
    public readonly product: { id: number; count: number };
}
