import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    try {
      // Healthcheck endpoint doesnt need any auth
      if (req.path.startsWith('/health')) {
        return next();
      }

      const token = req.headers.authorization;
      if (!token) {
        throw new UnauthorizedException('No token provided');
      } else if (token.startsWith('Bearer ')) {
        let payload = await this.jwtService.verifyAsync(token.split(' ')[1]);

        let user = await this.prisma.user.findUnique({
          where: { id: payload.id },
        });

        req['user'] = user;
        next();
      }
    } catch (error) {
      console.debug(error);
      throw new UnauthorizedException(error.message);
    }
  }
}
