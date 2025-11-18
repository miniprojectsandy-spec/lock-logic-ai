# Secure Vault - Encrypted Password Manager

A comprehensive web-based encrypted password manager built with React, TypeScript, and Supabase. Secure Vault helps you store, manage, and protect your credentials with AES-256 encryption, along with features for secure photo and document storage.

## Features

- 🔐 **Password Management**: Store and manage credentials with AES-256 encryption
- 📸 **Photo Vault**: Securely store personal photos in encrypted storage
- 📄 **Document Vault**: Keep important documents safe and organized
- 🔑 **Password Generator**: Create strong, customizable passwords
- 🛡️ **Breach Checker**: Check if credentials have been compromised
- 🤖 **AI Security Assistant**: Get security advice and recommendations
- 📚 **Security Articles**: Learn about privacy and cybersecurity best practices
- ✅ **Todo List**: Track security-related tasks
- 🔍 **Login History**: Monitor account access and activity
- 🌓 **Dark/Light Mode**: Comfortable viewing in any environment

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Encryption**: CryptoJS (AES-256)
- **State Management**: TanStack Query
- **Routing**: React Router v6

## Architecture & Dataflow Diagram

<lov-mermaid>
graph TB
    subgraph "Client Layer"
        UI[React UI Components]
        Auth[Auth Context]
        Encrypt[Encryption Layer]
    end

    subgraph "Application Features"
        Vault[Credential Vault]
        Photos[Photo Vault]
        Docs[Document Vault]
        Articles[Security Articles]
        Profile[User Profile]
        Tools[Security Tools]
    end

    subgraph "Backend - Lovable Cloud"
        SupaAuth[Supabase Auth]
        SupaDB[(PostgreSQL Database)]
        SupaStorage[File Storage]
    end

    subgraph "Database Tables"
        Credentials[credentials]
        PhotosDB[photos]
        DocsDB[documents]
        ArticlesDB[articles]
        ProfilesDB[profiles]
        TodosDB[todos]
        LoginHistory[login_history]
    end

    %% User Flow
    User([User]) --> UI
    UI --> Auth

    %% Authentication Flow
    Auth -->|Sign Up/Login| SupaAuth
    SupaAuth -->|JWT Token| Auth
    SupaAuth -->|Create Profile| ProfilesDB

    %% Feature Routing
    UI --> Vault
    UI --> Photos
    UI --> Docs
    UI --> Articles
    UI --> Profile
    UI --> Tools

    %% Credential Management Flow
    Vault -->|Encrypt Password| Encrypt
    Encrypt -->|Store Encrypted Data| Credentials
    Credentials -->|Query with RLS| SupaDB
    Vault -->|Read| Credentials
    Encrypt -->|Decrypt Password| Vault

    %% Photo Vault Flow
    Photos -->|Upload File| SupaStorage
    SupaStorage -->|File Path| PhotosDB
    PhotosDB -->|Query with RLS| SupaDB
    Photos -->|Metadata| PhotosDB

    %% Document Vault Flow
    Docs -->|Upload File| SupaStorage
    SupaStorage -->|File Path| DocsDB
    DocsDB -->|Query with RLS| SupaDB
    Docs -->|Metadata| DocsDB

    %% Articles Flow
    Articles -->|Fetch Public Data| ArticlesDB
    ArticlesDB -->|Query with RLS| SupaDB

    %% Profile & Todo Flow
    Profile -->|Manage Tasks| TodosDB
    Profile -->|View History| LoginHistory
    TodosDB -->|Query with RLS| SupaDB
    LoginHistory -->|Query with RLS| SupaDB

    %% Security Tools
    Tools -->|Generate| Vault
    Tools -->|Check Breach| Vault

    style User fill:#4f46e5
    style SupaAuth fill:#10b981
    style SupaDB fill:#10b981
    style SupaStorage fill:#10b981
    style Encrypt fill:#ef4444
</lov-mermaid>

## Data Flow Description

### 1. Authentication Flow
- User signs up or logs in through the Auth page
- Supabase Auth issues JWT tokens for session management
- User profile is automatically created in the `profiles` table via database trigger
- Auth context manages session state across the application

### 2. Credential Management
- User enters credential data (title, username, password, etc.)
- Password is encrypted client-side using AES-256 before storage
- Encrypted data is stored in the `credentials` table
- Row-Level Security (RLS) ensures users can only access their own data
- On retrieval, passwords are decrypted client-side for display

### 3. File Storage (Photos & Documents)
- Files are uploaded to Supabase Storage buckets
- Metadata (title, category, file path) is stored in respective database tables
- Storage policies ensure private access per user
- Files are organized by user ID and category

### 4. Security Features
- **Password Generator**: Creates strong passwords using configurable options
- **Breach Checker**: Validates credentials against known breaches
- **AI Chatbot**: Provides security guidance and recommendations
- **Login History**: Tracks authentication attempts and device information

### 5. Articles System
- Public-facing security articles stored in `articles` table
- Content includes cybersecurity tips, privacy guides, and best practices
- Supports categorization and search functionality

## Database Schema

### Key Tables
- **profiles**: User profile information
- **credentials**: Encrypted password storage
- **photos**: Photo metadata and storage references
- **documents**: Document metadata and storage references
- **articles**: Security articles and guides
- **todos**: User task management
- **login_history**: Authentication audit trail

### Security
- All tables use Row-Level Security (RLS)
- User data is isolated per user ID
- Files stored in private buckets
- Master password required for vault access
- Inactivity timeout for automatic logout

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
The project is pre-configured with Lovable Cloud. Environment variables are automatically managed.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   ├── AIChatbot.tsx
│   ├── BreachChecker.tsx
│   ├── PasswordGenerator.tsx
│   └── ...
├── contexts/          # React contexts
│   └── AuthContext.tsx
├── pages/             # Route pages
│   ├── Auth.tsx
│   ├── Vault.tsx
│   ├── PhotoVault.tsx
│   ├── DocumentVault.tsx
│   ├── Articles.tsx
│   ├── ArticleDetail.tsx
│   └── Profile.tsx
├── lib/               # Utility functions
│   ├── encryption.ts
│   └── utils.ts
├── integrations/      # External integrations
│   └── supabase/      # Supabase client & types
└── App.tsx            # Main application component
```

## Deployment

Deploy your application using Lovable:

1. Click **Publish** in the top right (desktop) or bottom-right (mobile in Preview mode)
2. Click **Update** to deploy frontend changes
3. Backend changes (database, functions) deploy automatically

Learn more: [Lovable Deployment Guide](https://docs.lovable.dev/)

## Custom Domain

Connect your custom domain in: **Project → Settings → Domains**

Note: Requires a paid Lovable plan.

## Security Best Practices

- Never share your master password
- Use strong, unique passwords for each credential
- Enable two-factor authentication where possible
- Regularly review login history
- Keep credentials organized by category
- Use the breach checker regularly
- Update weak passwords promptly

## License

This project is built with Lovable and follows standard web application licensing.

## Support

For issues or questions:
- Visit [Lovable Documentation](https://docs.lovable.dev/)
- Join [Lovable Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)

---

**Built with ❤️ using [Lovable](https://lovable.dev)**
