import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseException from 'src/utils/base-exception';
import BaseResponse from 'src/utils/base-response';
import { Repository } from 'typeorm';
import { AdministrativeRegion } from './entities/administrative-region.entity';
import { District } from './entities/district.entity';
import { Province } from './entities/province.entity';
import { Ward } from './entities/ward.entity';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(AdministrativeRegion)
    private readonly administrativeRegionRepository: Repository<AdministrativeRegion>,
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
    @InjectRepository(Ward)
    private readonly wardRepository: Repository<Ward>,
  ) {}

  async regions() {
    return new BaseResponse({
      statusCode: 200,
      isSuccess: true,
      data: await this.administrativeRegionRepository.find(),
    });
  }

  async provinces(regionId: number) {
    if (regionId) {
      const region = await this.administrativeRegionRepository.findOneBy({
        id: regionId,
      });

      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: await this.provinceRepository.findBy({
          administrativeRegion: region,
        }),
      });
    } else {
      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: await this.provinceRepository.find(),
      });
    }
  }

  async districts(provinceCode: string) {
    const province = await this.provinceRepository.findOneBy({
      code: provinceCode,
    });

    if (!province) {
      throw new BaseException(
        'Không tìm thấy Tỉnh thành',
        HttpStatus.BAD_REQUEST,
      );
    }

    return new BaseResponse({
      statusCode: 200,
      isSuccess: true,
      data: await this.districtRepository.findBy({
        province: province,
      }),
    });
  }

  async wards(districtCode: string) {
    const district = await this.districtRepository.findOneBy({
      code: districtCode,
    });

    if (!district) {
      throw new BaseException(
        'Không tìm thấy Quận huyện',
        HttpStatus.BAD_REQUEST,
      );
    }

    return new BaseResponse({
      statusCode: 200,
      isSuccess: true,
      data: await this.wardRepository.findBy({
        district: district,
      }),
    });
  }
}
