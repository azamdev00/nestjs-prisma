import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule, I18nOptions } from 'nestjs-i18n';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './shared/middlewares/auth.middleware';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { PrismaService } from './prisma.service';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from './logger/logger.module';
import { PrismaClient } from 'prisma/generated/prisma';

export const i18nConfig: I18nOptions = {
  fallbackLanguage: 'en',
  loaderOptions: {
    path: path.join(__dirname, '/i18n/'),
    watch: true,
  },
  resolvers: [AcceptLanguageResolver],
};

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
};

export const jwtConfig = {
  global: true,
  secret: process.env.JWT_SECRET,
  // signOptions: { expiresIn: '' },
};

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    I18nModule.forRoot(i18nConfig),
    JwtModule.register(jwtConfig),
    TerminusModule,
    LoggerModule,
  ],

  controllers: [AppController, HealthController],
  providers: [AppService, PrismaClient, PrismaService, AuthMiddleware],
})
export class AppModule implements NestModule {
  constructor() {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/auth/signup', method: RequestMethod.POST },
        { path: '/', method: RequestMethod.GET },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
