export class AuthResponseDto {
    public readonly accessToken: string;
    public readonly refreshToken: string;
    public readonly roles: number[];
}
