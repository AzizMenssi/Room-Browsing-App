import { Controller, Get, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { QueryRoomDto } from './dto/query-room.dto';

@Controller('api/rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) { }

    @Get()
    findAll(@Query() queryDto: QueryRoomDto) {
        return this.roomsService.findAll(queryDto);
    }
}