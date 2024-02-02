import { ApiProperty } from '@nestjs/swagger';
import { Pagging } from 'src/utils/pagging.dto';

export class SearchRoleDto extends Pagging {
  @ApiProperty()
  code?: string;

  @ApiProperty()
  name?: string;
}
