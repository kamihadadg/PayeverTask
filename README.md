# Invoice and Sales Report Services

This project includes three fully functional services: **Invoice Service**, **Daily Sales Report Service**, and **Email Service**. These services work together to handle the creation of invoices, generate daily sales reports, and send email notifications with the sales summary.

## Services Overview

- **Invoice Service**: Manages the creation of invoices, stores them in a MongoDB database, and handles invoice-related operations.
- **Daily Sales Report Service**: Generates daily sales summary reports based on the invoices created, calculates total sales, and summarizes sales by item (grouped by SKU).
- **Email Service**: Consumes messages from RabbitMQ, sends the generated sales report via email (using a mock email service or an external service like SendGrid).

## Setup Instructions

### Prerequisites

Ensure you have the following software installed:

- **Docker**: [Installation Guide](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Installation Guide](https://docs.docker.com/compose/install/)

### Clone the Repository

Clone the repository to your local machine:

```bash 
git clone https://github.com/kamihadadg/PayeverTask.git
cd PayeverTask



Create an Invoice:
POST http://localhost:3002/invoices/create
Content-Type: application/json

{
  "customer": "Kami Hadad",
  "amount": 200,
  "reference": "REF-1234",
  "items": [
    { "sku": "ITEM001", "qt": 20 },
    { "sku": "ITEM002", "qt": 1 }
  ]
}
Expected Response:
{
  "customer": "Kami Hadad",
  "amount": 200,
  "reference": "REF-1234",
  "items": [
    { "sku": "ITEM001", "qt": 20 },
    { "sku": "ITEM002", "qt": 1 }
  ]
}

Run Daily Sales Report:
Post-http://localhost:3002/daily-sales-report/run

Expected Response:
{
    "message": "Daily sales report has been calculated successfully.",
    "report": {
        "totalSales": 800,
        "itemsSold": {
            "ITEM008": 4,
            "ITEM002": 4,
            "ITEM001": 22
        }
    }
}