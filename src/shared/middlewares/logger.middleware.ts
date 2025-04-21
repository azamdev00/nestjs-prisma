import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, statusCode } = req;
    // Possibly include other relevant data such as headers or body, but be selective
    const message = `HTTP Request - Method: ${method}, URL: ${url} ${statusCode}`;

    this.logger.log(message); // Simplified log without complex objects

    next();
  }
}
