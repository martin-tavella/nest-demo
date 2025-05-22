import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Headers,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { DateAdderInterceptor } from '../interceptors/date-adder.interceptor';
import { UsersDbService } from './usersDb.service';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinSizeValidatorPipe } from '../pipes/min-size-validator.pipe';
import { AuthService } from './auth.service';
import { Roles } from '../decorators/roles.decorators';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '../roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService,
    private readonly usersDbService: UsersDbService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly authService: AuthService
  ) {}

  @Get()
  getUsers(@Query('name') name?: string) {
    return this.usersDbService.getUsers();
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getUserProfile(@Req() request: Request & { user: any}) {

     console.log(request.user);
     return 'Este endpoint retorna el perfil del usuario';
  }

  @Post('profile/images')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(MinSizeValidatorPipe)
  getUserImages(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({
          maxSize: 100000,
          message: 'El archivo debe ser menor a 100kb'
        }),
        new FileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
      ]
    })
  ) file: Express.Multer.File) {
    return this.cloudinaryService.uploadImage(file);
  }

  @HttpCode(418)
  @Get('coffee')
  getCoffe() {
    return 'No se hacer cafe LOL';
  }

  @Get('message')
  getMessage(@Res() response: Response) {
    response.status(200).send('Este es un mensaje');
  }

  @Get('request')
  getRequest(@Req() request: Request) {
    console.log(request);
    return 'Esta ruta retorna el req';
  }

  @Get('admin')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard) 
  getAdmin() {
    return 'Ruta protegida'
  }

  @Get('auth0/protected')
  getAuth0Protected(@Req() req: Request) {
    console.log(req.oidc.idToken)
    return JSON.stringify(req.oidc.user)
  }

  @Post('signup')
  @UseInterceptors(DateAdderInterceptor)
  createUser(
    @Body() user,
    @Req() request: Request & { now: string },
  ) {
    console.log(request.now);
    return this.authService.signUp({...user, createdAt: request.now})
  }

  @Post('signin')
  logIn(@Body() credentials) {
    return this.authService.signIn(credentials)
  }

  @Put()
  updateUser() {
    return 'Este endpoint modifica un usuario';
  }

  @Delete()
  deleteUser() {
    return 'Este endpoint elimina un usuario';
  }



  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }


}
