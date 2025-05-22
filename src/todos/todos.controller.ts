import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("todos")
export class TodosController {
    constructor(private readonly todosService: TodosService) {};

    @Get()
    getTodos() {
        return this.todosService.getTodos();
    }

    @Post()
    async createTodo(@Body() todo) {
        return await this.todosService.create(todo);
    }

    @Post("upload")
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@Body('id') id: number, @UploadedFile() file: Express.Multer.File) {
        const todo = await this.todosService.getTodoById(id);
        console.log('ANTU');
        return this.todosService.saveFile({
            name: file.originalname,
            mimeType: file.mimetype,
            data: file.buffer,
            todo,
        })
    }
}