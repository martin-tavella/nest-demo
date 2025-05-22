import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) users returns an array of users with an ok status code', async () => {
     const req = await request(app.getHttpServer()).get('/users')
       console.log(req.body);
      
      expect(req.status).toBe(200)
      expect(req.body).toBeInstanceOf(Array);
  });

  it('get /users/:id returns a user with an OK status code', async () => {
     const req = await request(app.getHttpServer()).get('/users/66f720ab-850d-4428-9e98-0f77fb96602c')
     expect(req.status).toBe(200)
    expect(req.body).toBeInstanceOf(Object);
  })

  it('Get /users/:id throws an error if id is not an uuid', async () => {
    const req = await request(app.getHttpServer()).get('/users/not-an-uuid')
    expect(req.status).toBe(400)
  })

  it('Post users/signup creates an user with an opk status ocoooooodeeeee', async () => {
    const req = await request(app.getHttpServer()).post('/users/signup').send({

      email:'agioaehgoiaehgoeahg@gmail.com',
      password:'123456',
      name:'Test'
    })

    expect(req.status).toBe(201);
    expect(req.body).toBeInstanceOf(Object)
  })
  })

