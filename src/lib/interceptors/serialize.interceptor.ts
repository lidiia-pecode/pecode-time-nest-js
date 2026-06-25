import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  applyDecorators,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ApiResponse } from '@nestjs/swagger';

export function Serialize<T>(
  dto: ClassConstructor<T>,
  options?: { status: number },
) {
  return applyDecorators(
    ApiResponse({
      status: options?.status ?? 200,
      type: dto,
    }),
    UseInterceptors(new SerializeInterceptor(dto)),
  );
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(_: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      map((data: T) => {
        return plainToInstance<T, T>(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
