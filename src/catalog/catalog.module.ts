import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalog } from './catalog.entity';
import { CatalogType } from 'src/catalog-type/catalog-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Catalog, CatalogType])],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
