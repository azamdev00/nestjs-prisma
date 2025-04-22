import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaClient } from 'generated/prisma';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
    private prisma: PrismaClient,
  ) {}

  @Get()
  @HealthCheck()
  async readiness() {
    return await this.health.check([
      async () => await this.db.pingCheck('database', this.prisma),
    ]);
  }
  @Get('/provoke-error')
  async provokeError() {
    throw new Error('Provoked error');
  }
}
