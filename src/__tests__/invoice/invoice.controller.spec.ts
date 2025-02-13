import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { MongooseModule } from '@nestjs/mongoose';

describe('InvoiceController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRoot('mongodb+srv://kamihadad:K%40mran123@cluster0.0mjai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'), // Separate DB for tests
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/invoices/create (POST) - should create an invoice', async () => {
    const response = await request(app.getHttpServer())
      .post('/invoices/create')
      .send({
        customer: 'John Doe',
        amount: 1000,
        reference: 'INV-1001',
        date: '2024-02-13',
        items: [{ sku: 'ABC123', qt: 2 }],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
  });

  it('/invoices (GET) - should return all invoices', async () => {
    const response = await request(app.getHttpServer()).get('/invoices');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('/invoices/:id (GET) - should return an invoice by ID', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/invoices/create')
      .send({
        customer: 'John Doe',
        amount: 1000,
        reference: 'INV-1002',
        date: '2024-02-13',
        items: [{ sku: 'XYZ789', qt: 5 }],
      });

    const invoiceId = createResponse.body._id;

    const response = await request(app.getHttpServer()).get(`/invoices/${invoiceId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', invoiceId);
  });
});
