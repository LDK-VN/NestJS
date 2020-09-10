import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value)
    const val = parseInt(value, 10);
    if(isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
