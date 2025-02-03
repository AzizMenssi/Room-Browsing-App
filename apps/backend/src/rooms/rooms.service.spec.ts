import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { QueryRoomDto } from './dto/query-room.dto';

describe('RoomsController', () => {
    let controller: RoomsController;
    let service: RoomsService;

    const mockRoomsService = {
        findAll: jest.fn((query: QueryRoomDto) => {
            const rooms = [
                { name: 'Room 1', price: 100, type: 'Deluxe' },
                { name: 'Room 2', price: 200, type: 'Standard' },
            ];

            let filteredRooms = [...rooms];

            if (query.type) {
                filteredRooms = filteredRooms.filter(room => room.type === query.type);
            }

            if (query.minPrice && query.maxPrice) {
                filteredRooms = filteredRooms.filter(room => room.price >= query.minPrice && room.price <= query.maxPrice);
            }

            if (query.search) {
                filteredRooms = filteredRooms.filter(room => room.name.toLowerCase().includes(query.search.toLowerCase()));
            }

            return {
                data: filteredRooms,
                total: filteredRooms.length,
                page: query.page || 1,
                totalPages: Math.ceil(filteredRooms.length / (query.limit || 10)),
            };
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RoomsController],
            providers: [
                { provide: RoomsService, useValue: mockRoomsService },
            ],
        }).compile();

        controller = module.get<RoomsController>(RoomsController);
        service = module.get<RoomsService>(RoomsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return a paginated list of rooms', async () => {
        const query: QueryRoomDto = { page: 1, limit: 2 };
        const result = await controller.findAll(query);

        expect(service.findAll).toHaveBeenCalledWith(query);
        expect(result).toEqual({
            data: [
                { name: 'Room 1', price: 100, type: 'Deluxe' },
                { name: 'Room 2', price: 200, type: 'Standard' },
            ],
            total: 2,
            page: 1,
            totalPages: 1,
        });
    });

    it('should filter rooms by type', async () => {
        const query: QueryRoomDto = { page: 1, limit: 2, type: 'Deluxe' };
        const result = await controller.findAll(query);

        expect(service.findAll).toHaveBeenCalledWith(query);
        expect(result).toEqual({
            data: [
                { name: 'Room 1', price: 100, type: 'Deluxe' },
            ],
            total: 1,
            page: 1,
            totalPages: 1,
        });
    });

    it('should filter rooms by price range', async () => {
        const query: QueryRoomDto = { page: 1, limit: 2, minPrice: 100, maxPrice: 150 };
        const result = await controller.findAll(query);

        expect(service.findAll).toHaveBeenCalledWith(query);
        expect(result).toEqual({
            data: [
                { name: 'Room 1', price: 100, type: 'Deluxe' },
            ],
            total: 1,
            page: 1,
            totalPages: 1,
        });
    });

    it('should search rooms by name or description', async () => {
        const query: QueryRoomDto = { page: 1, limit: 2, search: 'Room 1' };
        const result = await controller.findAll(query);

        expect(service.findAll).toHaveBeenCalledWith(query);
        expect(result).toEqual({
            data: [
                { name: 'Room 1', price: 100, type: 'Deluxe' },
            ],
            total: 1,
            page: 1,
            totalPages: 1,
        });
    });
});
