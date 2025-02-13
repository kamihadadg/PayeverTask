import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from '../../invoice/invoice.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from '../../invoice/schema/invoice.schema';

const mockInvoice = {
  customer: 'John Doe',
  amount: 1000,
  reference: 'INV-1001',
  date: new Date(),
  items: [{ sku: 'ABC123', qt: 2 }],
};

describe('InvoiceService', () => {
  let service: InvoiceService;
  let invoiceModel: Model<Invoice>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getModelToken('Invoice'),
          useValue: {
            create: jest.fn().mockResolvedValue(mockInvoice),
            find: jest.fn().mockResolvedValue([mockInvoice]),
            findById: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockInvoice), // Simulate exec method
            }),
          },
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    invoiceModel = module.get<Model<Invoice>>(getModelToken('Invoice'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an invoice', async () => {
    const result = await service.createInvoice(mockInvoice);
    expect(result).toEqual(mockInvoice);
    expect(invoiceModel.create).toHaveBeenCalledWith(mockInvoice); // Ensure create method is called
  });

  it('should retrieve all invoices', async () => {
    const result = await service.getInvoices();
    expect(result).toEqual([mockInvoice]);
    expect(invoiceModel.find).toHaveBeenCalled();
  });

  it('should retrieve an invoice by ID', async () => {
    const result = await service.getInvoiceById('12345');
    expect(result).toEqual(mockInvoice);
    expect(invoiceModel.findById).toHaveBeenCalledWith('12345');
  });
});
