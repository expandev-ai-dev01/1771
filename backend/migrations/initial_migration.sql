-- =====================================================
-- Database Migration: Initial Schema Setup
-- =====================================================
-- This file sets up the basic schema required for the application.
-- Feature-specific tables should be added in subsequent migration files.
-- =====================================================

-- Create the main schema if it doesn't exist.
-- The deployment process may replace [dbo] with a project-specific schema.
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'dbo')
BEGIN
    EXEC('CREATE SCHEMA [dbo]');
    PRINT 'Schema [dbo] created successfully.';
END
ELSE
BEGIN
    PRINT 'Schema [dbo] already exists - skipping creation.';
END
GO

-- =====================================================
-- ADD FEATURE TABLES BELOW THIS LINE IN FUTURE MIGRATIONS
-- =====================================================

PRINT 'Initial migration script finished.';
GO
