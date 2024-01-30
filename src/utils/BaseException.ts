import { HttpException, HttpStatus } from '@nestjs/common';

export default class BaseException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(
      {
        statusCode,
        isSuccess: false,
        data: null,
        message,
      },
      statusCode,
    );
  }
}
