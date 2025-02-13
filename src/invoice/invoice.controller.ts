// src/invoice/invoice.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('create')
  async create(@Body() invoiceData: any) {
    return this.invoiceService.createInvoice(invoiceData);  // داده‌های ورودی به صورت مستقیم دریافت می‌شود
  }

  @Get() 
  async findAll() {
    return this.invoiceService.getInvoices();  // دریافت لیست فاکتورها بدون فیلتر
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.invoiceService.getInvoiceById(id);
  }
}
