import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { UsersDbService } from "./usersDb.service";
import { CloudinaryConfig } from "../config/cloudinary";
import { CloudinaryService } from "./cloudinary.service";
import { AuthService } from "./auth.service";
import { requiresAuth } from "express-openid-connect";

// const mockUserService = {
//     getUsers: () => "Esto es un servicio mock de usuarios"
// }

@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    providers: [
    //     {
    //     provide: UsersService,
    //     useValue: mockUserService,
    // }, 
    CloudinaryConfig,
    CloudinaryService,
    UsersService,
    UsersDbService,
    UsersRepository,
    AuthService,
    {
        provide: "API_USERS",
        useFactory: async () => {
            const apiUsers = await fetch("https://jsonplaceholder.typicode.com/users/").then(res => res.json());
            return apiUsers.map(user => {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email
                };
            })
        }
    }
],
    controllers: [UsersController]
})
export class UsersModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(requiresAuth()).forRoutes('users/auth0/protected')
    }
};

