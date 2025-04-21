import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  Logger,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { InternalDisabledLogger } from './shared/utils/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new InternalDisabledLogger(),
    // cors: true,
  });

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Set global prefix
  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: 'health/provoke-error', method: RequestMethod.GET },
      { path: 'docs', method: RequestMethod.GET },
    ],
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Beneficiary Management')
    .setDescription('Beneficiary Management API')
    .setVersion('1.0')
    .addBearerAuth()
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // nest-pino Logger
  app.useLogger(app.get(Logger));

  // class-validator+class-transformer interceptor
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: false, // Ensure error messages are not disabled
      whitelist: true, // Automatically strip non-whitelisted properties
      forbidNonWhitelisted: true,
    }),
  );

  // Exception filter to catch all http exceptions and return a json response
  // app.useGlobalFilters(new HttpExceptionFilter());

  // Explicitly enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(8000);
}
bootstrap();
