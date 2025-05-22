import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { UsersDbService } from "./usersDb.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
// import { Role } from "/src/roles.enum";

@Injectable()
export class AuthService {
    constructor(private readonly usersDbService: UsersDbService,
        private readonly jwtService: JwtService
    ) {};

    async signUp( user: User) {
        const dbUser = await this.usersDbService.getUserByEmail(user.email);
        if(dbUser) {
            throw new BadRequestException("Email already exists in DB");
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        if(!hashedPassword) {
            throw new BadRequestException('password could not be hashed')
        }
        this.usersDbService.saveUser({...user, password: hashedPassword})
        return {success: 'User created succesfully'}
    };

    async signIn({email, password}) {
        const dbUser = await this.usersDbService.getUserByEmail(email);
        if(!dbUser) throw new BadRequestException("User not found");

        const isPasswordValid = await bcrypt.compare(password, dbUser.password)

        if(!isPasswordValid) throw new BadRequestException('Email or password are incorrect');

        const userPayload = {
            sub: dbUser.id,
            id: dbUser.id,
            email: dbUser.email,
            // roles: [ dbUser.isAdmin ? Role.Admin : Role.User]
        }

        const token = this.jwtService.sign(userPayload)

        return {success: "User logged in succesfully", token}
    };

    
};