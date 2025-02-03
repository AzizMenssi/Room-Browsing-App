import { Module } from '@nestjs/common';
import { RoomsSeedService } from './rooms.seed.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from '../../rooms/schemas/room.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    ],
    providers: [RoomsSeedService],
    exports: [RoomsSeedService],
})
export class RoomsSeedModule { }