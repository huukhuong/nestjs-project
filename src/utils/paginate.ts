import { FindManyOptions, Repository } from 'typeorm';
import BaseResponse from './base-response';
import BaseException from './base-exception';

interface PaginationProps<T> {
  pageIndex: number;
  pageSize: number;
  repository: Repository<T>;
  where?: FindManyOptions<T>['where'];
  withDeleted?: boolean;
}

const paginate = async <T>(props: PaginationProps<T>) => {
  const { pageIndex, pageSize, repository, where, withDeleted } = props;

  if (pageIndex <= 0 || pageSize <= 0) {
    throw new BaseException('pageSize and pageIndex cannot be less than 1', 500);
  }

  const options: FindManyOptions<T> = {
    skip: (pageIndex - 1) * pageSize,
    take: pageSize,
    where,
    withDeleted,
  };

  const [data, total] = await repository.findAndCount(options);

  return new BaseResponse({
    statusCode: 200,
    isSuccess: true,
    data: data,
    message: 'Lấy danh sách thành công',
    pagination: {
      currentPage: pageIndex,
      recordsPerPage: pageSize,
      totalPages: Math.ceil(total / pageSize),
      totalCount: total,
    },
  });
};

export default paginate;
