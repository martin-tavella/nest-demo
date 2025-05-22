import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todos.entity';
import { Repository } from 'typeorm';
import { File } from './files.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
    @InjectRepository(File) private fileRepository: Repository<File>,
  ) {}
  async getTodos() {
    return await this.todoRepository.find({
      relations: {
        files: true,
      },
    });
  }

  async getTodoById(id) {
    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: { files: true },
    });

    if(!todo) throw new NotFoundException("no ta");

    return todo
  }

   async create(todo: Omit<Todo, 'id'>) {
    const newTodo = this.todoRepository.create(todo);
    return await this.todoRepository.save(newTodo);

  }

  async saveFile({name, mimeType, data, todo}: {
    name: string;
    mimeType: string;
    data: Buffer;
    todo: Todo;
  }) {
    const file = new File();

    file.name = name;
    file.mimeType = mimeType;
    file.data = data;
    file.todo = todo;
    console.log('ANTU');
    return await this.fileRepository.save(file);
  };
}
