import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatalogType } from 'src/catalog-type/catalog-type.entity';
import BaseException from 'src/utils/base-exception';
import BaseResponse from 'src/utils/base-response';
import { ILike, Repository } from 'typeorm';
import { Catalog } from './catalog.entity';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { SearchKeywordDto } from 'src/utils/search-keyword.dto';
import paginate from 'src/utils/paginate';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Catalog)
    private readonly catalogRepository: Repository<Catalog>,
    @InjectRepository(CatalogType)
    private readonly catalogTypeRepository: Repository<CatalogType>,
  ) {}

  async search(params: SearchKeywordDto) {
    try {
      if (!params.keyword) {
        params.keyword = '';
      }

      return await paginate({
        pageSize: params.pageSize,
        pageIndex: params.pageIndex,
        repository: this.catalogRepository,
        withDeleted: params.withDeleted,
        where: [
          { code: ILike(`%${params.keyword}%`) },
          { name: ILike(`%${params.keyword}%`) },
        ],
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(params: CreateCatalogDto) {
    const isDuplicated = await this.catalogRepository.findOneBy({
      code: params.code,
    });

    if (isDuplicated) {
      throw new BaseException('Catalog đã tồn tại', HttpStatus.BAD_REQUEST);
    }

    const catalogType = await this.catalogTypeRepository.findOneBy({
      code: params.catalogTypeCode,
    });

    if (!catalogType) {
      throw new BaseException(
        'Không tìm thấy loại danh mục',
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const catalog = this.catalogRepository.create(params);
      catalog.catalogType = catalogType;

      const result = await this.catalogRepository.save(catalog);

      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: result,
        message: 'Tạo catalog thành công!',
      });
    } catch (error) {
      throw new BaseException(
        'Đã có lỗi xảy ra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(catalogId: string, params: CreateCatalogDto) {
    try {
      const catalogFound = await this.catalogRepository.findOneBy({
        id: catalogId,
      });

      if (!catalogFound) {
        throw new BaseException('Không tìm thấy catalog', HttpStatus.NOT_FOUND);
      }

      catalogFound.code = params.code;
      catalogFound.name = params.name;
      if (params.catalogTypeCode) {
        const catalogTypeFound = await this.catalogTypeRepository.findOneBy({
          code: params.catalogTypeCode,
        });
        if (!catalogTypeFound) {
          throw new BaseException(
            'Loại catalog không tồn tại',
            HttpStatus.NOT_FOUND,
          );
        }
        catalogFound.catalogType = catalogTypeFound;
      }

      const result = await this.catalogRepository.save(catalogFound);

      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: result,
        message: 'Cập nhật catalog thành công!',
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(catalogId: string) {
    const catalogType = await this.catalogRepository.findOneBy({
      id: catalogId,
    });

    if (!catalogType) {
      throw new BaseException('Không tìm thấy danh mục', HttpStatus.NOT_FOUND);
    }

    try {
      const result = await this.catalogRepository.softDelete({
        id: catalogId,
      });
      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: result,
        message: 'Xoá danh mục thành công!',
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
