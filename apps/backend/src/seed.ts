import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RoomsSeedService } from './database/seeds/rooms.seed.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const seeder = app.get(RoomsSeedService);
    await seeder.seed();
    await app.close();
}
bootstrap();