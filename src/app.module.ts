import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { InvoiceModule } from './invoice/invoice.module';
import { DailySalesReportModule } from './daily-sales-report/daily-sales-report.module'; // وارد کردن ماژول گزارش فروش
import * as dotenv from 'dotenv'; // اصلاح وارد کردن dotenv

// بارگذاری فایل .env
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ||'mongodb+srv://kamihadad:K%40mran123@cluster0.0mjai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'), 
    ScheduleModule.forRoot(),
    InvoiceModule,
    DailySalesReportModule,
  ],
})
export class AppModule {}
