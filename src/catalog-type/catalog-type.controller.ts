import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CatalogTypeService } from './catalog-type.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCatalogTypeDto } from './dto/create-catalog-type.dto';
import { SearchKeywordDto } from 'src/utils/search-keyword.dto';

@ApiTags('CatalogType')
@ApiBearerAuth()
@Controller('catalog-type')
export class CatalogTypeController {
  constructor(private readonly catalogTypeService: CatalogTypeService) {}

  @Post('/search')
  @ApiOperation({
    summary: 'Tìm kiếm catalog type có phân trang',
  })
  search(@Body() params: SearchKeywordDto) {
    return this.catalogTypeService.search(params);
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Thêm mới catalog type',
  })
  create(@Body() params: CreateCatalogTypeDto) {
    return this.catalogTypeService.create(params);
  }

  @Put('/update/:catalogTypeId')
  @ApiOperation({
    summary: 'Cập nhật catalog type',
  })
  update(
    @Param('catalogTypeId') catalogTypeId: string,
    @Body() params: CreateCatalogTypeDto,
  ) {
    return this.catalogTypeService.update(catalogTypeId, params);
  }

  @Delete('/delete/:catalogTypeId')
  @ApiOperation({
    summary: 'Xoá catalog type',
  })
  delete(@Param('catalogTypeId') catalogTypeId: string) {
    return this.catalogTypeService.delete(catalogTypeId);
  }
}
