import { Schema, Document } from 'mongoose';

export const InvoiceSchema = new Schema({
  customer: { type: String, required: true },
  amount: { type: Number, required: true },
  reference: { type: String, required: true },
  date: { type: Date, default: Date.now },
  items: [
    {
      sku: { type: String, required: true },
      qt: { type: Number, required: true },
    },
  ],
});

export interface Invoice extends Document {
  customer: string;
  amount: number;
  reference: string;
  date: Date;
  items: { sku: string; qt: number }[];
}
