import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // The back-office page is a browser destination, not an API resource, so it
  // keeps a clean /admin URL. Its data routes stay under the prefix.
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'admin', method: RequestMethod.GET }],
  });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
