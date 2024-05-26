export class authRequestDto {
  public readonly phoneNumber: string;
  public readonly password: string;
  public readonly refreshToken: string | null;
}