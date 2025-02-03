import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './schemas/room.schema';
import { QueryRoomDto } from './dto/query-room.dto';

@Injectable()
export class RoomsService {
    constructor(@InjectModel(Room.name) private readonly roomModel: Model<Room>) { }


    async findAll(queryDto: QueryRoomDto) {
        const { page = 1, limit = 5, type, minPrice, maxPrice, search } = queryDto;
        const query = this.roomModel.find();

        if (type) {
            query.where('type').equals(new RegExp(type, 'i'));
        }

        if (minPrice) {
            query.where('price').gte(minPrice);
        }

        if (maxPrice) {
            query.where('price').lte(maxPrice);
        }

        if (search) {
            query.or([
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
            ]);
        }

        const total = await this.roomModel.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        const data = await query
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        return {
            data,
            total,
            page,
            totalPages,
        };
    }
}