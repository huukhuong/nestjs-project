import { ApiProperty } from '@nestjs/swagger';

export class Pagging {
  @ApiProperty({
    default: 10,
  })
  pageSize: number;

  @ApiProperty({
    default: 1,
  })
  pageIndex: number;

  @ApiProperty({
    default: 'DESC',
  })
  orderBy?: 'DESC' | 'ASC';

  @ApiProperty()
  orderColumn?: string;
}
