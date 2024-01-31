import { ApiProperty } from '@nestjs/swagger';
import Constants from 'src/utils/constants';

export class CreatePermissionDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty({
    default: Constants.UUID_EXAMPLE,
  })
  groupId: string;
}
