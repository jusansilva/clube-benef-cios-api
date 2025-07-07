import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from '../database/entities/client.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ConflictException, NotFoundException } from '@nestjs/common';

jest.mock('bcryptjs');

describe('ClientService', () => {
  let service: ClientService;
  let repo: Repository<Client>;

  const mockClient: Client = {
    id: 1,
    name: 'Test User',
    email: 'test@email.com',
    password: 'hashedPassword',
  } as Client;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        { provide: getRepositoryToken(Client), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    repo = module.get<Repository<Client>>(getRepositoryToken(Client));
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new client', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockRepository.create.mockReturnValue({ ...mockClient });
      mockRepository.save.mockResolvedValue({ ...mockClient });

      const dto = {
        name: 'Test User',
        email: 'test@email.com',
        password: '123456',
      };
      const result = await service.create(dto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: mockClient.id,
        name: mockClient.name,
        email: mockClient.email,
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockClient);

      const dto = {
        name: 'Test User',
        email: 'test@email.com',
        password: '123456',
      };
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all clients without password', async () => {
      mockRepository.find.mockResolvedValue([mockClient]);
      const result = await service.findAll();
      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([
        { id: mockClient.id, name: mockClient.name, email: mockClient.email },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a client without password', async () => {
      mockRepository.findOne.mockResolvedValue(mockClient);
      const result = await service.findOne(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({
        id: mockClient.id,
        name: mockClient.name,
        email: mockClient.email,
      });
    });

    it('should throw NotFoundException if client not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a client by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockClient);
      const result = await service.findByEmail('test@email.com');
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@email.com' },
      });
      expect(result).toEqual(mockClient);
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      mockRepository.preload.mockResolvedValue(mockClient);
      mockRepository.save.mockResolvedValue(mockClient);

      const dto = { name: 'Updated' };
      const result = await service.update(1, dto);

      expect(mockRepository.preload).toHaveBeenCalledWith({ id: 1, ...dto });
      expect(mockRepository.save).toHaveBeenCalledWith(mockClient);
      expect(result).toEqual({
        id: mockClient.id,
        name: mockClient.name,
        email: mockClient.email,
      });
    });

    it('should throw NotFoundException if client not found', async () => {
      mockRepository.preload.mockResolvedValue(null);
      await expect(service.update(2, { name: 'Updated' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a client', async () => {
      mockRepository.findOne.mockResolvedValue(mockClient);
      mockRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockClient);
    });

    it('should throw NotFoundException if client not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(2)).rejects.toThrow(NotFoundException);
    });
  });
});
