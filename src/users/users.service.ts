import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './user.type';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    @Inject('API_USERS') private apiUsers: User[],
  ) {}
  async getUsers() {
    const dbUsers = await this.usersRepository.getUsers();
    const users = [...dbUsers, ...this.apiUsers];
    return users;
  }

  async getUserById(id: number) {
    return await this.usersRepository.getUserById(id);
  }

  async getUsersByName(name: string) {
    return await this.usersRepository.getUsersByName(name)
  }

  async createUser(user: Omit<User, "id">): Promise<User> {
    return await this.usersRepository.createUser(user)
  }
}
