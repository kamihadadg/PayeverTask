import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schema/invoice.schema';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel('Invoice') private readonly invoiceModel: Model<Invoice>,
  ) {}

  // ایجاد فاکتور جدید
  async createInvoice(invoiceData: any): Promise<Invoice> {
    const invoice = new this.invoiceModel(invoiceData);
    return invoice.save();
  }

  // دریافت همه فاکتورها
  async getInvoices(): Promise<Invoice[]> {
    return this.invoiceModel.find().exec();
  }

  // دریافت فاکتور بر اساس شناسه
  async getInvoiceById(id: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findById(id).exec();
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return invoice;
  }
  
}
