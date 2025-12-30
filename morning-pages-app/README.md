# Morning Pages

A distraction-free writing app inspired by Julia Cameron's Morning Pages practice. Write 750 words every day, track your streak, and get AI-powered writing analysis.

![Morning Pages](https://img.shields.io/badge/words-750-gold)
![AI Powered](https://img.shields.io/badge/AI-Claude-purple)

## Features

- **Distraction-free writing** — Dark, minimal interface designed for flow
- **750-word goal tracking** — Visual progress bar and word count
- **Streak tracking** — See your current streak, longest streak, and 30-day calendar
- **Real-time analysis** — Mood detection, theme identification, vocabulary richness
- **AI Deep Analysis** — Powered by Claude for personalized craft feedback:
  - Voice observations
  - Hidden strengths
  - Primary & secondary weaknesses with exercises
  - Sentence-level revision examples
  - Reflective questions
- **Auto-save** — Your writing saves automatically to local storage

## Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/morning-pages&env=ANTHROPIC_API_KEY&envDescription=Your%20Anthropic%20API%20key%20for%20AI%20analysis&envLink=https://console.anthropic.com/)

### Manual Deployment

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/morning-pages.git
   git push -u origin main
   ```

2. **Deploy on Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variable:
     - Name: `ANTHROPIC_API_KEY`
     - Value: Your API key from [console.anthropic.com](https://console.anthropic.com/)
   - Click "Deploy"

3. **Done!** Your app will be live at `your-project.vercel.app`

## Local Development

1. **Clone and install**

   ```bash
   git clone https://github.com/YOUR_USERNAME/morning-pages.git
   cd morning-pages
   npm install
   ```

2. **Set up environment**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Anthropic API key:

   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Get Your API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Copy and paste into your environment variables

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API
- **Fonts**: EB Garamond, JetBrains Mono
- **Storage**: Browser localStorage

## Privacy

All your writing is stored locally in your browser. Nothing is sent to any server except when you explicitly click "Run Deep Analysis," which sends your text to Claude for analysis. Your writing is never stored on our servers.

## License

MIT

---

*"The pages are not about writing well. They are about writing truly."*
