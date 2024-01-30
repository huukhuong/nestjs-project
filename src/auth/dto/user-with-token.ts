import { User } from '../entities/user.entity';

export interface UserWithTokenDto {
  user: User;
  accessToken: string;
  refreshToken: string;
}
