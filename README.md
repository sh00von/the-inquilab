# The Inquilab — A Digital Archive of the July 2024 Student Protests in Bangladesh

**The Inquilab** is an open-source digital archive documenting the **July 2024 student protests in Bangladesh**. It collects and preserves news reports and screenshots from that period, so that the record of those weeks remains accessible and verifiable over time.

The project was co-developed by Md. Minaruzzaman Shovon and featured by *The Daily Star*.

## About the Archive

In July 2024, students across Bangladesh protested, and the events that followed became a defining moment in the country's recent history. Reporting from that period is scattered across outlets and social media, where it can be edited, taken down, or lost. This archive exists to preserve it in one place:

- **News ingestion** — a content pipeline (`scripts/ingest-news.mjs`) gathers published reports into the archive
- **Screenshot capture** — a companion tool (`scripts/capture-screenshots.mjs`) preserves visual records of pages as they appeared
- **A public web interface** — the archive is presented as a fast, searchable website built on modern web tooling

## Tech Stack

- TanStack React Start + React Router
- React 19 + TypeScript
- Vite 8, Nitro (server)
- Tailwind CSS 4
- Biome (linting/formatting), Playwright (testing)

## Getting Started

The project uses **pnpm**.

```bash
git clone https://github.com/sh00von/the-inquilab.git
cd the-inquilab
pnpm install
pnpm dev        # Vite dev server on port 3000
```

Other commands:

```bash
pnpm build      # production build
pnpm preview    # preview the build
pnpm ingest     # run the news-ingestion script
pnpm capture-screenshots   # capture page screenshots for the archive
```

## Contributing

Contributions that help preserve an accurate and complete record — additional sources, corrections, or technical improvements — are welcome.
