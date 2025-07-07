import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ClientService } from '../client/client.service';
import { Client } from '../database/entities/client.entity';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let clientService: ClientService;
  let jwtService: JwtService;

  const mockClient: Client = {
    id: 1,
    email: 'test@email.com',
    password: 'hashedPassword',
    name: 'Test User',
  } as Client;

  const mockClientService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ClientService, useValue: mockClientService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    clientService = module.get<ClientService>(ClientService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return client without password if credentials are valid', async () => {
      mockClientService.findByEmail.mockResolvedValue(mockClient);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(
        mockClient.email,
        'plainPassword',
      );
      expect(mockClientService.findByEmail).toHaveBeenCalledWith(
        mockClient.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'plainPassword',
        mockClient.password,
      );
      expect(result).toEqual({
        id: mockClient.id,
        email: mockClient.email,
        name: mockClient.name,
      });
    });

    it('should return null if client not found', async () => {
      mockClientService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('notfound@email.com', 'any');
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      mockClientService.findByEmail.mockResolvedValue(mockClient);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        mockClient.email,
        'wrongPassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access_token', () => {
      const payload = { email: mockClient.email, sub: mockClient.id };
      mockJwtService.sign.mockReturnValue('signed.jwt.token');

      const result = service.login(mockClient);

      expect(mockJwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ access_token: 'signed.jwt.token' });
    });
  });
});
