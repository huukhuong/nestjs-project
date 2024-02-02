import { ApiProperty } from '@nestjs/swagger';

export class CreateCatalogTypeDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;
}
