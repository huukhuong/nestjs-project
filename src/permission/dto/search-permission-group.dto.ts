import { ApiProperty } from '@nestjs/swagger';
import { Pagging } from 'src/utils/pagging.dto';

export class SearchPermissionGroupDto extends Pagging {
  @ApiProperty({
    default: false,
  })
  withDeleted?: boolean;

  @ApiProperty()
  name?: string;
}
