import { OrderStatus } from "@/order-status/order-status.enum";

export class UpdateOrderDto {
    public readonly orderID: number;
    public readonly statusID: OrderStatus;
}
