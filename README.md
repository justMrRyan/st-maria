<div align="center">

# Meryam Swilem — Interior Design Portfolio

**Creating spaces that inspire.** A bespoke portfolio website for interior designer & *artiste peintre* Meryam Swilem — combining elegance, functionality, and artistic passion. Based in Tunisia.

[![Live Site](https://img.shields.io/badge/Live-meryamswilem.vercel.app-d4c5b0?style=for-the-badge&labelColor=2c1810)](https://meryamswilem.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

[Live Demo](https://meryamswilem.vercel.app/) · [Portfolio](https://meryamswilem.vercel.app/projects) · [Contact](https://meryamswilem.vercel.app/contact)

</div>

---

## Overview

A modern, fully responsive portfolio website built for **Meryam Swilem**, an interior designer and painter.

The site showcases completed interior design projects in a clean editorial layout, tells the designer's story, and gives visitors an easy way to get in touch. All portfolio content is **dynamic** — projects and photos are managed from a private admin dashboard, stored in Supabase, and served through the Next.js app.

> **Mission statement:** *"Creating beautiful, timeless interior spaces that reflect personality and lifestyle."*

---

## Features

### Public site
- **Hero landing section** — full-screen interior visual with an elegant, animated introduction.
- **About section** — designer biography, credentials (Collège LaSalle Tunis), and key stats (50+ projects, 8+ years experience).
- **Portfolio** — project gallery with category labels, image galleries, and lightbox-style browsing.
- **Dedicated portfolio page** (`/projects`) — full project grid, fetched live from Supabase.
- **Contact page** (`/contact`) — contact form (name, email, message), direct email/phone links, location, and response-time guidance.

### Content management
- **Private admin dashboard** (`/dashboard`) — protected area for the owner to create, edit, and delete projects and upload project photos.
- **Media uploads** — images are uploaded to Supabase Storage, so new work can be published without touching the code.

### Experience & quality
- **Fully responsive** — mobile-first layout with a collapsible navigation menu.
- **Smooth motion** — scroll-triggered reveals and micro-interactions for a premium feel.
- **SEO ready** — per-page metadata, Open Graph and Twitter card tags, keywords, and `robots` directives.
- **PWA manifest** (`site.webmanifest`) and favicon/apple-touch icons.
- **Branded design system** — a warm, gallery-like palette (cream `#faf8f6`, espresso `#2c1810`, sand `#d4c5b0`).

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | **Next.js** (App Router, React Server Components, Turbopack) |
| Language | **JavaScript / TypeScript**, React |
| Styling | **Tailwind CSS** (utility-first, custom brand palette) |
| Icons | **lucide-react** |
| Database | **Supabase Postgres** (project records) |
| File storage | **Supabase Storage** (public bucket for project images) |
| Hosting / CI | **Vercel** (automatic deploys from Git) |

---

## Project Structure

```text
.
├── app/
│   ├── layout.jsx          # Root layout: Navbar, Footer, metadata, fonts
│   ├── page.jsx            # Home: Hero, About, Portfolio, Contact sections
│   ├── projects/
│   │   └── page.jsx        # Full portfolio grid
│   ├── contact/
│   │   └── page.jsx        # Contact page + form
│   └── dashboard/
│       └── page.jsx        # Private admin panel (project & image management)
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── HeroSection.jsx
│   ├── AboutSection.jsx
│   ├── PortfolioSection.jsx
│   └── ContactSection.jsx
├── lib/                    # Supabase client & data helpers
├── public/
│   ├── meryam-logo.svg
│   ├── favicon.ico
│   ├── site.webmanifest
│   └── images/             # Hero, portrait, and static imagery
├── package.json
└── README.md
```

> Folder names are indicative — adjust to match your repository.

---

## Getting Started

### Prerequisites

- **Node.js** 18.18+ (Node 20 LTS recommended)
- **npm**, **yarn**, or **pnpm**
- A **Supabase** project (free tier is enough)

### 1. Clone the repository

```bash
git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPO>.git
cd <YOUR-REPO>
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```bash
# Supabase — project URL and public anon key
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Server-side only: used by the admin dashboard for writes/uploads
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Admin access to /dashboard
ADMIN_PASSWORD=<choose-a-strong-password>
```

> Never commit `.env.local`. Keep the service-role key server-side only.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The admin panel is at `/dashboard`.

### 5. Build for production

```bash
npm run build
npm run start
```

---

## Database & Storage Setup (Supabase)

1. **Create the `projects` table** in the Supabase SQL editor:

```sql
create table projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text default '',
  category    text default '',
  date        timestamptz default now(),
  images      jsonb default '[]'::jsonb,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
```

2. **Create a public storage bucket** for project photos (e.g. `MERYAMSWILEM`) and add a `projects/` folder inside it.

3. **Enable Row Level Security** and add policies so the public site can read projects while writes are limited to the admin dashboard (server-side service-role key).

---

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables from `.env.local` in **Project Settings → Environment Variables**.
4. Deploy — every push to `main` ships automatically.

---

## Customization

- **Brand colors & typography** — update the palette/theme in the Tailwind config and global styles.
- **Content** — the About copy, stats, and contact details live in their respective section components.
- **Contact form** — submissions are handled by the app's backend handler; point it at your email provider, Supabase table, or form service as needed.
- **Add a screenshot** — drop a homepage screenshot into `public/images/` and reference it at the top of this README for a nicer repo preview.

---

## Roadmap

- [ ] Client testimonials section
- [ ] Project filtering and search
- [ ] Blog / journal for design notes
- [ ] Multi-language support (English / French)

---

## Connect

**Meryam Swilem** — Interior Designer & Artiste Peintre

- ✉️ [int.designermeryamswilem@gmail.com](mailto:int.designermeryamswilem@gmail.com)
- 📞 [+216 20 392 003](tel:+21620392003)
- 📍 359 Jaafer, Route de Raoued Ariana, Raoued, Tunisia, 2083
- 🔗 [Facebook](https://www.facebook.com/INTERIORDESIGNERMERYAMSWILEM) · [Instagram](https://www.instagram.com/meryam_swilem/) · [Pinterest](https://www.pinterest.com/meryamswilem/)

---

<div align="center">

© 2026 Meryam Swilem. All rights reserved.

</div>
