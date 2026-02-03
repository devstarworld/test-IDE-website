# Continue.dev Clone - Next.js Implementation

A pixel-perfect clone of the Continue.dev website built with Next.js 16, React 19, and Tailwind CSS.

## 🚀 Features

- **Next.js App Router** - Modern file-based routing
- **React 19** - Latest React features and optimizations
- **Tailwind CSS v4** - Utility-first CSS framework
- **TypeScript** - Type-safe development
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Meta tags, Open Graph, and Twitter Cards
- **Performance Optimized** - Image optimization and lazy loading

## 📁 Project Structure

```
continue-clone/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about-us/          # About page
│   │   ├── get-in-touch/      # Contact page
│   │   ├── login/             # Login page
│   │   ├── pricing/           # Pricing page
│   │   ├── signup/            # Signup page
│   │   ├── continuedev/       # Integration pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   └── components/            # Reusable React components
│       ├── Navbar/           # Navigation component
│       ├── HeroSection/      # Hero section
│       ├── VideoSection/     # Video placeholder
│       ├── FeaturesSection/  # Features grid
│       ├── IntegrationsSection/ # Integrations showcase
│       ├── CTASection/       # Call-to-action
│       └── Footer/           # Footer component
├── public/                   # Static assets
│   └── images/              # Copied from original site
└── .env.local               # Environment variables
```

## 🛠 Tech Stack

- **Framework**: Next.js 16.1.6
- **React**: 19.2.3
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Fonts**: Inter & Manrope (Google Fonts)
- **Icons**: Heroicons & custom SVGs

## 🎨 Design System

The project maintains pixel-perfect fidelity to the original Continue.dev website:

- **Colors**: Custom CSS variables for consistent theming
- **Typography**: Inter for body text, Manrope for headings
- **Animations**: Fade-in effects and hover transitions
- **Layout**: Responsive grid system with mobile-first approach

## 🚦 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages

- **Homepage** (`/`) - Hero, features, integrations, and CTA
- **Login** (`/login`) - User authentication page
- **Signup** (`/signup`) - User registration page
- **Pricing** (`/pricing`) - Pricing plans and features
- **About Us** (`/about-us`) - Company information and team
- **Contact** (`/get-in-touch`) - Contact form and information
- **Integration Pages** (`/continuedev/*`) - Individual agent documentation

## 🔧 Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🎯 Key Features Implemented

### ✅ UI Components
- [x] Responsive navigation with mobile menu
- [x] Hero section with gradient text
- [x] Feature cards with hover effects
- [x] Integration showcase grid
- [x] Footer with social links
- [x] Call-to-action sections

### ✅ Pages
- [x] Homepage with all sections
- [x] Authentication pages (login/signup)
- [x] Pricing page with plans
- [x] About us page
- [x] Contact page
- [x] Integration detail pages

### ✅ Technical
- [x] SEO optimization
- [x] Image optimization
- [x] Responsive design
- [x] TypeScript implementation
- [x] Clean component architecture

## 🚀 Deployment

The project is ready for deployment on Vercel, Netlify, or any other Next.js-compatible platform.

```bash
npm run build
npm start
```

## 📝 Notes

- All images and assets are copied from the original Continue.dev site
- The project maintains the exact visual design and layout
- Authentication pages are styled but not functionally connected
- Integration pages are placeholder implementations
- The video section shows a placeholder (original had an embedded video)

## 🤝 Contributing

This is a clone project for demonstration purposes. The original Continue.dev website belongs to Continue, Inc.

## 📄 License

This project is for educational and demonstration purposes only. All design and content rights belong to Continue, Inc.