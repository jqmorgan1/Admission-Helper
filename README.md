# Admission Tracker

A web platform for high school students to track their college applications with competitive features, and for schools to discover and track potential applicants.

## Features

### For Students
- 📚 **Application Tracking** - Track schools, deadlines, and application status
- ✅ **Task Management** - Manage essays, recommendations, and other tasks
- 🏆 **Competition Leaderboard** - See how you compare with peers
- 📊 **Results Feed** - Anonymous admission results from other students
- 🎯 **Progress Analytics** - Visualize your application journey

### For Schools
- 🔍 **Student Search** - Find potential applicants by GPA, major, etc.
- 👀 **Profile Viewing** - See student progress over time
- 📈 **Analytics Dashboard** - Track applicant pools
- 💰 **Subscription Tiers** - Free, Basic, and Premium plans

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Realtime)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
cd admission-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Set up the database:
   - Go to your Supabase project's SQL Editor
   - Run the contents of `supabase/schema.sql`

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
admission-tracker/
├── app/
│   ├── auth/              # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── callback/      # OAuth callback handler
│   ├── student/           # Student dashboard
│   ├── school/            # School dashboard
│   ├── results/           # Public results feed
│   └── page.tsx           # Landing page
├── lib/
│   ├── supabase-client.ts # Client-side Supabase
│   ├── supabase-server.ts # Server-side Supabase
│   ├── database.types.ts  # TypeScript types
│   └── utils.ts           # Utility functions
├── components/             # Reusable components
└── supabase/
    └── schema.sql         # Database schema
```

## Database Schema

Key tables:
- `users` - User accounts with roles (student/school)
- `student_profiles` - Student details (GPA, SAT, etc.)
- `school_profiles` - School profiles
- `target_schools` - Student's college list
- `application_tasks` - Tasks for applications
- `admission_results` - Anonymous admission outcomes
- `school_follows` - Schools following students

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Other Platforms

The app can be deployed to any Next.js-supported platform:
- Netlify
- Railway
- Fly.io

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this for your own projects!
