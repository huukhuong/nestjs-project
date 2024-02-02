import { ApiProperty } from '@nestjs/swagger';
import { Pagging } from './pagging.dto';

export class SearchKeywordDto extends Pagging {
  @ApiProperty()
  keyword: string;
}
