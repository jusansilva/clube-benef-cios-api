import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from '../database/entities/client.entity';

describe('ClientController', () => {
  let controller: ClientController;
  let service: ClientService;

  const mockClient: Omit<Client, 'password'> = {
    id: 1,
    name: 'Test User',
    email: 'test@email.com',
  } as Client;

  const mockClientService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [{ provide: ClientService, useValue: mockClientService }],
    }).compile();

    controller = module.get<ClientController>(ClientController);
    service = module.get<ClientService>(ClientService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a client', async () => {
      const dto: CreateClientDto = {
        name: 'Test User',
        email: 'test@email.com',
        password: '123456',
      };
      mockClientService.create.mockResolvedValue(mockClient);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockClient);
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      mockClientService.findAll.mockResolvedValue([mockClient]);
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockClient]);
    });
  });

  describe('findOne', () => {
    it('should return a client by id', async () => {
      mockClientService.findOne.mockResolvedValue(mockClient);
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockClient);
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const dto: UpdateClientDto = { name: 'Updated' };
      mockClientService.update.mockResolvedValue({ ...mockClient, ...dto });
      const result = await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ ...mockClient, ...dto });
    });
  });

  describe('remove', () => {
    it('should remove a client', async () => {
      mockClientService.remove.mockResolvedValue(undefined);
      const result = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
