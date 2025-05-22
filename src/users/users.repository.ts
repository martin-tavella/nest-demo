import { Injectable } from "@nestjs/common";
import { User } from "./user.type";

@Injectable()
export class UsersRepository {
    private users: User[] = [
        {
          id: 1,
          name: 'Bartolomaiu',
          email: 'barto@gmail.com',
        },
        {
          id: 2,
          name: 'Alexandra',
          email: 'alex@gmail.com',
        },
        {
          id: 3,
          name: 'Fernando',
          email: 'fer@gmail.com',
        },
        {
          id: 4,
          name: 'Carolina',
          email: 'caro@gmail.com',
        },
        {
          id: 5,
          name: 'Miguel',
          email: 'miguel@gmail.com',
        },
        {
          id: 6,
          name: 'Lucia',
          email: 'lucia@gmail.com',
        },
        {
          id: 7,
          name: 'Roberto',
          email: 'rob@gmail.com',
        },
        {
          id: 8,
          name: 'Valentina',
          email: 'val@gmail.com',
        },
        {
          id: 9,
          name: 'Eduardo',
          email: 'edu@gmail.com',
        },
        {
          id: 10,
          name: 'Isabella',
          email: 'isa@gmail.com',
        }
      ]

      async getUsers() {
        return this.users;
      }

      async getUserById(id: number) {
        return this.users.find((user) => user.id === id);
      }

      async getUsersByName(name: string) {
        return this.users.filter(user => user.name === name);
      }

      async createUser(user: Omit<User, "id">): Promise<User> {
        const id = this.users.length + 1
        this.users.push({id, ...user})
        return {id, ...user};
      }
};