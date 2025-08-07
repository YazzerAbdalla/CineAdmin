import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getName(Name: string): string {
    return `Hello ${Name}`;
  }
}
