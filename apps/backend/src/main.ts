import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_PORT', 3001);
  await app.listen(port, '0.0.0.0');
}
bootstrap();