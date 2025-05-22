import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { Todo } from './todos.entity';
import { Readable } from 'typeorm/platform/PlatformTools';

describe('TodosController', () => {
  let todosController: TodosController;
  let module: TestingModule;

  let mockTodosService: Partial<TodosService>;

  const mockTodo: Partial<Todo> = {
    title: 'Todo 1',
    description: 'description 1',
  };

  const mockFile: Express.Multer.File = {
    fieldname: 'example',
    originalname: 'example',
    encoding: 'utf-8',
    mimetype: 'text/plain',
    size: 0,
    stream: new Readable(),
    destination: '',
    filename: '',
    path: '',
    buffer: Buffer.from([]),
  };

  beforeEach(async () => {
    mockTodosService = {
      getTodos: () =>
        Promise.resolve([{ ...mockTodo, id: 1, isCompleted: false } as Todo]),
      getTodoById: (id: number) =>
        Promise.resolve({ ...mockTodo, id: 1, isCompleted: false } as Todo),
      create: (todo: Partial<Todo>) =>
        Promise.resolve({ ...mockTodo, id: 1, isCompleted: false } as Todo),
      saveFile: () =>
        Promise.resolve({
          id: 1,
          name: 'example.txt',
          mimeType: 'text/plain',
          data: Buffer.from([]),
          todo: {
            ...mockTodo,
            id: 1,
            isCompleted: false,
          } as Todo,
        }),
    };

    module = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [{ provide: TodosService, useValue: mockTodosService }],
    }).compile();
    todosController = module.get<TodosController>(TodosController);
  });

  it('should be defined', () => {
    expect(todosController).toBeDefined();
  });

  it('get todos should return an array of todos', async () => {
    const todos = await todosController.getTodos();
    expect(todos).toEqual([
      {
        id: 1,
        title: 'Todo 1',
        description: 'description 1',
        isCompleted: false,
      },
    ]);
  });

  it('createTodo() should create a new todo', async () => {
    const todo = await todosController.createTodo(mockTodo);
    expect(todo).toEqual({
      id: 1,
      title: 'Todo 1',
      description: 'description 1',
      isCompleted: false,
    });
  });

  it('uploadFile() should upload a file', async () => {
    const file = await todosController.uploadFile(1, mockFile);
    expect(file).toEqual({
      id: 1,
      name: 'example.txt',
      mimeType: 'text/plain',
      data: Buffer.from([]),
      todo: {
        ...mockTodo,
        id: 1,
        isCompleted: false,
      },
    });
  });
});
