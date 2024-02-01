import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/utils/custom-decorators';
import { RegionService } from './region.service';

@ApiTags("Region")
@Controller('region')
@Public()
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get('regions')
  @ApiOperation({ summary: 'Lấy danh sách Khu vực' })
  regions() {
    return this.regionService.regions();
  }

  @Get('provinces/:regionId')
  @ApiOperation({
    summary: 'Lấy danh sách Tỉnh thành theo Khu vực (truyền 0 để lấy cả nước)',
  })
  provinces(@Param('regionId') regionId: number) {
    return this.regionService.provinces(regionId);
  }

  @Get('districts/:provinceCode')
  @ApiOperation({
    summary: 'Lấy danh sách Quận huyện theo Tỉnh thành',
  })
  districts(@Param('provinceCode') provinceCode: string) {
    return this.regionService.districts(provinceCode);
  }

  @Get('wards/:districtCode')
  @ApiOperation({
    summary: 'Lấy danh sách Phường xã theo Quận huyện',
  })
  wards(@Param('districtCode') districtCode: string) {
    return this.regionService.wards(districtCode);
  }
}
