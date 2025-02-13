// src/daily-sales-report/daily-sales-report.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from '../invoice/schema/invoice.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DailySalesReportService {
  constructor(
    @InjectModel('Invoice') private readonly invoiceModel: Model<Invoice>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,  // اتصال به RabbitMQ
  ) {}

  // اجرای محاسبات گزارش فروش روزانه و ارسال به RabbitMQ
  @Cron(CronExpression.EVERY_DAY_AT_NOON)  // اجرای Cron job روزانه در ساعت 12:00 ظهر
  async calculateDailySales() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);  // شروع روز
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);  // پایان روز

    const invoices = await this.invoiceModel
      .find({ date: { $gte: startOfDay, $lte: endOfDay } })
      .exec();

    let totalSales = 0;
    const itemQuantities = {};

    invoices.forEach(invoice => {
      totalSales += invoice.amount;

      invoice.items.forEach(item => {
        if (itemQuantities[item.sku]) {
          itemQuantities[item.sku] += item.qt;
        } else {
          itemQuantities[item.sku] = item.qt;
        }
      });
    });

    // ایجاد گزارش فروش روزانه
    const report = {
      totalSales,
      itemsSold: itemQuantities,
    };

    // ارسال گزارش به RabbitMQ
    this.client.emit('daily_sales_report', report);  // انتشار پیام در صف 'daily_sales_report'

    return report;  // بازگشت گزارش به کنترلر
  }

  // متد برای فراخوانی دستی Cron Job از طریق API
  async runDailySalesReport() {
    const report = await this.calculateDailySales();
    return {
      message: 'Daily sales report has been calculated successfully.',
      report,
    };
  }
}
