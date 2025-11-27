# Wessal - منصة وصال

Wessal is a comprehensive digital platform for the Youth and Sports Directorate of Saida province. It serves as a bridge between the directorate, associations, and the youth, providing easy access to information about accredited youth and sports associations.

## Features

- **Association Directory:** Browse and filter youth and sports associations by category or municipality.
- **Interactive Dashboards:**
  - **Admin Dashboard:** Manage all associations, users, and news.
  - **President Dashboard:** Manage own association details and upload logos.
  - **User Dashboard:** Manage favorite associations.
- **News & Activities:** Stay updated with the latest events and news.
- **Favorites:** Save associations for quick access.
- **Localization:** Full support for Arabic (RTL) and French.
- **Cloud Integration:** Uses Firebase for data/auth and Cloudflare R2 for efficient image storage.

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Build Tool:** Vite
- **Backend Services:** Firebase (Authentication, Firestore, Messaging)
- **Storage:** Cloudflare R2 (Direct browser upload)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```
