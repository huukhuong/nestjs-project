import { ApiProperty } from '@nestjs/swagger';
import Constants from 'src/utils/constants';
import { Pagging } from 'src/utils/pagging.dto';

export class SearchPermissionDto extends Pagging {
  @ApiProperty({
    default: false,
  })
  withDeleted?: boolean;

  @ApiProperty()
  code?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty({
    default: Constants.UUID_EXAMPLE,
  })
  groupId?: string;
}
