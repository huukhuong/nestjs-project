import { ApiProperty } from "@nestjs/swagger";

export class CreateCatalogDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  catalogTypeCode: string;
}