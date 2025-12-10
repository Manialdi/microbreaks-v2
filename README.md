
# Microbreaks V2

A B2B SaaS application for micro-breaks, built with Next.js, TypeScript, Supabase, and TailwindCSS.

## Features

- **Marketing Landing Page**: High-performance public page.
- **Authentication**: Email/Password and Magic Link ready using Supabase Auth.
- **Protected Dashboard**: Secured app routes ensuring only authenticated users can access.
- **Supabase Integration**: Pre-configured middleware and client/server helpers.

## Getting Started

1. **Environment Setup**:
   Copy `.env.local.example` to `.env.local` (or create it) and add your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Deployment on Vercel

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Environment Variables settings in Vercel.
4. Deploy!

## Supabase Setup

Ensure your Supabase project has Authentication enabled.
- Go to Authentication > Providers to enable Email/Password.
- Go to Authentication > URL Configuration to set your Site URL (e.g., `https://your-project.vercel.app`) and Redirect URLs (e.g., `https://your-project.vercel.app/auth/callback`).
