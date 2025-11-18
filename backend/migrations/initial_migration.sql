-- =====================================================
-- Database Migration: Initial Schema for StockBox
-- =====================================================

-- Create the main schema if it doesn't exist.
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'dbo')
BEGIN
    EXEC('CREATE SCHEMA [project_1771]');
    PRINT 'Schema [project_1771] created successfully.';
END
ELSE
BEGIN
    PRINT 'Schema [project_1771] already exists - skipping creation.';
END
GO

-- =====================================================
-- Table: products
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'products' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE [project_1771].[products] (
        [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        [sku] NVARCHAR(50) NOT NULL,
        [name] NVARCHAR(150) NOT NULL,
        [description] NVARCHAR(MAX) NULL,
        [minimum_stock_level] INT NOT NULL DEFAULT 0,
        [current_stock_quantity] INT NOT NULL DEFAULT 0,
        [status] NVARCHAR(10) NOT NULL DEFAULT 'ATIVO',
        [created_at] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [updated_at] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

        CONSTRAINT UQ_products_sku UNIQUE ([sku]),
        CONSTRAINT CK_products_status CHECK ([status] IN ('ATIVO', 'INATIVO')),
        CONSTRAINT CK_products_minimum_stock_level CHECK ([minimum_stock_level] >= 0)
    );
    PRINT 'Table [project_1771].[products] created successfully.';
END
GO

-- =====================================================
-- Table: stock_movements
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'stock_movements' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE [project_1771].[stock_movements] (
        [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        [product_id] UNIQUEIDENTIFIER NOT NULL,
        [user_id] INT NOT NULL, -- Placeholder for user management feature
        [movement_type] NVARCHAR(20) NOT NULL,
        [quantity] INT NOT NULL,
        [reason] NVARCHAR(255) NULL,
        [movement_date] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

        CONSTRAINT FK_stock_movements_product_id FOREIGN KEY ([product_id]) REFERENCES [project_1771].[products]([id]),
        CONSTRAINT CK_stock_movements_movement_type CHECK ([movement_type] IN ('ENTRADA', 'SAIDA', 'AJUSTE', 'INATIVACAO', 'CADASTRO')),
        CONSTRAINT CK_stock_movements_quantity CHECK ([quantity] >= 0)
    );
    PRINT 'Table [project_1771].[stock_movements] created successfully.';
END
GO

-- =====================================================
-- Indexes
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_stock_movements_product_id' AND object_id = OBJECT_ID('[project_1771].[stock_movements]'))
BEGIN
    CREATE INDEX IX_stock_movements_product_id ON [project_1771].[stock_movements]([product_id]);
    PRINT 'Index IX_stock_movements_product_id created successfully.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_stock_movements_movement_date' AND object_id = OBJECT_ID('[project_1771].[stock_movements]'))
BEGIN
    CREATE INDEX IX_stock_movements_movement_date ON [project_1771].[stock_movements]([movement_date]);
    PRINT 'Index IX_stock_movements_movement_date created successfully.';
END
GO

-- =====================================================
-- Stored Procedure: spProductCreate
-- =====================================================
CREATE OR ALTER PROCEDURE [project_1771].[spProductCreate]
    @sku NVARCHAR(50),
    @name NVARCHAR(150),
    @description NVARCHAR(MAX) = NULL,
    @minimum_stock_level INT,
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM [project_1771].[products] WHERE [sku] = @sku)
    BEGIN
        THROW 50001, 'SkuAlreadyExists', 1;
    END

    DECLARE @new_product_id UNIQUEIDENTIFIER = NEWID();

    BEGIN TRY
        BEGIN TRAN;

        INSERT INTO [project_1771].[products] ([id], [sku], [name], [description], [minimum_stock_level])
        VALUES (@new_product_id, @sku, @name, @description, @minimum_stock_level);

        INSERT INTO [project_1771].[stock_movements] ([product_id], [user_id], [movement_type], [quantity], [reason])
        VALUES (@new_product_id, @user_id, 'CADASTRO', 0, 'Criação inicial do produto');

        COMMIT TRAN;

        SELECT * FROM [project_1771].[products] WHERE [id] = @new_product_id;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;
        THROW;
    END CATCH
END;
GO

-- =====================================================
-- Stored Procedure: spProductGet
-- =====================================================
CREATE OR ALTER PROCEDURE [project_1771].[spProductGet]
    @id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [project_1771].[products] WHERE [id] = @id;
END;
GO

-- =====================================================
-- Stored Procedure: spProductList
-- =====================================================
CREATE OR ALTER PROCEDURE [project_1771].[spProductList]
    @page INT = 1,
    @pageSize INT = 10
AS
BEGIN
    SET NOCOUNT ON;

    SELECT * 
    FROM [project_1771].[products]
    ORDER BY [name]
    OFFSET (@page - 1) * @pageSize ROWS
    FETCH NEXT @pageSize ROWS ONLY;

    SELECT COUNT(*) as total_count FROM [project_1771].[products];
