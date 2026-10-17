# 🌅 DAYBREAK

*Your world. In print. Every morning.*

DAYBREAK is an AI-powered personalized daily morning newspaper built with Next.js and Supabase. Instead of endless infinite-scrolling social feeds, DAYBREAK aggregates live news from top publishers, processes and categorizes stories using Google Gemini AI, and delivers a curated morning edition tailored directly to user preferences.

---

## 🚀 Key Features

* **Interactive Onboarding:** Tailor your reading profile by selecting topic desks, location focus, and reading style.
* **Database Persisted Profiles:** Onboarding preferences are synced directly to Supabase (`user_preferences` table).
* **Automated AI Ingestion Pipeline:** An automated pipeline (`/api/ingest`) fetches live RSS feeds (TechCrunch, Hacker News, BBC News), applies network fault tolerance, and cleans feed content.
* **AI Summarization & Tagging:** Uses Google Gemini AI (`gemini-2.5-flash`) to generate concise 2-sentence story summaries and automated topic tags.
* **Modern Editorial Experience:** Serif and sans typography bundled at build time via `next/font` for a distraction-free, print-inspired reading interface.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router, TypeScript, Turbopack)
* **Styling:** Tailwind CSS & Lucide Icons
* **Database:** Supabase (PostgreSQL, Row-Level Security, `@supabase/supabase-js`)
* **News Ingestion:** `rss-parser` with feed-level error trapping and timeouts
* **AI Engine:** Google Gemini AI (`gemini-2.5-flash` via `@google/genai`)

---

## 🏁 Getting Started

### 1. Installation

Clone the repository and install dependencies with the npm shortcut:

```bash
npm install