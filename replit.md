# Production Management System

## Overview
This is a comprehensive production management system managing manufacturing operations including order processing, production workflow, quality control, HR management, and IoT monitoring. It aims to streamline manufacturing, enhance efficiency, and provide real-time insights for informed decision-making. The system is fully functional and built to support a wide range of industrial production environments.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI with Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: React Router
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js 20 with ES modules
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy and session-based auth
- **File Uploads**: Express-fileupload middleware
- **Core Modules**: Setup Management, Production Workflow, HR Management, Quality Assurance, IoT Integration, Dashboard System, Notification System.
- **Key Features**:
    - **Voice Recognition**: Comprehensive, multilingual (English/Arabic) voice recognition with speech-to-text and text-to-speech, including gesture animations, haptic feedback, and hands-free interaction.
    - **AI Assistant**: Dual-model AI system (OpenAI GPT-4o and Anthropic Claude Sonnet 4) for production management context, order creation, customer/product matching with bilingual search capabilities, intelligent suggestions, and workflow guidance. Features enhanced customer lookup supporting both English and Arabic name columns with real-time database queries. Both OpenAI GPT-4o and Anthropic Claude Sonnet 4 successfully configured and operational for comprehensive AI coverage with Arabic/English bilingual support.
    - **Internationalization**: Full bilingual support (English/Arabic) across the entire application, including UI, voice commands, and content.
    - **Job Order Monitoring**: Real-time quantity tracking across extrusion, printing, and cutting stages with statistics and mobile-responsive design.
    - **Negative Balance Management**: Allows material mixing even with insufficient raw material stock, creating negative balances.
    - **Geofence Management**: Interactive map for location selection, geofence creation, and enforcement for attendance operations with GPS location requirement.
    - **Document Management**: Comprehensive document viewing, printing, and robust document number generation with professional rich text editor supporting Arabic/English, fonts, colors, tables, and images.
    - **Cascading Deletes**: Ensures data integrity by automatically removing associated records (e.g., deleting an order removes job orders and rolls).
    - **Production Workflow**: Manages order processing, job order generation, material mixing, quality checks, and IoT monitoring.
    - **Quantity Calculation Enhancement**: Automatic extra quantity calculation for job orders based on product punching type (e.g., T-Shirt, Banana).
    - **ABA Formulas**: Management of material mixing formulas with detailed composition and print reports.
    - **HR Violations & Complaints**: Comprehensive system for managing various violation types with repeat offense tracking and detailed documentation.
    - **My Dashboard**: Personalized user dashboard with attendance tracking, quick actions, performance overview, and maintenance request submission.
    - **Customer Information Registration**: Public-facing registration page for collecting business information with address validation and auto-translation.
    - **Professional Rich Text Editor**: Advanced document editor with multi-font support (Tahoma, Arial, Times New Roman), RTL/LTR toggle, automatic Arabic language detection, color picker for text and highlighting, table insertion (up to 8x8), image upload, and complete formatting tools with preview mode.

### System Design Choices
- **UI/UX**: Emphasis on modern, professional UI with Radix UI and Tailwind CSS, featuring gradient backgrounds, glass effects, and consistent design patterns.
- **Mobile-First Design**: All components and layouts are optimized for mobile responsiveness.
- **Data Integrity**: Extensive use of Zod for validation and Drizzle ORM for type-safe database interactions.
- **Error Handling**: Comprehensive global error handling, error boundaries, and detailed logging.
- **Performance**: Optimization through debouncing, memoization, and efficient API interactions.
- **Security**: Robust authentication (Passport.js) and role-based access control.

## External Dependencies

### Database
- **PostgreSQL**: Primary data storage (via Neon serverless).
- **Drizzle ORM**: For database interactions and migrations.

### Third-Party Services
- **OpenAI**: For AI Assistant functionalities (GPT-4o).
- **SendGrid**: For email notifications and alerts.
- **Taqnyat**: For SMS messaging services.
- **Google Maps API**: For geofence management (optional fallback implemented if unavailable).
- **Fuse.js**: For fuzzy search capabilities.

### Development Tools
- **Vite**: Frontend build tool.
- **ESBuild**: Backend bundling.
- **TypeScript**: For type safety.
- **Prettier**: Code formatting.
- **Tailwind CSS**: Styling framework.