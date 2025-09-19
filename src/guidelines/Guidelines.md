# CodeTrac - Competitive Programming Tracker

## Overview
CodeTrac is a full-stack web application designed to help competitive programmers track their problem-solving journey. It features:

- **Auto-fetch functionality** for problems from Codeforces and LeetCode
- **Spaced repetition review system** for systematic problem revision
- **Progress tracking** with heatmaps and statistics
- **Catppuccin Mocha theming** with a TUI-inspired aesthetic
- **JetBrains Mono font** for that developer feel

## Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS v4
- **Backend**: Supabase Edge Functions (Hono server)
- **Database**: Supabase (PostgreSQL with KV store)
- **Authentication**: Supabase Auth
- **Styling**: Catppuccin Mocha color scheme

## Key Features
1. **Problem Management**: Add, update, and track problems from various platforms
2. **Auto-fetch**: Paste a problem URL and get details automatically
3. **Review System**: Spaced repetition algorithm for effective review
4. **Analytics**: Comprehensive dashboard with progress tracking
5. **Heatmap**: GitHub-style contribution graph for daily activity
6. **LaTeX Support**: MathJax integration for mathematical problem statements

## Design Principles
- **Monospace aesthetic**: Everything uses JetBrains Mono font
- **Dark theme**: Catppuccin Mocha throughout
- **TUI inspiration**: Terminal-like interface elements
- **Motivational design**: Gamified elements to encourage daily practice

## User Flow
1. **Authentication**: Sign up/sign in with email and password
2. **Add Problems**: Manual entry or auto-fetch from platform URLs
3. **Track Progress**: Update problem status and add notes
4. **Review System**: Systematic review using spaced repetition
5. **Analytics**: View progress through dashboard and heatmap

## Development Notes
- Uses shared Supabase client to avoid multiple instances
- Real-time API integration with proper error handling
- Responsive design with mobile considerations
- Empty states for new user onboarding