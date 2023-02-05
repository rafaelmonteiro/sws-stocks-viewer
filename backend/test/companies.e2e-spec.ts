import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CompaniesModule } from '../src/companies/companies.module';

describe('Companies controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: __dirname + '/../db/sws-data.sqlite3',
          synchronize: false,
          logging: false,
          entities: [__dirname + '/../src/**/*.entity.{js,ts}'],
          namingStrategy: new SnakeNamingStrategy(),
        }),
        CompaniesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/companies with no parameters (default pagination) (GET)', () => {
    return request(app.getHttpServer())
      .get('/companies')
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('totalCount');
        expect(response.body.data).toHaveLength(10);
        expect(response.body.totalCount).toBe(12);
      });
  });

  it('/companies with pagination (GET)', () => {
    return request(app.getHttpServer())
      .get('/companies?take=7')
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('totalCount');
        expect(response.body.data).toHaveLength(7);
        expect(response.body.totalCount).toBe(12);
      });
  });

  it('/companies with pagination offset (GET)', () => {
    return request(app.getHttpServer())
      .get('/companies?take=10&skip=8')
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('totalCount');
        expect(response.body.data).toHaveLength(4);
        expect(response.body.totalCount).toBe(12);
      });
  });

  it('/companies with share prices (GET)', () => {
    return request(app.getHttpServer())
      .get('/companies?take=2&includeSharePrices=true')
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('totalCount');
        expect(response.body.data).toHaveLength(2);
        expect(response.body.totalCount).toBe(12);
        expect(response.body.data[0]).toHaveProperty('sharePrices');
      });
  });

  it('/companies filter by search value (GET)', () => {
    return request(app.getHttpServer())
      .get('/companies?search=DAL')
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('totalCount');
        expect(response.body.totalCount).toBe(12);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].tickerSymbol).toBe('DAL');
      });
  });

  it('/companies filter by exchange symbol (GET)', () => {
    return request(app.getHttpServer())
      .get('/companies?symbol=ASX')
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('totalCount');
        expect(response.body.totalCount).toBe(12);
        expect(response.body.data).toHaveLength(3);
        expect(response.body.data[0].exchangeSymbol).toBe('ASX');
        expect(response.body.data[1].exchangeSymbol).toBe('ASX');
        expect(response.body.data[2].exchangeSymbol).toBe('ASX');
      });
  });

  it('/companies filter by total score (GET)', () => {
    return request(app.getHttpServer())
      .get('/companies?score=11')
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('totalCount');
        expect(response.body.data).toHaveLength(2);
        expect(response.body.totalCount).toBe(12);
        expect(response.body.data[0].score.total).toBe(11);
        expect(response.body.data[1].score.total).toBe(11);
      });
  });

  it('/companies/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/companies/49A0E7C9-F918-4E97-AECA-D8D37F9A3F4F')
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('score');
        expect(response.body).toHaveProperty('sharePrices');
        expect(response.body.id).toBe('49A0E7C9-F918-4E97-AECA-D8D37F9A3F4F');
      });
  });
});
