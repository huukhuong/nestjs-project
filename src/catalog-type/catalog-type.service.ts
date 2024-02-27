import { HttpStatus, Injectable } from '@nestjs/common';
import { CatalogType } from './catalog-type.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCatalogTypeDto } from './dto/create-catalog-type.dto';
import BaseException from 'src/utils/base-exception';
import BaseResponse from 'src/utils/base-response';
import { SearchKeywordDto } from 'src/utils/search-keyword.dto';
import paginate from 'src/utils/paginate';

@Injectable()
export class CatalogTypeService {
  constructor(
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
        repository: this.catalogTypeRepository,
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

  async create(params: CreateCatalogTypeDto) {
    const isDuplicated = await this.catalogTypeRepository.findOneBy({
      code: params.code,
    });

    if (isDuplicated) {
      throw new BaseException(
        'Loại danh mục đã tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const catalog = this.catalogTypeRepository.create(params);

      const result = await this.catalogTypeRepository.save(catalog);

      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: result,
        message: 'Tạo loại danh mục thành công!',
      });
    } catch (error) {
      throw new BaseException(
        'Đã có lỗi xảy ra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(catalogTypeId: string, params: CreateCatalogTypeDto) {
    try {
      const catalogFound = await this.catalogTypeRepository.findOne({
        where: { id: catalogTypeId },
      });

      if (!catalogFound) {
        throw new BaseException(
          'Không tìm thấy loại danh mục',
          HttpStatus.NOT_FOUND,
        );
      }

      catalogFound.name = params.name;
      const result = await this.catalogTypeRepository.save(catalogFound);

      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: result,
        message: 'Cập nhật loại danh mục thành công!',
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(catalogTypeId: string) {
    const catalogType = await this.catalogTypeRepository.findOneBy({
      id: catalogTypeId,
    });

    if (!catalogType) {
      throw new BaseException(
        'Không tìm thấy loại danh mục',
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const result = await this.catalogTypeRepository.softDelete({
        id: catalogTypeId,
      });
      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: result,
        message: 'Xoá loại danh mục thành công!',
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
