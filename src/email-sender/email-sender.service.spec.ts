import { Test, TestingModule } from '@nestjs/testing';
import { EmailSenderService } from './email-sender.service';
import { getModelToken } from '@nestjs/mongoose';
import * as nodemailer from 'nodemailer';
import * as amqp from 'amqplib';

// Mock for nodemailer
jest.mock('nodemailer');
jest.mock('amqplib');

describe('EmailSenderService', () => {
  let service: EmailSenderService;
  let mockTransporter;
  let mockChannel;
  let mockConnection;

  beforeEach(async () => {
    mockTransporter = {
      sendMail: jest.fn(),
    };

    mockChannel = {
      consume: jest.fn(),
      ack: jest.fn(),
    };

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailSenderService,
        {
          provide: getModelToken('Invoice'),
          useValue: {},
        },
      ],
    })
      .overrideProvider(nodemailer.createTransport)
      .useValue(mockTransporter)
      .compile();

    service = module.get<EmailSenderService>(EmailSenderService);

    // Mock connection setup for RabbitMQ
    (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);
    await service['connectToRabbitMQ']();  // Call the private method to initialize the RabbitMQ connection
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to RabbitMQ and consume messages', async () => {
    expect(amqp.connect).toHaveBeenCalledWith('amqp://localhost');
    expect(mockChannel.consume).toHaveBeenCalledWith(
      'daily_sales_report',
      expect.any(Function),
    );
  });

  it('should process the message and send an email', async () => {
    const report = {
      totalSales: 1000,
      items: [
        { sku: 'SKU123', quantitySold: 10 },
        { sku: 'SKU124', quantitySold: 20 },
      ],
    };

    // Mock the received message
    const msg = { content: Buffer.from(JSON.stringify(report)) };

    // Call the function to simulate message consumption
    await service['sendEmail'](report);  // Directly test sendEmail method to isolate email sending

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'your-email@gmail.com',
      to: 'recipient-email@example.com',
      subject: 'Daily Sales Report',
      text: expect.stringContaining('Total Sales: $1000'),
    });
  });

  it('should format the report correctly', () => {
    const report = {
      totalSales: 1000,
      items: [
        { sku: 'SKU123', quantitySold: 10 },
        { sku: 'SKU124', quantitySold: 20 },
      ],
    };

    const formattedReport = service['formatReport'](report);

    expect(formattedReport).toContain('Total Sales: $1000');
    expect(formattedReport).toContain('SKU: SKU123');
    expect(formattedReport).toContain('Quantity Sold: 10');
  });

  it('should acknowledge the message after processing', async () => {
    const msg = { content: Buffer.from('some report') };

    // Simulate message consumption and email sending
    await service['sendEmail'](msg.content.toString());

    // Check if the message was acknowledged
    expect(mockChannel.ack).toHaveBeenCalledWith(msg);
  });
});