END;
GO

-- =====================================================
-- Stored Procedure: spProductUpdate
-- =====================================================
CREATE OR ALTER PROCEDURE [project_1771].[spProductUpdate]
    @id UNIQUEIDENTIFIER,
    @name NVARCHAR(150),
    @description NVARCHAR(MAX),
    @minimum_stock_level INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [project_1771].[products]
    SET 
        [name] = @name,
        [description] = @description,
        [minimum_stock_level] = @minimum_stock_level,
        [updated_at] = GETUTCDATE()
    WHERE [id] = @id;

    SELECT * FROM [project_1771].[products] WHERE [id] = @id;
END;
GO

-- =====================================================
-- Stored Procedure: spStockMovementCreate
-- =====================================================
CREATE OR ALTER PROCEDURE [project_1771].[spStockMovementCreate]
    @product_id UNIQUEIDENTIFIER,
    @user_id INT,
    @movement_type NVARCHAR(20),
    @quantity INT,
    @reason NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @current_stock INT;
    DECLARE @product_status NVARCHAR(10);

    SELECT 
        @current_stock = [current_stock_quantity],
        @product_status = [status]
    FROM [project_1771].[products] 
    WHERE [id] = @product_id;

    IF @product_status IS NULL
    BEGIN
        THROW 50002, 'ProductNotFound', 1;
    END

    IF @product_status = 'INATIVO'
    BEGIN
        THROW 50003, 'ProductIsInactive', 1;
    END

    IF @movement_type IN ('SAIDA', 'AJUSTE') AND @reason IS NULL
    BEGIN
        THROW 50004, 'ReasonIsRequired', 1;
    END

    IF @movement_type = 'SAIDA' AND @quantity > @current_stock
    BEGIN
        THROW 50005, 'InsufficientStock', 1;
    END

    IF @movement_type = 'INATIVACAO' AND @current_stock <> 0
    BEGIN
        THROW 50006, 'StockMustBeZeroToInactivate', 1;
    END

    BEGIN TRY
        BEGIN TRAN;

        INSERT INTO [project_1771].[stock_movements] ([product_id], [user_id], [movement_type], [quantity], [reason])
        VALUES (@product_id, @user_id, @movement_type, @quantity, @reason);

        DECLARE @new_stock INT = @current_stock;

        IF @movement_type = 'ENTRADA'
            SET @new_stock = @current_stock + @quantity;
        ELSE IF @movement_type = 'SAIDA'
            SET @new_stock = @current_stock - @quantity;
        ELSE IF @movement_type = 'AJUSTE' -- For simplicity, adjustment here means setting a new total.
            SET @new_stock = @quantity;

        UPDATE [project_1771].[products]
        SET 
            [current_stock_quantity] = @new_stock,
            [status] = CASE WHEN @movement_type = 'INATIVACAO' THEN 'INATIVO' ELSE [status] END,
            [updated_at] = GETUTCDATE()
        WHERE [id] = @product_id;

        COMMIT TRAN;

        SELECT * FROM [project_1771].[stock_movements] WHERE [id] = SCOPE_IDENTITY();

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;
        THROW;
    END CATCH
END;
GO

-- =====================================================
-- Stored Procedure: spStockMovementList
-- =====================================================
CREATE OR ALTER PROCEDURE [project_1771].[spStockMovementList]
    @product_id UNIQUEIDENTIFIER = NULL,
    @start_date DATE = NULL,
    @end_date DATE = NULL,
    @movement_type NVARCHAR(20) = NULL,
    @page INT = 1,
    @pageSize INT = 10
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        sm.id,
        sm.product_id,
        p.sku as product_sku,
        p.name as product_name,
        sm.user_id,
        sm.movement_type,
        sm.quantity,
        sm.reason,
        sm.movement_date
    FROM 
        [project_1771].[stock_movements] sm
    JOIN 
        [project_1771].[products] p ON sm.product_id = p.id
    WHERE 
        (@product_id IS NULL OR sm.product_id = @product_id)
        AND (@start_date IS NULL OR sm.movement_date >= @start_date)
        AND (@end_date IS NULL OR sm.movement_date <= @end_date)
        AND (@movement_type IS NULL OR sm.movement_type = @movement_type)
    ORDER BY 
        sm.movement_date DESC
    OFFSET (@page - 1) * @pageSize ROWS
    FETCH NEXT @pageSize ROWS ONLY;

    SELECT COUNT(*)
    FROM [project_1771].[stock_movements] sm
    WHERE 
        (@product_id IS NULL OR sm.product_id = @product_id)
        AND (@start_date IS NULL OR sm.movement_date >= @start_date)
        AND (@end_date IS NULL OR sm.movement_date <= @end_date)
        AND (@movement_type IS NULL OR sm.movement_type = @movement_type);

END;
GO

PRINT 'Feature migration script finished.';
GO
