-- Schema helpers for the Barcode Scan Withdrawal System.
-- Adjust to match your existing database. Safe to run column-by-column.

-- Extra columns expected on ListBillPay_Car
IF COL_LENGTH('ListBillPay_Car', 'IDs_User') IS NULL
  ALTER TABLE ListBillPay_Car ADD IDs_User INT NULL;
IF COL_LENGTH('ListBillPay_Car', 'DocNumber') IS NULL
  ALTER TABLE ListBillPay_Car ADD DocNumber VARCHAR(50) NULL;
IF COL_LENGTH('ListBillPay_Car', 'Status') IS NULL
  ALTER TABLE ListBillPay_Car ADD Status VARCHAR(20) NOT NULL DEFAULT 'PENDING';
IF COL_LENGTH('ListBillPay_Car', 'Note') IS NULL
  ALTER TABLE ListBillPay_Car ADD Note NVARCHAR(500) NULL;
IF COL_LENGTH('ListBillPay_Car', 'CreatedAt') IS NULL
  ALTER TABLE ListBillPay_Car ADD CreatedAt DATETIME NOT NULL DEFAULT GETDATE();
GO

-- Recommended indexes
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Product_Barcode')
  CREATE INDEX IX_Product_Barcode ON Product(Barcode);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Product_IdPro')
  CREATE INDEX IX_Product_IdPro ON Product(IdPro);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Customer_IdCus')
  CREATE INDEX IX_Customer_IdCus ON Customer(IdCus);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_BillPay_Created')
  CREATE INDEX IX_BillPay_Created ON ListBillPay_Car(CreatedAt DESC);
GO
