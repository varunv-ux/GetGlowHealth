# FaceHealth Pro - Replit Development Guide

## Overview

FaceHealth Pro is a full-stack web application for facial health analysis using AI-powered image processing. The application allows users to upload photos for comprehensive facial health assessment, providing detailed reports on skin health, eye condition, circulation, and symmetry analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom medical interface color scheme
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **File Handling**: react-dropzone for image upload interface

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **File Upload**: Multer middleware for handling image uploads
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild for server bundling

### Data Storage Solutions
- **Database**: PostgreSQL configured via Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Shared schema definitions between client and server
- **Storage Interface**: Abstract storage interface with in-memory implementation for development

## Key Components

### Core Application Components
1. **Upload Section**: Drag-and-drop image upload with validation
2. **Processing Section**: Real-time analysis progress with simulated AI processing
3. **Results Section**: Comprehensive health analysis display
4. **Health Score Card**: Circular progress indicators for health metrics
5. **Facial Analysis Display**: Interactive image overlay with feature markers
6. **Detailed Reports**: Comprehensive health analysis breakdown
7. **Recommendations Section**: Personalized health recommendations

### Database Schema
- **Users Table**: User authentication and profile data
- **Analyses Table**: Facial analysis results with JSONB data storage
- **Analysis Data Structure**: Facial markers, skin analysis, eye health, circulation metrics

### Image Processing Pipeline
1. **Upload Validation**: File type and size validation (JPEG, PNG, WebP, 10MB limit)
2. **Image Processing**: Client-side image resizing and optimization
3. **OpenAI Vision Analysis**: Real AI-powered facial analysis using GPT-4o vision model
4. **Results Storage**: Analysis results stored with structured data

## Data Flow

1. **Image Upload**: User uploads image through drag-and-drop interface
2. **Client Processing**: Image validation and optional resizing
3. **Server Analysis**: OpenAI GPT-4o analyzes facial image for health metrics
4. **Database Storage**: Analysis results stored with user association
5. **Real-time Updates**: Client polls for analysis completion
6. **Results Display**: Comprehensive health dashboard with recommendations

## External Dependencies

### AI Services
- **OpenAI GPT-4o**: Vision model for real-time facial health analysis
- **OpenAI SDK**: JavaScript client for API integration

### Development Tools
- **Vite**: Development server and build tool
- **TypeScript**: Type safety across the application
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Production server bundling

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **shadcn/ui**: Pre-built component system

### Backend Services
- **Neon Database**: Serverless PostgreSQL provider
- **Multer**: File upload middleware
- **Express**: Web application framework

### Frontend Libraries
- **TanStack Query**: Server state management
- **Wouter**: Lightweight routing
- **React Hook Form**: Form handling
- **Zod**: Runtime type validation

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with HMR
- **Database**: Neon Database connection via DATABASE_URL
- **File Storage**: Local uploads directory for development
- **TypeScript**: Real-time type checking

### Production Build
- **Frontend**: Vite build generates optimized static assets
- **Backend**: ESBuild bundles server code for Node.js
- **Database**: Production PostgreSQL via Neon Database
- **Environment**: NODE_ENV=production configuration

### Configuration Management
- **Environment Variables**: DATABASE_URL for database connection, OPENAI_API_KEY for AI analysis
- **Build Scripts**: Separate dev/build/start commands
- **Database Migrations**: Drizzle Kit push command for schema updates

### Architecture Decisions

**Monorepo Structure**: Single repository with client/server/shared directories for code sharing and simplified deployment.

**OpenAI Vision Integration**: Real AI-powered facial health analysis using GPT-4o vision model for accurate health assessment and personalized recommendations.

**JSONB Storage**: Flexible analysis data storage using PostgreSQL JSONB for complex health metrics and recommendations.

**Type-Safe Schema**: Shared TypeScript types between client and server using Drizzle ORM schema definitions.

**Medical UI Design**: Custom color scheme and components designed for healthcare applications with trust and professionalism in mind.

**Progressive Enhancement**: Application works with JavaScript disabled for basic functionality, enhanced with interactive features.