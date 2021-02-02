import { IsString, IsNotEmpty} from 'class-validator';

export class PixKeyExistsDto {
  @IsString()
  @IsNotEmpty()
  readonly kind: string;

  @IsString()
  @IsNotEmpty()
  readonly key: string;
}
