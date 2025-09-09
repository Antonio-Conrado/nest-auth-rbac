import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthExceptionFilter } from './common/exceptions/auth-exception-filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.useGlobalFilters(new AuthExceptionFilter());

  //enables global validation for incoming data
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties not in DTO
      forbidNonWhitelisted: false, // throw error if non-whitelisted properties are present
      transform: true, // automatically transform payloads to DTO instances
    }),
  );

  //cors
  app.enableCors({
    origin: process.env.ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });

  // Enable API versioning
  // Use @Version('1'), @Version('2'), etc. in controllers and endpoints
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Enable graceful shutdown
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Nest Auth RBAC')
    .setDescription('Nest Auth RBAC')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      // Delete the "Controller" suffix from the controller name
      return `${controllerKey.replace('Controller', '')}_${methodKey}`;
    },
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
