# Tax ID Collection Portal

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mahmud-bakales-projects/v0-tax-id-collection-portal)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/kfPRaXaG3bB)

## Overview

A comprehensive tax ID collection system for Sahad Hospitals staff, featuring:

- **Staff Portal**: Secure staff ID lookup and tax information submission
- **Admin Dashboard**: Complete management interface with authentication
- **Supabase Integration**: Real-time database with 40+ static staff records
- **Secure Authentication**: Admin login with protected routes

## Features

### Staff Portal (`/`)
- Staff ID search and validation
- Tax ID submission (National TIN & FCT-IRS Tax ID)
- Duplicate submission prevention
- Real-time status updates

### Admin Portal (`/admin`)
- Secure admin authentication
- View all submitted records (real-time)
- Filter and search functionality
- Approve/reject submissions
- CSV export capability
- Logout functionality

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd tax-id-collection-portal
   yarn install
   ```

2. **Setup Supabase**
   - Follow the detailed instructions in `scripts/setup-supabase.md`
   - Create your Supabase project
   - Run the database schema and seed data
   - Create admin user

3. **Environment Variables**
   ```bash
   cp .env.local.example .env.local
   # Fill in your Supabase credentials
   ```

4. **Run Development Server**
   ```bash
   yarn dev
   ```

## Database Schema

The system uses a single `staff` table with the following structure:

- **id**: UUID primary key
- **staff_id**: Unique staff identifier (SH001, SH002, etc.)
- **name**: Staff member name
- **department**: Department/unit
- **national_tin**: National Tax Identification Number
- **fct_irs_tax_id**: FCT-IRS Tax ID
- **status**: pending | approved | rejected
- **has_submitted**: Boolean flag
- **submitted_at**: Submission timestamp
- **reviewed_at**: Review timestamp

## Static Test Data

The system comes pre-loaded with 40 staff records (SH001-SH040) including:
- Various departments (Cardiology, Emergency Medicine, Pediatrics, etc.)
- Different submission states (new, submitted, approved, rejected)
- Realistic Nigerian hospital staff data

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with @supabase/ssr
- **Deployment**: Vercel
- **Security**: Next.js 16 proxy (updated from deprecated middleware)

## Deployment

Your project is live at:

**[https://vercel.com/mahmud-bakales-projects/v0-tax-id-collection-portal](https://vercel.com/mahmud-bakales-projects/v0-tax-id-collection-portal)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/kfPRaXaG3bB](https://v0.app/chat/kfPRaXaG3bB)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository