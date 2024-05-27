export class authRequestDto {
  public readonly userID: number;
  public readonly phoneNumber: string;
  public readonly password: string;
  public readonly refreshToken: string | null;
}