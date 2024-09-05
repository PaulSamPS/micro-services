import { RegisterDto } from '@/auth/auth-by-email/dto/register.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '@/users/users.repository';
import { AuthByEmailService } from '@/auth/auth-by-email/auth-by-email.service';
import { UsersEntity } from '@/users/users.entity';
import { UserRole } from '@/users/users.interface';
import { genSalt, hash } from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { JwtTokenService } from '@/tokens/jwt-token.service';

jest.mock('bcrypt');

describe('Register', () => {
  let registerService: AuthByEmailService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthByEmailService,
        {
          provide: UsersRepository,
          useValue: {
            findOneByEmail: jest.fn(),
            createUser: jest.fn(),
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

    registerService = module.get<AuthByEmailService>(AuthByEmailService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('должен выбросить RpcException, если пользователь уже существует', async () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    usersRepository.findOneByEmail = jest.fn().mockResolvedValue({
      email: 'test@example.com',
    });

    await expect(registerService.register(registerDto)).rejects.toThrow(
      new RpcException({
        message: 'Пользователь с таким email уже существует',
      }),
    );

    expect(usersRepository.findOneByEmail).toHaveBeenCalledWith(
      registerDto.email,
    );
  });

  it('должен зарегистрировать нового пользователя, если email не существует', async () => {
    const registerDto: RegisterDto = {
      email: 'newuser@example.com',
      password: 'password123',
    };
    const salt = 'randomSalt';
    const hashedPassword = 'hashedPassword123';

    usersRepository.findOneByEmail = jest.fn().mockResolvedValue(null);
    (genSalt as jest.Mock).mockResolvedValue(salt);
    (hash as jest.Mock).mockResolvedValue(hashedPassword);

    const newUserEntity = new UsersEntity({
      email: registerDto.email,
      password: hashedPassword,
      role: UserRole.User,
    });

    usersRepository.createUser = jest
      .fn()
      .mockResolvedValue(newUserEntity)
      .mockReturnValue({ message: 'Регистрация прошла успешно.' });

    const result = await registerService.register(registerDto);

    expect(usersRepository.findOneByEmail).toHaveBeenCalledWith(
      registerDto.email,
    );
    expect(genSalt).toHaveBeenCalledWith(10);
    expect(hash).toHaveBeenCalledWith(registerDto.password, salt);
    expect(usersRepository.createUser).toHaveBeenCalledWith(newUserEntity);

    expect(result).toEqual({ message: 'Регистрация прошла успешно.' });
  });
});
