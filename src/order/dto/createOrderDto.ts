export class createOrderDto {
    public readonly userID: number;
    public readonly products: Array<{ id: number; count: number }>;
}
