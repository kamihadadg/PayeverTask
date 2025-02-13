import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceModule } from './invoice/invoice.module';
import * as dotenv from 'dotenv'; // اصلاح وارد کردن dotenv

// بارگذاری فایل .env
dotenv.config();

@Module({
  imports: [
    InvoiceModule,
    MongooseModule.forRoot(process.env.MONGO_URI ||'mongodb+srv://kamihadad:K%40mran123@cluster0.0mjai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'), 
  ],
})
export class AppModule {}
