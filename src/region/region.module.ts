import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministrativeRegion } from './entities/administrative-region.entity';
import { AdministrativeUnit } from './entities/administrative-unit.entity';
import { District } from './entities/district.entity';
import { Province } from './entities/province.entity';
import { Ward } from './entities/ward.entity';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdministrativeRegion,
      AdministrativeUnit,
      Province,
      District,
      Ward,
    ]),
  ],
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule {}
