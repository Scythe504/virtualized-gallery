# Photo Gallery

Pre-screening assignment for the Frontend Engineering Internship at Celebrare. Built with React, Vite and Tailwind CSS.

## Setup

```bash
git clone https://github.com/Scythe504/photo-gallery
cd photo-gallery
npm install
```

If installation fails for tailwindcss:
```bash
npm install tailwindcss @tailwindcss/vite --legacy-peer-deps
```

Copy the example env file and fill in the values:
```bash
cp .env.example .env
```

Start the dev server:
```bash
npm run dev
```

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS
- TypeScript

## Features

- Fetches 30 photos from Picsum Photos API
- Real-time search filter by author name
- Favourite photos with persistence across page refreshes
- Responsive grid — 4 columns on desktop, 2 on tablet, 1 on mobile