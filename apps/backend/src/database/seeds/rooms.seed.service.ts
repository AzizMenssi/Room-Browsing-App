import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from '../../rooms/schemas/room.schema';
import * as roomsData from './rooms.json';
@Injectable()
export class RoomsSeedService {
    constructor(
        @InjectModel(Room.name) private readonly roomModel: Model<Room>
    ) { }
    private roomTypes = [
        'Single', 'Double', 'Suite', 'Deluxe', 'Presidential', 'Studio', 'Penthouse', 'Family Room', 'King', 'Queen'
    ];
    private bedTypes = ['King', 'Queen', 'Twin', 'Double', 'Single'];
    private minPrice = 50;
    private maxPrice = 500;
    private randomPrice() {
        return Math.floor(Math.random() * (this.maxPrice - this.minPrice + 1)) + this.minPrice;
    }
    private randomRoomType() {
        return this.roomTypes[Math.floor(Math.random() * this.roomTypes.length)];
    }
    private randomBedType() {
        return this.bedTypes[Math.floor(Math.random() * this.bedTypes.length)];
    }
    private randomBoolean() {
        return Math.random() < 0.5;
    }
    async seed() {
        await this.roomModel.deleteMany({});
        const baseRoom = roomsData;
        const roomsToInsert = Array.from({ length: 50 }, (_, i) => ({
            ...baseRoom,
            name: `${baseRoom.name} ${i + 1}`,
            price: this.randomPrice(),
            type: this.randomRoomType(),
            availability: this.randomBoolean(),
            features: {
                bedType: this.randomBedType(),
                maxOccupancy: Math.floor(Math.random() * 4) + 1,
                wifi: this.randomBoolean(),
                airConditioning: this.randomBoolean(),
                tv: this.randomBoolean(),
                minibar: this.randomBoolean(),
            }
        }));
        await this.roomModel.insertMany(roomsToInsert);
        console.log('Database seeded with 50 randomized rooms!');
    }
}
