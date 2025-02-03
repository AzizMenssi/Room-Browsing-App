import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from './rooms/rooms.module';
import { DatabaseModule } from './database/database.module';
import { RoomsSeedModule } from './database/seeds/rooms.seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    DatabaseModule,
    RoomsModule,
    RoomsSeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }