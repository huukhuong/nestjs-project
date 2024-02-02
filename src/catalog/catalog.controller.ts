import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { SearchKeywordDto } from 'src/utils/search-keyword.dto';

@ApiTags('Catalog')
@ApiBearerAuth()
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post('/search')
  @ApiOperation({
    summary: 'Tìm kiếm catalog có phân trang',
  })
  search(@Body() params: SearchKeywordDto) {
    return this.catalogService.search(params);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Thêm mới catalog',
  })
  create(@Body() params: CreateCatalogDto) {
    return this.catalogService.create(params);
  }

  @Put('update/:catalogId')
  @ApiOperation({
    summary: 'Cập nhật catalog',
  })
  update(
    @Param('catalogId') catalogId: string,
    @Body() params: CreateCatalogDto,
  ) {
    return this.catalogService.update(catalogId, params);
  }

  @Delete('/delete/:catalogId')
  @ApiOperation({
    summary: 'Xoá catalog',
  })
  delete(@Param('catalogId') catalogId: string) {
    return this.catalogService.delete(catalogId);
  }
}
