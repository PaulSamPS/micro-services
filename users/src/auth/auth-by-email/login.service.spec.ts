import { Test, TestingModule } from '@nestjs/testing';
import { AuthByEmailService } from './auth-by-email.service';
import { UsersRepository } from '@/users/users.repository';
import { JwtTokenService } from '@/tokens/jwt-token.service';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

describe('Login', () => {
  let authService: AuthByEmailService;
  let usersRepository: UsersRepository;
  let jwtTokenService: JwtTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthByEmailService,
        {
          provide: UsersRepository,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: JwtTokenService,
          useValue: {
            generateJwtToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthByEmailService>(AuthByEmailService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    jwtTokenService = module.get<JwtTokenService>(JwtTokenService);
  });

  it('должен выбросить RpcException, если пользователь не найден', async () => {
    usersRepository.findOneByEmail = jest.fn().mockResolvedValue(null); // Если пользователь не найден

    const dto = { email: 'test@test.com', password: 'password' };

    await expect(authService.login(dto)).rejects.toThrow(RpcException);
    await expect(authService.login(dto)).rejects.toMatchObject({
      message: 'Пользователь c таким email не найден',
    });
  });

  it('должен выбросить RpcException, если пароль неверен', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      password: 'hashedPassword',
      role: 'user',
    };
    usersRepository.findOneByEmail = jest.fn().mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false); // Пароль не совпадает

    const dto = { email: 'test@test.com', password: 'wrongPassword' };

    await expect(authService.login(dto)).rejects.toThrow(RpcException);
    await expect(authService.login(dto)).rejects.toMatchObject({
      message: 'Неверный пароль.',
    });
  });

  it('должен вернуть токены при успешной авторизации', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      password: 'hashedPassword',
      role: 'user',
    };
    const mockTokens = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    usersRepository.findOneByEmail = jest.fn().mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
    jwtTokenService.generateJwtToken = jest.fn().mockResolvedValue(mockTokens);

    const dto = { email: 'test@test.com', password: 'password' };

    const result = await authService.login(dto);

    expect(result).toEqual({ tokens: mockTokens });
    expect(jwtTokenService.generateJwtToken).toHaveBeenCalledWith({
      user: { id: mockUser.id, role: mockUser.role },
    });
  });
});
