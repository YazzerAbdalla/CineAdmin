import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export function rethrowIfKnown(error: unknown) {
  if (
    error instanceof NotFoundException ||
    error instanceof BadRequestException ||
    error instanceof UnauthorizedException
  )
    throw error;
  throw new InternalServerErrorException('Unexpected error');
}
