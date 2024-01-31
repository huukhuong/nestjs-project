import { ApiProperty } from '@nestjs/swagger';
import { Pagging } from 'src/utils/Pagging';

export class SearchRoleDto extends Pagging {
  @ApiProperty({
    default: false,
  })
  withDeleted?: boolean;

  @ApiProperty()
  code?: string;

  @ApiProperty()
  name?: string;
}
