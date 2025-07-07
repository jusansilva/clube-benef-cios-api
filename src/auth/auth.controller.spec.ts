import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access_token if credentials are valid', async () => {
      const loginDto: LoginDto = {
        email: 'test@email.com',
        password: '123456',
      };
      const user = { id: 1, email: loginDto.email };
      const token = { access_token: 'jwt.token.aqui' };

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(token);

      const result = await controller.login(loginDto);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(token);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'wrong@email.com',
        password: 'wrong',
      };
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });
  });
});
