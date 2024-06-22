export class CreateProductDto {
    public readonly name: string;
    public readonly preview: any;
    public readonly cost: number;
    public readonly categories: number[];
    public readonly description: string;
    public readonly compound: string;
}
