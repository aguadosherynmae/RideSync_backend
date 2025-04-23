import { IsString, ValidateIf, IsNotEmpty } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UsernameDto {
  // Passenger & Coop
  @ValidateIf((o) => o.role === UserRole.PASSENGER || o.role === UserRole.COOP)
  @IsString()
  @IsNotEmpty()
  username ?: string;
}
