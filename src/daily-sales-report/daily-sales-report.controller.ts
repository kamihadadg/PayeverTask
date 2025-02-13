// src/daily-sales-report/daily-sales-report.controller.ts
import { Controller, Post } from '@nestjs/common';
import { DailySalesReportService } from './daily-sales-report.service';

@Controller('daily-sales-report')
export class DailySalesReportController {
  constructor(
    private readonly dailySalesReportService: DailySalesReportService,
  ) {}

  // این مسیر برای فراخوانی دستی Cron Job از طریق درخواست POST است
  @Post('run')
  async runDailySalesReport() {
    const result = await this.dailySalesReportService.runDailySalesReport();
    return result;  // ارسال گزارش فروش روزانه در پاسخ
  }
}
