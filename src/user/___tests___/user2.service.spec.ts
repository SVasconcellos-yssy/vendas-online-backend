import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from '../user.service';
import { createUserMock } from '../___mock___/CreateUser.mock';
import { userEntityMock } from '../___mock___/user.mock';
import { UserType } from '../enum/userType.enum';
import { UserEntity } from '../interfaces/user.entity';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userEntityMock),
            save: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should return user in findUserByEmail', async () => {
    const user = await service.getUserByEmail(userEntityMock.email);

    expect(user).toEqual(userEntityMock);
  });

  it('should return error in findUserByEmail', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.getUserByEmail(userEntityMock.email)).rejects.toThrowError();
  });

  it('should return error in findUserByEmail (error DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

    expect(service.getUserByEmail(userEntityMock.email)).rejects.toThrowError();
  });

  it('should return user in findUserById', async () => {
    const user = await service.getUserById(userEntityMock.id);

    expect(user).toEqual(userEntityMock);
  });

  it('should return error in findUserById', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.getUserByEmail(userEntityMock.email)).rejects.toThrowError();
  });

  it('should return error in findUserById (error DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

    expect(service.getUserById(userEntityMock.id)).rejects.toThrowError();
  });

  it('should return user in getUserByIdUsingRelations', async () => {
    const user = await service.getUserByIdUsingRelations(userEntityMock.id);

    expect(user).toEqual(userEntityMock);
  });

  it('should return error if user exist', async () => {
    expect(service.createUser(createUserMock)).rejects.toThrowError();
  });

  it('should return user if user not exist', async () => {
    const spy = jest.spyOn(userRepository, 'save');
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    const user = await service.createUser(createUserMock);

    expect(user).toEqual(userEntityMock);
    expect(spy.mock.calls[0][0].type_user).toEqual(UserType.User);
  });

  // it('should return user if user not exist and user Admin', async () => {
  //   const spy = jest.spyOn(userRepository, 'save');
  //   jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

  //   await service.createUser(createUserMock, UserType.Admin);

  //   expect(spy.mock.calls[0][0].typeUser).toEqual(UserType.Admin);
  // });

  // it('should return user in update password', async () => {
  //   const user = await service.updatePasswordUser(
  //     updatePasswordMock,
  //     userEntityMock.id,
  //   );

  //   expect(user).toEqual(userEntityMock);
  // });

  // it('should return invalid password in error', async () => {
  //   expect(
  //     service.updatePasswordUser(updatePasswordInvalidMock, userEntityMock.id),
  //   ).rejects.toThrowError();
  // });

  // it('should return error in user not exist', async () => {
  //   jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

  //   expect(
  //     service.updatePasswordUser(updatePasswordMock, userEntityMock.id),
  //   ).rejects.toThrowError();
  // });
});
