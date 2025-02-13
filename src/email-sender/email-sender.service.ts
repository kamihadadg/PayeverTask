import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailSenderService {
  private channel: amqp.Channel;
  private connection: amqp.Connection;

  // تنظیمات ایمیل
  private transporter = nodemailer.createTransport({
    service: 'gmail', // یا هر سرویس دیگری مانند SendGrid
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password', // یا استفاده از محیط متغیرها برای امنیت بیشتر
    },
  });

  constructor() {
    this.connectToRabbitMQ();
  }

  // اتصال به RabbitMQ
  private async connectToRabbitMQ() {
    try {
      const connection = await amqp.connect('amqp://localhost');
      this.connection = connection;
      this.channel = await connection.createChannel();
      await this.channel.assertQueue('daily_sales_report', { durable: true });

      // مصرف پیام‌ها از صف daily_sales_report
      this.channel.consume('daily_sales_report', (msg) => {
        if (msg) {
          const salesReport = JSON.parse(msg.content.toString());
          this.sendEmail(salesReport);
          this.channel.ack(msg); // تایید دریافت پیام
        }
      });
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
    }
  }

  // ارسال ایمیل
  private async sendEmail(report: any) {
    const mailOptions = {
      from: 'kamihadad@gmail.com',
      to: 'kamihadad@gmail.com', // ایمیل مقصد
      subject: 'Daily Sales Report',
      text: this.formatReport(report), // تبدیل گزارش به فرمت مناسب
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  // فرمت گزارش فروش
  private formatReport(report: any): string {
    let formattedReport = `Total Sales: $${report.totalSales}\n\n`;

    formattedReport += 'Sales Per Item:\n';
    report.items.forEach((item: any) => {
      formattedReport += `SKU: ${item.sku}, Quantity Sold: ${item.quantitySold}\n`;
    });

    return formattedReport;
  }
}
