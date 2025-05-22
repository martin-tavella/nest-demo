import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersDbService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>
    ) {}

    async getUsers() {
        return await this.usersRepository.find()
    }

    async saveUser(user: Omit<User, 'id'>) {
        await this.usersRepository.save(user);
    }

    async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({where: { email }});
  }
}