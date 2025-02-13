// src/daily-sales-report/daily-sales-report.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailySalesReportService } from './daily-sales-report.service';
import { DailySalesReportController } from './daily-sales-report.controller';
import { Invoice, InvoiceSchema } from '../invoice/schema/invoice.schema'; // مدل فاکتور
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Invoice', schema: InvoiceSchema }]), // مدل فاکتور
  ],
  controllers: [DailySalesReportController],
  providers: [
    DailySalesReportService,
    {
      provide: 'RABBITMQ_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],  // Address RabbitMQ
            queue: 'daily_sales_report',  // Que
            queueOptions: { durable: false },
          },
        });
      },
    },
  ],
})

export class DailySalesReportModule {}
