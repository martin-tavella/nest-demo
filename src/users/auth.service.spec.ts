import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersDbService } from './usersDb.service';
import { User } from './users.entity';
import * as bcript from 'bcrypt'
import * as jwt from 'jsonwebtoken'

describe('authService', () => {
  let authService: AuthService;

  const mockUser: Omit<User, 'id'> = {
    name: 'Martin',
    createdAt: '01/01/2025',
    password: '123456',
    email: 'fabrizio@gmail.com',
    isAdmin: false
  }

  let mockUsersService: Partial<UsersDbService>;

  const mockJwtService = {
      sign: (payload) => jwt.sign(payload, 'testSecret')
  }

  beforeEach(async () => {
     mockUsersService = {
      getUserByEmail: (email: string) => Promise.resolve(null),
      saveUser: (user) => Promise.resolve(), // Return nothing
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {provide: JwtService, useValue: mockJwtService},
        { provide: UsersDbService, useValue: mockUsersService },
      ],
    }).compile();


    authService = module.get<AuthService>(AuthService);
    
  });

//   it('Create an instance of AuthService', async () => {
//     expect(authService).toBeDefined();
//   });

//   it('signUp creates a new user with an encripted password', async () => {
//     const user = await authService.signUp({ ...mockUser, id: 'test-id' });
//     expect(user).toBeDefined();
//     expect(user.password).not.toEqual(mockUser.password)
//   })

//   it('signup throws an error if the email is already in use', async () => {
//     mockUsersService.getUserByEmail = (email: string) => Promise.resolve(mockUser as User)
//     try {
//         await authService.signUp(mockUser as User)
//     } catch (error) {
//         expect(error.message).toEqual('Email already exist')
//     }
//   })


it('signIn returns an error if the password is invalid', async() => {
    mockUsersService.getUserByEmail = (email: string) => Promise.resolve(mockUser as User)
    try {
        await authService.signIn({email: mockUser.email, password: 'aefiehgoaesfg'})
    } catch (error) {
        expect(error.message).toEqual('Email or password are incorrect');
    }
})

it('signIn() returns an object with a message and a token if the user is foand an d the password is valid', async () => {
 const mockUserVariant = {
    ...mockUser,
    password: await bcript.hash(mockUser.password, 10)
 }
 mockUsersService.getUserByEmail = (email: string) => Promise.resolve(mockUserVariant as User)

 const response = await authService.signIn({email: mockUser.email, password: mockUser.password})

 expect(response).toBeDefined();
 expect(response.token).toBeDefined();
 expect(response.success).toEqual('User logged in succesfully')
})
});
