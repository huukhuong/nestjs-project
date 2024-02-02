import { Module } from '@nestjs/common';
import { CatalogTypeController } from './catalog-type.controller';
import { CatalogTypeService } from './catalog-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogType } from './catalog-type.entity';
import { Catalog } from 'src/catalog/catalog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogType, Catalog])],
  controllers: [CatalogTypeController],
  providers: [CatalogTypeService],
})
export class CatalogTypeModule {}
