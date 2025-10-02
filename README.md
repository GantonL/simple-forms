# simple-forms

A modern web application built with SvelteKit + shadcn/ui v5.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- bun

### Installation

1. Install dependencies:
   ```bash
   bun install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

3. Start the development server:
   ```bash
   bun run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
simple-forms/
├── src/
│   ├── lib/
│   │   ├── components/     # Reusable components
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   └── routes/            # SvelteKit routes
├── static/                # Static assets
└── tests/                 # Test files
```

## 🛠️ Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run test` - Run tests
- `bun run lint` - Lint code
- `bun run check` - Type check

## 📚 Learn More

- [SvelteKit Documentation](https://kit.svelte.dev/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

---

*Generated with [Templates CLI](https://github.com/GantonL/templates)*