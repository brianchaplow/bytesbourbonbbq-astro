# SOC Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform bytesbourbonbbq.com into a living SOC dashboard with real threat data, presenting BBQ recipes as incident case files.

**Architecture:** SvelteKit SSR app with server-side API routes connecting to OpenSearch (via Tailscale) and Cloudflare. Static content from markdown files. Optional terminal easter egg using xterm.js.

**Tech Stack:** SvelteKit 2.x, TypeScript, Tailwind CSS, xterm.js, @opensearch-project/opensearch

---

## Phase 1: Project Initialization

### Task 1.1: Create SvelteKit Project

**Files:**
- Create: `bytesbourbonbbq-sveltekit/` (new directory, sibling to astro project)

**Step 1: Create new SvelteKit project**

```bash
cd /home/butcher/soc
npm create svelte@latest bytesbourbonbbq-sveltekit
```

Select options:
- Which template? → Skeleton project
- TypeScript? → Yes, using TypeScript syntax
- ESLint? → Yes
- Prettier? → Yes
- Playwright? → No
- Vitest? → Yes

**Step 2: Verify project created**

```bash
ls -la bytesbourbonbbq-sveltekit/
```

Expected: `package.json`, `svelte.config.js`, `src/`, `vite.config.ts`

**Step 3: Install dependencies**

```bash
cd bytesbourbonbbq-sveltekit && npm install
```

**Step 4: Verify dev server starts**

```bash
npm run dev -- --open
```

Expected: Browser opens to http://localhost:5173 with "Welcome to SvelteKit"

**Step 5: Commit**

```bash
git init
git add .
git commit -m "feat: initialize SvelteKit project"
```

---

### Task 1.2: Add Tailwind CSS

**Files:**
- Modify: `bytesbourbonbbq-sveltekit/package.json`
- Create: `bytesbourbonbbq-sveltekit/tailwind.config.js`
- Create: `bytesbourbonbbq-sveltekit/postcss.config.js`
- Create: `bytesbourbonbbq-sveltekit/src/app.css`
- Modify: `bytesbourbonbbq-sveltekit/src/routes/+layout.svelte`

**Step 1: Install Tailwind and dependencies**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Step 2: Configure tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        base: '#0a0a0f',
        panel: '#12121a',
        'panel-hover': '#1a1a24',
        critical: '#ff4444',
        high: '#ff8c42',
        medium: '#ffd166',
        low: '#4ade80',
        info: '#38bdf8',
        resolved: '#6b7280',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(56, 189, 248, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};
```

**Step 3: Create src/app.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

@layer base {
  body {
    @apply bg-base text-gray-100 font-sans antialiased;
  }
}

@layer components {
  .panel {
    @apply bg-panel border border-info/15 rounded-lg;
  }
  .panel:hover {
    @apply bg-panel-hover border-info/30;
  }
  .severity-critical { @apply text-critical; }
  .severity-high { @apply text-high; }
  .severity-medium { @apply text-medium; }
  .severity-low { @apply text-low; }
  .severity-info { @apply text-info; }
}
```

**Step 4: Create src/routes/+layout.svelte**

```svelte
<script lang="ts">
  import '../app.css';
</script>

<slot />
```

**Step 5: Verify Tailwind works**

Modify `src/routes/+page.svelte`:

```svelte
<div class="min-h-screen bg-base flex items-center justify-center">
  <div class="panel p-8">
    <h1 class="text-2xl font-bold text-info">SOC Dashboard</h1>
    <p class="text-gray-400 mt-2">Tailwind is working</p>
  </div>
</div>
```

Run: `npm run dev`
Expected: Dark background, cyan bordered panel, styled text

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add Tailwind CSS with SOC color palette"
```

---

### Task 1.3: Configure TypeScript Paths

**Files:**
- Modify: `bytesbourbonbbq-sveltekit/svelte.config.js`
- Modify: `bytesbourbonbbq-sveltekit/tsconfig.json`

**Step 1: Update svelte.config.js with aliases**

```javascript
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      $components: 'src/lib/components',
      $stores: 'src/lib/stores',
      $terminal: 'src/lib/terminal',
      $utils: 'src/lib/utils',
    },
  },
};

export default config;
```

**Step 2: Install Node adapter**

```bash
npm install -D @sveltejs/adapter-node
```

**Step 3: Verify TypeScript understands aliases**

Create `src/lib/utils/index.ts`:

```typescript
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
```

Import in `+page.svelte`:

```svelte
<script lang="ts">
  import { formatDate } from '$utils';
  const today = formatDate(new Date());
</script>

<p>Today: {today}</p>
```

Run: `npm run check`
Expected: No TypeScript errors

**Step 4: Commit**

```bash
git add .
git commit -m "feat: configure TypeScript paths and Node adapter"
```

---

### Task 1.4: Create Environment Configuration

**Files:**
- Create: `bytesbourbonbbq-sveltekit/.env.example`
- Create: `bytesbourbonbbq-sveltekit/.env`
- Modify: `bytesbourbonbbq-sveltekit/.gitignore`

**Step 1: Create .env.example**

```bash
# OpenSearch (via Tailscale)
OPENSEARCH_HOST=10.10.20.10
OPENSEARCH_PORT=9200
OPENSEARCH_USER=admin
OPENSEARCH_PASS=

# Cloudflare
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
```

**Step 2: Create .env with real values**

```bash
# Copy from existing HomeLab-SOC-v2/.env or config
OPENSEARCH_HOST=10.10.20.10
OPENSEARCH_PORT=9200
OPENSEARCH_USER=admin
OPENSEARCH_PASS=<your-password>

CLOUDFLARE_API_TOKEN=<your-token>
CLOUDFLARE_ACCOUNT_ID=<your-account-id>
```

**Step 3: Update .gitignore**

Add to `.gitignore`:

```
.env
.env.local
```

**Step 4: Verify env vars load**

Create `src/routes/api/health/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import { OPENSEARCH_HOST } from '$env/static/private';

export function GET() {
  return json({
    status: 'ok',
    opensearch_configured: !!OPENSEARCH_HOST,
  });
}
```

Run: `npm run dev`
Test: `curl http://localhost:5173/api/health`
Expected: `{"status":"ok","opensearch_configured":true}`

**Step 5: Commit**

```bash
git add .env.example .gitignore src/routes/api/health/
git commit -m "feat: add environment configuration"
```

---

## Phase 2: Content Migration

### Task 2.1: Set Up Markdown Processing

**Files:**
- Create: `bytesbourbonbbq-sveltekit/src/lib/content/recipes.ts`
- Create: `bytesbourbonbbq-sveltekit/src/content/recipes/` (directory)

**Step 1: Install mdsvex and frontmatter parser**

```bash
npm install -D mdsvex gray-matter
```

**Step 2: Create recipe content loader**

Create `src/lib/content/recipes.ts`:

```typescript
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export interface Recipe {
  slug: string;
  title: string;
  description: string;
  date: Date;
  image?: string;
  cyber_concept?: string;
  prep_time?: string;
  cook_time?: string;
  total_time?: string;
  servings?: string;
  difficulty?: 'easy' | 'intermediate' | 'advanced';
  tags?: string[];
  ingredients?: string[];
  instructions?: string[];
  aar?: {
    worked?: string;
    adjust?: string;
    lessons?: string;
  };
  content: string;
}

const RECIPES_DIR = 'src/content/recipes';

export function getAllRecipes(): Recipe[] {
  const files = readdirSync(RECIPES_DIR).filter((f) => f.endsWith('.md'));

  return files.map((filename) => {
    const slug = filename.replace('.md', '');
    const filepath = join(RECIPES_DIR, filename);
    const fileContent = readFileSync(filepath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      image: data.image,
      cyber_concept: data.cyber_concept,
      prep_time: data.prep_time,
      cook_time: data.cook_time,
      total_time: data.total_time,
      servings: data.servings,
      difficulty: data.difficulty,
      tags: data.tags,
      ingredients: data.ingredients,
      instructions: data.instructions,
      aar: data.aar,
      content,
    };
  }).sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  const recipes = getAllRecipes();
  return recipes.find((r) => r.slug === slug);
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add markdown recipe content loader"
```

---

### Task 2.2: Copy Recipe Content from Astro

**Files:**
- Copy: `bytesbourbonbbq-astro/src/content/recipes/*.md` → `bytesbourbonbbq-sveltekit/src/content/recipes/`

**Step 1: Create content directory**

```bash
mkdir -p src/content/recipes
```

**Step 2: Copy all recipe markdown files**

```bash
cp /home/butcher/soc/bytesbourbonbbq-astro/src/content/recipes/*.md src/content/recipes/
```

**Step 3: Verify files copied**

```bash
ls -la src/content/recipes/
```

Expected: 6 markdown files (armadillo-roll.md, cold-smoke-hot-alerts.md, etc.)

**Step 4: Test content loading**

Create `src/routes/test-content/+page.server.ts`:

```typescript
import { getAllRecipes } from '$lib/content/recipes';

export function load() {
  const recipes = getAllRecipes();
  return { recipes };
}
```

Create `src/routes/test-content/+page.svelte`:

```svelte
<script lang="ts">
  export let data;
</script>

<h1>Recipes: {data.recipes.length}</h1>
<ul>
  {#each data.recipes as recipe}
    <li>{recipe.title} - {recipe.difficulty}</li>
  {/each}
</ul>
```

Run: `npm run dev`
Visit: http://localhost:5173/test-content
Expected: List of 6 recipes with titles and difficulty

**Step 5: Commit**

```bash
git add .
git commit -m "feat: migrate recipe content from Astro"
```

---

### Task 2.3: Copy Static Assets

**Files:**
- Copy: `bytesbourbonbbq-astro/public/images/` → `bytesbourbonbbq-sveltekit/static/images/`
- Copy: `bytesbourbonbbq-astro/public/favicon.*` → `bytesbourbonbbq-sveltekit/static/`

**Step 1: Copy images directory**

```bash
cp -r /home/butcher/soc/bytesbourbonbbq-astro/public/images static/
```

**Step 2: Copy favicon files**

```bash
cp /home/butcher/soc/bytesbourbonbbq-astro/public/favicon.* static/
cp /home/butcher/soc/bytesbourbonbbq-astro/public/apple-touch-icon.png static/
```

**Step 3: Verify assets**

```bash
ls -la static/images/
ls static/favicon*
```

**Step 4: Commit**

```bash
git add static/
git commit -m "feat: copy static assets from Astro"
```

---

## Phase 3: API Layer

### Task 3.1: Create OpenSearch Client

**Files:**
- Create: `bytesbourbonbbq-sveltekit/src/lib/server/opensearch.ts`

**Step 1: Install OpenSearch client**

```bash
npm install @opensearch-project/opensearch
```

**Step 2: Create OpenSearch client wrapper**

Create `src/lib/server/opensearch.ts`:

```typescript
import { Client } from '@opensearch-project/opensearch';
import {
  OPENSEARCH_HOST,
  OPENSEARCH_PORT,
  OPENSEARCH_USER,
  OPENSEARCH_PASS,
} from '$env/static/private';

let client: Client | null = null;

export function getOpenSearchClient(): Client {
  if (!client) {
    client = new Client({
      node: `https://${OPENSEARCH_HOST}:${OPENSEARCH_PORT}`,
      auth: {
        username: OPENSEARCH_USER,
        password: OPENSEARCH_PASS,
      },
      ssl: {
        rejectUnauthorized: false, // Self-signed cert
      },
    });
  }
  return client;
}

export async function getAlertCount(hours: number = 24): Promise<number> {
  const client = getOpenSearchClient();
  const response = await client.count({
    index: 'fluentbit-default',
    body: {
      query: {
        bool: {
          filter: [
            { term: { event_type: 'alert' } },
            { range: { '@timestamp': { gte: `now-${hours}h` } } },
          ],
        },
      },
    },
  });
  return response.body.count;
}

export async function getRecentEvents(limit: number = 10): Promise<any[]> {
  const client = getOpenSearchClient();
  const response = await client.search({
    index: 'fluentbit-default',
    body: {
      size: limit,
      sort: [{ '@timestamp': 'desc' }],
      query: {
        bool: {
          should: [
            { term: { event_type: 'alert' } },
            { exists: { field: 'alert.signature' } },
          ],
        },
      },
    },
  });
  return response.body.hits.hits.map((hit: any) => hit._source);
}

export async function getBlockedIPsCount(): Promise<number> {
  const client = getOpenSearchClient();
  const response = await client.search({
    index: 'apache-parsed-v2',
    body: {
      size: 0,
      query: {
        term: { 'threat_intel.blocked': true },
      },
      aggs: {
        unique_ips: {
          cardinality: { field: 'client_ip.keyword' },
        },
      },
    },
  });
  return response.body.aggregations?.unique_ips?.value || 0;
}
```

**Step 3: Test OpenSearch connection**

Create `src/routes/api/test-opensearch/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import { getAlertCount } from '$lib/server/opensearch';

export async function GET() {
  try {
    const count = await getAlertCount(24);
    return json({ status: 'connected', alerts_24h: count });
  } catch (error) {
    return json({ status: 'error', message: String(error) }, { status: 500 });
  }
}
```

Run: `npm run dev`
Test: `curl http://localhost:5173/api/test-opensearch`
Expected: `{"status":"connected","alerts_24h":<number>}`

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add OpenSearch client with alert queries"
```

---

### Task 3.2: Create /api/soc/status Endpoint

**Files:**
- Create: `bytesbourbonbbq-sveltekit/src/routes/api/soc/status/+server.ts`

**Step 1: Create status endpoint**

Create `src/routes/api/soc/status/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import { getAlertCount } from '$lib/server/opensearch';

const QUIPS = [
  'The pit is hot. Stay vigilant.',
  'Smoke signals nominal.',
  'All systems operational. Brisket is resting.',
  'Threat level: spicy.',
  'Monitoring the perimeter. And the smoker.',
];

function getThreatLevel(alertsPerHour: number): {
  level: string;
  value: number;
  reason: string;
} {
  if (alertsPerHour < 10) {
    return { level: 'low', value: 1, reason: 'Quiet shift' };
  } else if (alertsPerHour < 30) {
    return { level: 'moderate', value: 2, reason: 'Normal activity' };
  } else if (alertsPerHour < 60) {
    return { level: 'elevated', value: 3, reason: `${alertsPerHour} alerts/hour (above baseline)` };
  } else {
    return { level: 'high', value: 4, reason: `${alertsPerHour} alerts/hour (heavy activity)` };
  }
}

export async function GET() {
  try {
    const alertsLast24h = await getAlertCount(24);
    const alertsLastHour = await getAlertCount(1);
    const threatLevel = getThreatLevel(alertsLastHour);

    return json({
      status: 'operational',
      threat_level: threatLevel.level,
      threat_level_value: threatLevel.value,
      threat_level_reason: threatLevel.reason,
      alerts_last_hour: alertsLastHour,
      alerts_last_24h: alertsLast24h,
      last_check: new Date().toISOString(),
      quip: QUIPS[Math.floor(Math.random() * QUIPS.length)],
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    return json({
      status: 'degraded',
      threat_level: 'unknown',
      threat_level_value: 0,
      threat_level_reason: 'Unable to reach OpenSearch',
      error: String(error),
    }, { status: 503 });
  }
}
```

**Step 2: Test endpoint**

Run: `npm run dev`
Test: `curl http://localhost:5173/api/soc/status | jq`

Expected response structure:
```json
{
  "status": "operational",
  "threat_level": "moderate",
  "threat_level_value": 2,
  "threat_level_reason": "Normal activity",
  "alerts_last_hour": 15,
  "alerts_last_24h": 847,
  "last_check": "2026-02-03T...",
  "quip": "The pit is hot. Stay vigilant."
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add /api/soc/status endpoint with threat level"
```

---

### Task 3.3: Create /api/soc/stats Endpoint

**Files:**
- Create: `bytesbourbonbbq-sveltekit/src/routes/api/soc/stats/+server.ts`
- Create: `bytesbourbonbbq-sveltekit/src/lib/server/cloudflare.ts`

**Step 1: Create Cloudflare client**

Create `src/lib/server/cloudflare.ts`:

```typescript
import {
  CLOUDFLARE_API_TOKEN,
  CLOUDFLARE_ACCOUNT_ID,
} from '$env/static/private';

const BASE_URL = 'https://api.cloudflare.com/client/v4';

async function cfFetch(endpoint: string): Promise<any> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Cloudflare API error: ${response.status}`);
  }

  return response.json();
}

export async function getBlockedIPsCount(): Promise<number> {
  const data = await cfFetch(
    `/accounts/${CLOUDFLARE_ACCOUNT_ID}/firewall/access_rules/rules?mode=block&per_page=1`
  );
  return data.result_info?.total_count || 0;
}

export async function getRecentBlocks(limit: number = 10): Promise<any[]> {
  const data = await cfFetch(
    `/accounts/${CLOUDFLARE_ACCOUNT_ID}/firewall/access_rules/rules?mode=block&per_page=${limit}`
  );
  return data.result || [];
}
```

**Step 2: Create stats endpoint**

Create `src/routes/api/soc/stats/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import { getAlertCount, getBlockedIPsCount as getOSBlockedCount } from '$lib/server/opensearch';
import { getBlockedIPsCount as getCFBlockedCount } from '$lib/server/cloudflare';
import { getAllRecipes } from '$lib/content/recipes';

export async function GET() {
  try {
    const [alertsTotal, alertsLast24h, blockedIPs, recipes] = await Promise.all([
      getAlertCount(24 * 365), // Approximate total
      getAlertCount(24),
      getCFBlockedCount(),
      Promise.resolve(getAllRecipes()),
    ]);

    return json({
      ips_blocked: {
        total: blockedIPs,
      },
      ids_rules: {
        total: 47487, // Static for now, could query Suricata
        custom: 10,
      },
      alerts: {
        total: alertsTotal,
        last_24h: alertsLast24h,
      },
      incidents_open: recipes.length,
      zeek_status: 'capturing',
      suricata_status: 'running',
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300', // 5 min cache
      },
    });
  } catch (error) {
    return json({ error: String(error) }, { status: 500 });
  }
}
```

**Step 3: Test endpoint**

Run: `npm run dev`
Test: `curl http://localhost:5173/api/soc/stats | jq`

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add /api/soc/stats endpoint with Cloudflare integration"
```

---

### Task 3.4: Create /api/soc/activity Endpoint

**Files:**
- Create: `bytesbourbonbbq-sveltekit/src/routes/api/soc/activity/+server.ts`

**Step 1: Create activity endpoint**

Create `src/routes/api/soc/activity/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import { getRecentEvents } from '$lib/server/opensearch';

interface ActivityEvent {
  timestamp: string;
  type: 'alert' | 'block' | 'scan';
  icon: string;
  message: string;
  detail: string;
}

function formatEvent(event: any): ActivityEvent {
  const timestamp = event['@timestamp'];

  if (event.alert?.signature) {
    const severity = event.alert?.severity || 3;
    const icon = severity === 1 ? '🔴' : severity === 2 ? '🟠' : '🟡';

    return {
      timestamp,
      type: 'alert',
      icon,
      message: event.alert.signature,
      detail: `${event.src_ip || 'unknown'} → ${event.dest_ip || 'unknown'}`,
    };
  }

  if (event.threat_intel?.blocked) {
    return {
      timestamp,
      type: 'block',
      icon: '🔴',
      message: `${event.client_ip} blocked`,
      detail: `AbuseIPDB: ${event.threat_intel?.abuseipdb?.score || '?'}`,
    };
  }

  return {
    timestamp,
    type: 'scan',
    icon: '🔵',
    message: 'Network event',
    detail: `${event.src_ip || '?'} → ${event.dest_ip || '?'}`,
  };
}

export async function GET({ url }) {
  const limit = parseInt(url.searchParams.get('limit') || '10');

  try {
    const events = await getRecentEvents(Math.min(limit, 50));
    const formatted = events.map(formatEvent);

    return json({
      events: formatted,
      count: formatted.length,
      fetched_at: new Date().toISOString(),
    });
  } catch (error) {
    return json({ error: String(error), events: [] }, { status: 500 });
  }
}
```

**Step 2: Test endpoint**

Run: `npm run dev`
Test: `curl "http://localhost:5173/api/soc/activity?limit=5" | jq`

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add /api/soc/activity endpoint for recent events"
```

---

## Phase 4: Svelte Stores

### Task 4.1: Create SOC Data Store

**Files:**
- Create: `bytesbourbonbbq-sveltekit/src/lib/stores/soc.ts`

**Step 1: Create the store**

Create `src/lib/stores/soc.ts`:

```typescript
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

interface SOCStatus {
  status: string;
  threat_level: string;
  threat_level_value: number;
  threat_level_reason: string;
  alerts_last_hour: number;
  alerts_last_24h: number;
  last_check: string;
  quip: string;
}

interface SOCStats {
  ips_blocked: { total: number };
  ids_rules: { total: number; custom: number };
  alerts: { total: number; last_24h: number };
  incidents_open: number;
  zeek_status: string;
  suricata_status: string;
}

interface ActivityEvent {
  timestamp: string;
  type: string;
  icon: string;
  message: string;
  detail: string;
}

// Stores
export const socStatus = writable<SOCStatus | null>(null);
export const socStats = writable<SOCStats | null>(null);
export const recentActivity = writable<ActivityEvent[]>([]);
export const isLoading = writable(true);
export const lastError = writable<string | null>(null);

// Derived
export const threatLevelColor = derived(socStatus, ($status) => {
  if (!$status) return 'gray';
  switch ($status.threat_level) {
    case 'low': return 'low';
    case 'moderate': return 'medium';
    case 'elevated': return 'high';
    case 'high': return 'critical';
    default: return 'gray';
  }
});

// Fetch functions
export async function fetchStatus() {
  try {
    const res = await fetch('/api/soc/status');
    const data = await res.json();
    socStatus.set(data);
    lastError.set(null);
  } catch (e) {
    lastError.set(String(e));
  }
}

export async function fetchStats() {
  try {
    const res = await fetch('/api/soc/stats');
    const data = await res.json();
    socStats.set(data);
  } catch (e) {
    lastError.set(String(e));
  }
}

export async function fetchActivity() {
  try {
    const res = await fetch('/api/soc/activity?limit=10');
    const data = await res.json();
    recentActivity.set(data.events || []);
  } catch (e) {
    lastError.set(String(e));
  }
}

export async function initializeSOC() {
  isLoading.set(true);
  await Promise.all([fetchStatus(), fetchStats(), fetchActivity()]);
  isLoading.set(false);
}

// Auto-refresh (browser only)
let statusInterval: ReturnType<typeof setInterval>;
let activityInterval: ReturnType<typeof setInterval>;

export function startPolling() {
  if (!browser) return;

  statusInterval = setInterval(fetchStatus, 60000); // 1 min
  activityInterval = setInterval(fetchActivity, 30000); // 30 sec
}

export function stopPolling() {
  clearInterval(statusInterval);
  clearInterval(activityInterval);
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add SOC data stores with polling"
```

---

## Phase 5: Layout Components

### Task 5.1: Create Header Component

**Files:**
- Create: `bytesbourbonbbq-sveltekit/src/lib/components/Header.svelte`

**Step 1: Create Header component**

Create `src/lib/components/Header.svelte`:

```svelte
<script lang="ts">
  import { socStatus, threatLevelColor } from '$stores/soc';

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/recipes', label: 'Incidents' },
    { href: '/about', label: 'About' },
  ];
</script>

<header class="sticky top-0 z-50 border-b border-info/10 bg-base/95 backdrop-blur">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-3 group">
        <span class="text-xl font-bold text-gray-100 group-hover:text-info transition-colors">
          BYTES•BOURBON•BBQ
        </span>
      </a>

      <!-- Nav -->
      <nav class="hidden md:flex items-center gap-6">
        {#each navItems as item}
          <a
            href={item.href}
            class="text-sm text-gray-400 hover:text-info transition-colors"
          >
            {item.label}
          </a>
        {/each}
      </nav>

      <!-- Status Indicator -->
      <div class="flex items-center gap-3">
        {#if $socStatus}
          <div class="flex items-center gap-2 text-sm">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-{$threatLevelColor} opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-{$threatLevelColor}"></span>
            </span>
            <span class="text-gray-400">SOC:</span>
            <span class="text-{$threatLevelColor} uppercase font-mono text-xs">
              {$socStatus.status}
            </span>
          </div>
        {/if}
      </div>
    </div>
  </div>
</header>
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add Header component with status indicator"
```

---

### Task 5.2: Create Sidebar Component

**Files:**
- Create: `bytesbourbonbbq-sveltekit/src/lib/components/Sidebar.svelte`

**Step 1: Create Sidebar component**

Create `src/lib/components/Sidebar.svelte`:

```svelte
<script lang="ts">
  import { socStats, recentActivity } from '$stores/soc';

  function formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<aside class="w-64 border-r border-info/10 bg-panel/50 p-4 hidden lg:block">
  <!-- Live Stats -->
  <div class="space-y-4">
    <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      Live Stats
    </h2>

    {#if $socStats}
      <div class="space-y-3">
        <div class="panel p-3">
          <div class="text-2xl font-bold text-critical font-mono">
            {$socStats.ips_blocked.total.toLocaleString()}
          </div>
          <div class="text-xs text-gray-500">IPs Blocked</div>
        </div>

        <div class="panel p-3">
          <div class="text-2xl font-bold text-medium font-mono">
            {$socStats.ids_rules.total.toLocaleString()}
          </div>
          <div class="text-xs text-gray-500">IDS Rules</div>
        </div>

        <div class="panel p-3">
          <div class="text-2xl font-bold text-low font-mono">
            {$socStats.incidents_open}
          </div>
          <div class="text-xs text-gray-500">Cases Open</div>
        </div>
      </div>
    {:else}
      <div class="text-gray-500 text-sm">Loading...</div>
    {/if}
  </div>

  <!-- Recent Activity -->
  <div class="mt-8 space-y-4">
    <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      Recent Activity
    </h2>

    <div class="space-y-2 text-xs">
      {#each $recentActivity.slice(0, 5) as event}
        <div class="flex items-start gap-2 text-gray-400">
          <span class="text-gray-600 font-mono">{formatTime(event.timestamp)}</span>
          <span>{event.icon}</span>
          <span class="truncate">{event.message}</span>
        </div>
      {/each}
    </div>

    <a href="/activity" class="text-xs text-info hover:underline">
      View All →
    </a>
  </div>
</aside>
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add Sidebar component with live stats"
```

---

### Task 5.3: Create Main Layout

**Files:**
- Modify: `bytesbourbonbbq-sveltekit/src/routes/+layout.svelte`
- Create: `bytesbourbonbbq-sveltekit/src/routes/+layout.ts`

**Step 1: Create layout load function**

Create `src/routes/+layout.ts`:

```typescript
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
  // Pre-fetch SOC data on server
  const [statusRes, statsRes] = await Promise.all([
    fetch('/api/soc/status'),
    fetch('/api/soc/stats'),
  ]);

  const [status, stats] = await Promise.all([
    statusRes.json(),
    statsRes.json(),
  ]);

  return { initialStatus: status, initialStats: stats };
};
```

**Step 2: Update layout component**

Update `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
  import '../app.css';
  import Header from '$components/Header.svelte';
  import Sidebar from '$components/Sidebar.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { socStatus, socStats, initializeSOC, startPolling, stopPolling } from '$stores/soc';

  export let data;

  // Initialize stores with SSR data
  $: if (data.initialStatus) socStatus.set(data.initialStatus);
  $: if (data.initialStats) socStats.set(data.initialStats);

  onMount(() => {
    initializeSOC();
    startPolling();
  });

  onDestroy(() => {
    stopPolling();
  });
</script>

<div class="min-h-screen flex flex-col">
  <Header />

  <div class="flex flex-1">
    <Sidebar />

    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>

  <footer class="border-t border-info/10 py-4 px-6 text-center text-xs text-gray-600">
    <span>© 2026 Bytes • Bourbon • BBQ</span>
    <span class="mx-2">•</span>
    <span class="text-gray-700">Press <kbd class="font-mono bg-panel px-1 rounded">`</kbd> for analyst mode</span>
  </footer>
</div>
```

**Step 3: Verify layout works**

Run: `npm run dev`
Visit: http://localhost:5173
Expected: Header, sidebar with live stats, main content area, footer

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add main layout with header, sidebar, footer"
```

---

## Phase 6: Dashboard Components

### Task 6.1: Create ThreatLevel Component

**Files:**
- Create: `bytesbourbonbbq-sveltekit/src/lib/components/ThreatLevel.svelte`

**Step 1: Create ThreatLevel component**

Create `src/lib/components/ThreatLevel.svelte`:

```svelte
<script lang="ts">
  import { socStatus, threatLevelColor } from '$stores/soc';

  const levelBars: Record<string, number> = {
    low: 1,
    moderate: 2,
    elevated: 3,
    high: 4,
  };
</script>

{#if $socStatus}
  <div class="panel p-6 animate-glow">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Threat Level
      </h2>
      <span class="text-xs text-gray-600 font-mono">
        {new Date($socStatus.last_check).toLocaleTimeString()}
      </span>
    </div>

    <div class="flex items-center gap-4">
      <!-- Level Bars -->
      <div class="flex gap-1">
        {#each [1, 2, 3, 4] as level}
          <div
            class="w-4 h-8 rounded-sm transition-colors duration-300"
            class:bg-low={level <= levelBars[$socStatus.threat_level] && $socStatus.threat_level === 'low'}
            class:bg-medium={level <= levelBars[$socStatus.threat_level] && $socStatus.threat_level === 'moderate'}
            class:bg-high={level <= levelBars[$socStatus.threat_level] && $socStatus.threat_level === 'elevated'}
            class:bg-critical={level <= levelBars[$socStatus.threat_level] && $socStatus.threat_level === 'high'}
            class:bg-gray-800={level > levelBars[$socStatus.threat_level]}
          />
        {/each}
      </div>

      <!-- Level Text -->
      <div>
        <div class="text-2xl font-bold text-{$threatLevelColor} uppercase">
          {$socStatus.threat_level}
        </div>
        <div class="text-sm text-gray-500">
          {$socStatus.threat_level_reason}
        </div>
      </div>
    </div>

    <!-- Quip -->
    <p class="mt-4 text-sm text-gray-400 italic border-t border-info/10 pt-4">
      "{$socStatus.quip}"
    </p>
  </div>
{/if}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add ThreatLevel component with animated bars"
```

---

### Task 6.2: Create IncidentCard Component

**Files:**
- Create: `bytesbourbonbbq-sveltekit/src/lib/components/incidents/IncidentCard.svelte`

**Step 1: Create IncidentCard component**

Create `src/lib/components/incidents/IncidentCard.svelte`:

```svelte
<script lang="ts">
  import type { Recipe } from '$lib/content/recipes';

  export let recipe: Recipe;
  export let index: number = 0;

  const severityMap: Record<string, { color: string; bars: number }> = {
    easy: { color: 'low', bars: 1 },
    intermediate: { color: 'medium', bars: 2 },
    advanced: { color: 'high', bars: 3 },
  };

  $: severity = severityMap[recipe.difficulty || 'intermediate'];
  $: caseId = `INC-${String(index + 1).padStart(3, '0')}`;
</script>

<a
  href="/recipes/{recipe.slug}"
  class="panel p-4 block hover:border-info/40 transition-all group"
>
  <!-- Header -->
  <div class="flex items-center justify-between mb-3">
    <span class="font-mono text-xs text-gray-500">{caseId}</span>
    <span class="flex items-center gap-1">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-{severity.color} opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-{severity.color}"></span>
      </span>
      <span class="text-xs text-gray-500">ACTIVE</span>
    </span>
  </div>

  <!-- Image -->
  {#if recipe.image}
    <div class="aspect-video rounded overflow-hidden mb-3 bg-panel">
      <img
        src={recipe.image}
        alt={recipe.title}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
  {/if}

  <!-- Title -->
  <h3 class="font-semibold text-gray-100 group-hover:text-info transition-colors line-clamp-2">
    {recipe.title}
  </h3>

  <!-- Meta -->
  <div class="mt-2 flex items-center gap-3 text-xs text-gray-500">
    <span class="flex gap-0.5">
      {#each Array(3) as _, i}
        <span
          class="w-2 h-2 rounded-sm"
          class:bg-{severity.color}={i < severity.bars}
          class:bg-gray-700={i >= severity.bars}
        />
      {/each}
    </span>
    <span>TTR: {recipe.total_time || recipe.cook_time || '?'}</span>
  </div>

  <!-- Classification -->
  {#if recipe.cyber_concept}
    <div class="mt-2">
      <span class="text-xs px-2 py-0.5 rounded-full bg-info/10 text-info">
        {recipe.cyber_concept}
      </span>
    </div>
  {/if}
</a>
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add IncidentCard component for recipe display"
```

---

### Task 6.3: Build Homepage Dashboard

**Files:**
- Modify: `bytesbourbonbbq-sveltekit/src/routes/+page.svelte`
- Create: `bytesbourbonbbq-sveltekit/src/routes/+page.server.ts`

**Step 1: Create page server load**

Create `src/routes/+page.server.ts`:

```typescript
import { getAllRecipes } from '$lib/content/recipes';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const recipes = getAllRecipes();
  const featured = recipes.slice(0, 3);

  return { recipes: featured };
};
```

**Step 2: Update homepage**

Update `src/routes/+page.svelte`:

```svelte
<script lang="ts">
  import ThreatLevel from '$components/ThreatLevel.svelte';
  import IncidentCard from '$components/incidents/IncidentCard.svelte';
  import { recentActivity } from '$stores/soc';

  export let data;
</script>

<svelte:head>
  <title>SOC Dashboard | Bytes • Bourbon • BBQ</title>
</svelte:head>

<div class="space-y-6">
  <!-- Threat Level Banner -->
  <ThreatLevel />

  <!-- Active Incidents -->
  <section>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-200">Active Incidents</h2>
      <a href="/recipes" class="text-sm text-info hover:underline">View All →</a>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each data.recipes as recipe, i}
        <IncidentCard {recipe} index={i} />
      {/each}
    </div>
  </section>

  <!-- Intel Feed -->
  <section class="panel p-4">
    <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
      Intel Feed
    </h2>

    <div class="space-y-2 font-mono text-sm">
      {#each $recentActivity.slice(0, 5) as event}
        <div class="flex items-center gap-3 text-gray-400 py-1 border-b border-info/5 last:border-0">
          <span>{event.icon}</span>
          <span class="text-gray-500 text-xs">
            {new Date(event.timestamp).toLocaleTimeString()}
          </span>
          <span class="text-gray-300">{event.message}</span>
          <span class="text-gray-600 text-xs ml-auto">{event.detail}</span>
        </div>
      {/each}
    </div>
  </section>
</div>
```

**Step 3: Verify homepage**

Run: `npm run dev`
Visit: http://localhost:5173
Expected: Threat level banner, 3 incident cards, intel feed

**Step 4: Commit**

```bash
git add .
git commit -m "feat: build homepage dashboard with incidents and intel feed"
```

---

## Phase 7: Recipe Pages

### Task 7.1: Build Alert Queue (Recipe Index)

**Files:**
- Create: `bytesbourbonbbq-sveltekit/src/routes/recipes/+page.server.ts`
- Create: `bytesbourbonbbq-sveltekit/src/routes/recipes/+page.svelte`

**Step 1: Create page server**

Create `src/routes/recipes/+page.server.ts`:

```typescript
import { getAllRecipes } from '$lib/content/recipes';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const recipes = getAllRecipes();
  return { recipes };
};
```

**Step 2: Create alert queue page**

Create `src/routes/recipes/+page.svelte`:

```svelte
<script lang="ts">
  import IncidentCard from '$components/incidents/IncidentCard.svelte';

  export let data;

  let severityFilter = 'all';
  let sortBy = 'date';

  $: filteredRecipes = data.recipes
    .filter(r => severityFilter === 'all' || r.difficulty === severityFilter)
    .sort((a, b) => {
      if (sortBy === 'date') return b.date.getTime() - a.date.getTime();
      return a.title.localeCompare(b.title);
    });
</script>

<svelte:head>
  <title>Alert Queue | Bytes • Bourbon • BBQ</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-100">Alert Queue</h1>
    <span class="text-sm text-gray-500">{filteredRecipes.length} incidents</span>
  </div>

  <!-- Filters -->
  <div class="flex gap-4 flex-wrap">
    <div class="flex gap-2">
      <button
        class="px-3 py-1 text-sm rounded-full transition-colors"
        class:bg-info={severityFilter === 'all'}
        class:text-base={severityFilter === 'all'}
        class:bg-panel={severityFilter !== 'all'}
        class:text-gray-400={severityFilter !== 'all'}
        on:click={() => severityFilter = 'all'}
      >
        All
      </button>
      <button
        class="px-3 py-1 text-sm rounded-full transition-colors"
        class:bg-high={severityFilter === 'advanced'}
        class:text-base={severityFilter === 'advanced'}
        class:bg-panel={severityFilter !== 'advanced'}
        class:text-gray-400={severityFilter !== 'advanced'}
        on:click={() => severityFilter = 'advanced'}
      >
        High
      </button>
      <button
        class="px-3 py-1 text-sm rounded-full transition-colors"
        class:bg-medium={severityFilter === 'intermediate'}
        class:text-base={severityFilter === 'intermediate'}
        class:bg-panel={severityFilter !== 'intermediate'}
        class:text-gray-400={severityFilter !== 'intermediate'}
        on:click={() => severityFilter = 'intermediate'}
      >
        Medium
      </button>
      <button
        class="px-3 py-1 text-sm rounded-full transition-colors"
        class:bg-low={severityFilter === 'easy'}
        class:text-base={severityFilter === 'easy'}
        class:bg-panel={severityFilter !== 'easy'}
        class:text-gray-400={severityFilter !== 'easy'}
        on:click={() => severityFilter = 'easy'}
      >
        Low
      </button>
    </div>
  </div>

  <!-- Grid -->
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each filteredRecipes as recipe, i}
      <IncidentCard {recipe} index={i} />
    {/each}
  </div>
</div>
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add recipe index page as alert queue with filters"
```

---

### Task 7.2: Build Case File (Recipe Detail)

**Files:**
- Create: `bytesbourbonbbq-sveltekit/src/routes/recipes/[slug]/+page.server.ts`
- Create: `bytesbourbonbbq-sveltekit/src/routes/recipes/[slug]/+page.svelte`

**Step 1: Create page server**

Create `src/routes/recipes/[slug]/+page.server.ts`:

```typescript
import { getRecipeBySlug, getAllRecipes } from '$lib/content/recipes';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const recipe = getRecipeBySlug(params.slug);

  if (!recipe) {
    throw error(404, 'Case file not found');
  }

  const allRecipes = getAllRecipes();
  const index = allRecipes.findIndex(r => r.slug === params.slug);

  return { recipe, caseNumber: index + 1 };
};
```

**Step 2: Create case file page**

Create `src/routes/recipes/[slug]/+page.svelte`:

```svelte
<script lang="ts">
  export let data;

  $: recipe = data.recipe;
  $: caseId = `INC-${new Date(recipe.date).getFullYear()}-${String(new Date(recipe.date).getMonth() + 1).padStart(2, '0')}${String(new Date(recipe.date).getDate()).padStart(2, '0')}-${String(data.caseNumber).padStart(3, '0')}`;

  const severityMap: Record<string, { label: string; color: string; bars: number }> = {
    easy: { label: 'LOW', color: 'low', bars: 1 },
    intermediate: { label: 'MEDIUM', color: 'medium', bars: 2 },
    advanced: { label: 'HIGH', color: 'high', bars: 3 },
  };

  $: severity = severityMap[recipe.difficulty || 'intermediate'];
</script>

<svelte:head>
  <title>{recipe.title} | Case File</title>
</svelte:head>

<article class="max-w-4xl mx-auto space-y-6">
  <!-- Case Header -->
  <div class="panel p-6">
    <div class="flex items-center justify-between mb-4">
      <span class="font-mono text-sm text-gray-500">{caseId}</span>
      <span class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-low"></span>
        <span class="text-xs text-gray-400">RESOLVED</span>
      </span>
    </div>

    <h1 class="text-3xl font-bold text-gray-100 mb-2">{recipe.title}</h1>

    {#if recipe.cyber_concept}
      <div class="text-info text-sm mb-4">Classification: {recipe.cyber_concept}</div>
    {/if}

    <!-- Meta Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-info/10">
      <div>
        <div class="text-xs text-gray-500 uppercase">Opened</div>
        <div class="font-mono text-sm">{new Date(recipe.date).toLocaleDateString()}</div>
      </div>
      <div>
        <div class="text-xs text-gray-500 uppercase">TTR</div>
        <div class="font-mono text-sm">{recipe.total_time || recipe.cook_time || 'N/A'}</div>
      </div>
      <div>
        <div class="text-xs text-gray-500 uppercase">Yield</div>
        <div class="font-mono text-sm">{recipe.servings || 'N/A'}</div>
      </div>
      <div>
        <div class="text-xs text-gray-500 uppercase">Severity</div>
        <div class="flex items-center gap-2">
          <span class="flex gap-0.5">
            {#each Array(3) as _, i}
              <span
                class="w-2 h-3 rounded-sm"
                class:bg-{severity.color}={i < severity.bars}
                class:bg-gray-700={i >= severity.bars}
              />
            {/each}
          </span>
          <span class="text-{severity.color} text-sm font-mono">{severity.label}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Hero Image -->
  {#if recipe.image}
    <div class="rounded-lg overflow-hidden">
      <img src={recipe.image} alt={recipe.title} class="w-full" />
    </div>
  {/if}

  <!-- Executive Summary -->
  <div class="panel p-6">
    <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
      Executive Summary
    </h2>
    <p class="text-gray-300">{recipe.description}</p>
  </div>

  <!-- IOCs -->
  {#if recipe.ingredients?.length}
    <div class="panel p-6">
      <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        IOCs (Indicators of Cookery)
      </h2>
      <ul class="grid md:grid-cols-2 gap-2">
        {#each recipe.ingredients as ingredient}
          <li class="flex items-start gap-2 text-gray-300">
            <span class="text-info">•</span>
            {ingredient}
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  <!-- Response Playbook -->
  {#if recipe.instructions?.length}
    <div class="panel p-6">
      <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Response Playbook
      </h2>
      <ol class="space-y-3">
        {#each recipe.instructions as step, i}
          <li class="flex gap-4">
            <span class="flex-shrink-0 w-8 h-8 rounded bg-info/10 text-info flex items-center justify-center text-sm font-mono">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span class="text-gray-300 pt-1">{step}</span>
          </li>
        {/each}
      </ol>
    </div>
  {/if}

  <!-- AAR -->
  {#if recipe.aar}
    <div class="panel p-6">
      <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        After Action Report
      </h2>
      <div class="space-y-4">
        {#if recipe.aar.worked}
          <div class="p-4 rounded bg-low/10 border border-low/20">
            <h3 class="text-sm font-semibold text-low uppercase mb-2">What Worked</h3>
            <p class="text-gray-300 text-sm">{recipe.aar.worked}</p>
          </div>
        {/if}
        {#if recipe.aar.adjust}
          <div class="p-4 rounded bg-medium/10 border border-medium/20">
            <h3 class="text-sm font-semibold text-medium uppercase mb-2">Adjustments</h3>
            <p class="text-gray-300 text-sm">{recipe.aar.adjust}</p>
          </div>
        {/if}
        {#if recipe.aar.lessons}
          <div class="p-4 rounded bg-info/10 border border-info/20">
            <h3 class="text-sm font-semibold text-info uppercase mb-2">Lessons Learned</h3>
            <p class="text-gray-300 text-sm">{recipe.aar.lessons}</p>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Back Link -->
  <div class="pt-4">
    <a href="/recipes" class="text-info hover:underline text-sm">
      ← Back to Alert Queue
    </a>
  </div>
</article>
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add recipe detail page as incident case file"
```

---

## Phase 8: Terminal Easter Egg

### Task 8.1: Install xterm.js

**Files:**
- Modify: `bytesbourbonbbq-sveltekit/package.json`

**Step 1: Install xterm.js**

```bash
npm install xterm xterm-addon-fit
```

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add xterm.js dependencies"
```

---

### Task 8.2: Create Terminal Commands

**Files:**
- Create: `bytesbourbonbbq-sveltekit/src/lib/terminal/commands.ts`
- Create: `bytesbourbonbbq-sveltekit/src/lib/terminal/responses.ts`

**Step 1: Create humorous responses**

Create `src/lib/terminal/responses.ts`:

```typescript
export const maliciousResponses: Record<string, string> = {
  'rm -rf /': `
╔══════════════════════════════════════════════════════════════╗
║  NICE TRY, HOTSHOT                                           ║
╠══════════════════════════════════════════════════════════════╣
║  I see you've chosen violence today.                         ║
║                                                              ║
║  This terminal runs in a browser. The only thing you're      ║
║  deleting is your credibility.                               ║
║                                                              ║
║  Incident logged. Your IP has been noted.*                   ║
║  *Just kidding. But I am judging you.                        ║
╚══════════════════════════════════════════════════════════════╝`,

  'sudo': `I don't know who told you that you have root here, but they lied.

This is a BBQ website. The only root you're getting is root vegetables
in my next brisket rub recipe.`,

  'chmod 777': `Ah yes, the "make everything terrible" command.

Tell me you learned Linux from Stack Overflow without telling me
you learned Linux from Stack Overflow.`,

  'cat /etc/passwd': `root:x:0:0:Pitmaster:/root:/bin/bash
brisket:x:1000:1000:Low and Slow:/home/brisket:/bin/smoke
ribs:x:1001:1001:Fall Off Bone:/home/ribs:/bin/wrap
chicken:x:1002:1002:Crispy Skin:/home/chicken:/bin/spatchcock

What were you expecting, exactly?`,

  'cat /etc/shadow': `██████████████████████████████████████████████████

Redacted. Obviously.

But I appreciate the audacity.`,

  'whoami': `A person who found the secret terminal on a BBQ website
and immediately tried to break it.

I respect the hustle.`,

  'id': `uid=1337(hungry-visitor) gid=1337(bbq-enthusiasts) groups=1337(bbq-enthusiasts),42(meat-sweats)`,

  'pwd': `/home/pitmaster/why-are-you-like-this`,

  'nmap': `Scanning... scanning... scanning...

PORT      STATE    SERVICE
80/tcp    open     delicious-recipes
443/tcp   open     even-more-recipes
8080/tcp  closed   no-recipes-here

Vulnerability detected: You're hungry. Recommend: cat incidents/`,

  'sqlmap': `[*] Starting injection test...
[!] Target appears to be a static website
[!] No database detected
[!] Only things detected: BBQ recipes and questionable life choices
[*] Recommend trying: help`,

  'hack the planet': `HACK THE PLANET!

...okay I respect the Hackers (1995) reference.

Try: help`,

  'vim': `*opens vim*

You are now trapped forever.

Just kidding. But if this were real vim, you'd never leave.

(Try: help)`,

  'emacs': `We don't do that here.`,

  'please': `Since you asked nicely: help`,

  'thank you': `You're welcome.

Seriously, thanks for visiting. Hope you find a recipe you like.

Try: ls incidents/`,
};

export function getMaliciousResponse(input: string): string | null {
  const lower = input.toLowerCase().trim();

  // Check exact matches first
  if (maliciousResponses[lower]) {
    return maliciousResponses[lower];
  }

  // Check partial matches
  for (const [key, response] of Object.entries(maliciousResponses)) {
    if (lower.includes(key)) {
      return response;
    }
  }

  // SQL injection patterns
  if (lower.includes("'") && (lower.includes('or') || lower.includes('drop') || lower.includes('select'))) {
    return `ERROR 1337: Table 'incidents' is protected by a dry rub barrier.

Also this is a static site. There is no database.

But if there were, I'd be impressed you tried.`;
  }

  // XSS patterns
  if (lower.includes('<script') || lower.includes('javascript:')) {
    return `I see you've chosen chaos.

This terminal sanitizes input like I sanitize my cutting boards:
thoroughly and with mild disappointment in humanity.

The only scripts running here are my mise en place checklists.`;
  }

  return null;
}
```

**Step 2: Create command handler**

Create `src/lib/terminal/commands.ts`:

```typescript
import { getMaliciousResponse } from './responses';

export interface CommandResult {
  output: string;
  clear?: boolean;
  navigate?: string;
}

export async function executeCommand(
  input: string,
  context: { recipes: any[]; socStatus: any }
): Promise<CommandResult> {
  const trimmed = input.trim();
  const [cmd, ...args] = trimmed.split(/\s+/);

  // Check for malicious commands first
  const maliciousResponse = getMaliciousResponse(trimmed);
  if (maliciousResponse) {
    return { output: maliciousResponse };
  }

  switch (cmd.toLowerCase()) {
    case 'help':
      return {
        output: `
BBBQ-SOC Terminal v2.1.0

NAVIGATION
  ls [path]        List incidents or sections
  cat <incident>   Read case file
  open <incident>  Open in GUI mode
  gui              Switch to GUI mode

LIVE DATA
  status           Show SOC operational status

META
  help             Show this help
  clear            Clear terminal
  about            About this site

Try: ls incidents/`,
      };

    case 'clear':
      return { output: '', clear: true };

    case 'gui':
      return { output: 'Switching to GUI mode...', navigate: '/' };

    case 'status':
      if (context.socStatus) {
        return {
          output: `
╔══════════════════════════════════════════════════════════════╗
║  HOMELAB SOC STATUS                                          ║
╠══════════════════════════════════════════════════════════════╣
║  Status:        ${context.socStatus.status.toUpperCase().padEnd(40)}║
║  Threat Level:  ${context.socStatus.threat_level.toUpperCase().padEnd(40)}║
║  Alerts (1h):   ${String(context.socStatus.alerts_last_hour).padEnd(40)}║
║  Alerts (24h):  ${String(context.socStatus.alerts_last_24h).padEnd(40)}║
╚══════════════════════════════════════════════════════════════╝

"${context.socStatus.quip}"`,
        };
      }
      return { output: 'Unable to fetch SOC status. Try again.' };

    case 'ls':
      const path = args[0] || '';
      if (path === 'incidents/' || path === 'incidents') {
        const list = context.recipes
          .map((r, i) => `INC-${String(i + 1).padStart(3, '0')}   ${r.difficulty?.toUpperCase().padEnd(8) || 'MED     '}   ${r.slug}`)
          .join('\n');
        return { output: list };
      }
      return { output: 'incidents/\nabout.txt' };

    case 'cat':
      const target = args[0];
      if (target) {
        const recipe = context.recipes.find(r =>
          r.slug === target ||
          target.includes(r.slug) ||
          `INC-${String(context.recipes.indexOf(r) + 1).padStart(3, '0')}` === target.toUpperCase()
        );
        if (recipe) {
          return {
            output: `
══════════════════════════════════════════════════════════════
 INCIDENT REPORT: ${recipe.slug}
══════════════════════════════════════════════════════════════

 Title:          ${recipe.title}
 Classification: ${recipe.cyber_concept || 'N/A'}
 Severity:       ${recipe.difficulty?.toUpperCase() || 'MEDIUM'}
 TTR:            ${recipe.total_time || recipe.cook_time || 'N/A'}

 EXECUTIVE SUMMARY
 ─────────────────
 ${recipe.description}

 Use 'open ${recipe.slug}' to view full case file in GUI.`,
          };
        }
        return { output: `cat: ${target}: No such file or directory` };
      }
      return { output: 'Usage: cat <incident-id or slug>' };

    case 'open':
      const slug = args[0];
      if (slug) {
        const recipe = context.recipes.find(r => r.slug === slug);
        if (recipe) {
          return { output: `Opening ${recipe.title}...`, navigate: `/recipes/${recipe.slug}` };
        }
      }
      return { output: 'Usage: open <slug>' };

    case 'about':
      return {
        output: `
Bytes • Bourbon • BBQ
─────────────────────
A SOC dashboard that happens to be about BBQ.

Built by Brian Chaplow
https://brianchaplow.com

Real threat data from a real HomeLab SOC.
Real recipes from a real pitmaster.

Type 'help' for commands.`,
      };

    default:
      return { output: `${cmd}: command not found. Try 'help'.` };
  }
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add terminal command handler with humorous responses"
```

---

### Task 8.3: Create Terminal Component

**Files:**
- Create: `bytesbourbonbbq-sveltekit/src/lib/components/Terminal.svelte`

**Step 1: Create Terminal component**

Create `src/lib/components/Terminal.svelte`:

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { executeCommand } from '$terminal/commands';
  import { socStatus } from '$stores/soc';
  import { getAllRecipes } from '$lib/content/recipes';

  export let visible = false;

  let terminalElement: HTMLDivElement;
  let term: any;
  let fitAddon: any;
  let inputBuffer = '';
  let history: string[] = [];
  let historyIndex = -1;
  let recipes: any[] = [];

  const PROMPT = '\x1b[36mbbbq-soc:~$\x1b[0m ';

  onMount(async () => {
    if (!browser) return;

    const { Terminal } = await import('xterm');
    const { FitAddon } = await import('xterm-addon-fit');

    // Import CSS
    await import('xterm/css/xterm.css');

    term = new Terminal({
      theme: {
        background: '#0a0a0f',
        foreground: '#e5e5e5',
        cursor: '#38bdf8',
        cursorAccent: '#0a0a0f',
        cyan: '#38bdf8',
        green: '#4ade80',
        yellow: '#ffd166',
        red: '#ff4444',
      },
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 14,
      cursorBlink: true,
    });

    fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalElement);
    fitAddon.fit();

    // Welcome message
    term.writeln('\x1b[36m╔══════════════════════════════════════════════════════════╗\x1b[0m');
    term.writeln('\x1b[36m║\x1b[0m  BBBQ-SOC Terminal v2.1.0                                \x1b[36m║\x1b[0m');
    term.writeln('\x1b[36m║\x1b[0m  Type "help" for available commands                      \x1b[36m║\x1b[0m');
    term.writeln('\x1b[36m╚══════════════════════════════════════════════════════════╝\x1b[0m');
    term.writeln('');
    term.write(PROMPT);

    // Load recipes
    recipes = getAllRecipes();

    // Handle input
    term.onKey(async ({ key, domEvent }: { key: string; domEvent: KeyboardEvent }) => {
      const code = domEvent.keyCode;

      if (code === 13) { // Enter
        term.writeln('');
        if (inputBuffer.trim()) {
          history.push(inputBuffer);
          historyIndex = history.length;

          const result = await executeCommand(inputBuffer, {
            recipes,
            socStatus: $socStatus,
          });

          if (result.clear) {
            term.clear();
          } else if (result.output) {
            term.writeln(result.output);
          }

          if (result.navigate) {
            visible = false;
            goto(result.navigate);
          }
        }
        inputBuffer = '';
        term.write(PROMPT);
      } else if (code === 8) { // Backspace
        if (inputBuffer.length > 0) {
          inputBuffer = inputBuffer.slice(0, -1);
          term.write('\b \b');
        }
      } else if (code === 38) { // Up arrow
        if (historyIndex > 0) {
          historyIndex--;
          clearLine();
          inputBuffer = history[historyIndex];
          term.write(inputBuffer);
        }
      } else if (code === 40) { // Down arrow
        if (historyIndex < history.length - 1) {
          historyIndex++;
          clearLine();
          inputBuffer = history[historyIndex];
          term.write(inputBuffer);
        } else {
          historyIndex = history.length;
          clearLine();
          inputBuffer = '';
        }
      } else if (key.length === 1 && !domEvent.ctrlKey && !domEvent.altKey) {
        inputBuffer += key;
        term.write(key);
      }
    });

    // Handle resize
    const resizeObserver = new ResizeObserver(() => fitAddon?.fit());
    resizeObserver.observe(terminalElement);

    return () => resizeObserver.disconnect();
  });

  function clearLine() {
    term.write('\r' + PROMPT + ' '.repeat(inputBuffer.length) + '\r' + PROMPT);
  }

  onDestroy(() => {
    term?.dispose();
  });
</script>

{#if visible}
  <div
    class="fixed inset-0 z-50 bg-base/95 backdrop-blur flex flex-col"
    on:keydown={(e) => e.key === 'Escape' && (visible = false)}
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-info/20">
      <span class="font-mono text-sm text-gray-400">BBBQ-SOC v2.1.0</span>
      <div class="flex gap-2">
        <button
          class="px-3 py-1 text-sm rounded bg-panel text-gray-400 hover:bg-panel-hover"
          on:click={() => visible = false}
        >
          [GUI]
        </button>
        <button class="px-3 py-1 text-sm rounded bg-info/20 text-info">
          [TERMINAL]
        </button>
      </div>
    </div>

    <!-- Terminal -->
    <div class="flex-1 p-4" bind:this={terminalElement}></div>

    <!-- Footer -->
    <div class="p-2 border-t border-info/10 text-xs text-gray-600 flex gap-4">
      <span>Type 'help' for commands</span>
      <span>↑↓ History</span>
      <span>ESC to close</span>
    </div>
  </div>
{/if}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add Terminal component with xterm.js"
```

---

### Task 8.4: Wire Up Terminal Toggle

**Files:**
- Modify: `bytesbourbonbbq-sveltekit/src/routes/+layout.svelte`

**Step 1: Add terminal toggle to layout**

Update `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
  import '../app.css';
  import Header from '$components/Header.svelte';
  import Sidebar from '$components/Sidebar.svelte';
  import Terminal from '$components/Terminal.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { socStatus, socStats, initializeSOC, startPolling, stopPolling } from '$stores/soc';

  export let data;

  let terminalVisible = false;

  // Initialize stores with SSR data
  $: if (data.initialStatus) socStatus.set(data.initialStatus);
  $: if (data.initialStats) socStats.set(data.initialStats);

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === '`' && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      terminalVisible = !terminalVisible;
    }
  }

  onMount(() => {
    initializeSOC();
    startPolling();

    if (browser) {
      window.addEventListener('keydown', handleKeydown);
    }
  });

  onDestroy(() => {
    stopPolling();
    if (browser) {
      window.removeEventListener('keydown', handleKeydown);
    }
  });
</script>

<Terminal bind:visible={terminalVisible} />

<div class="min-h-screen flex flex-col" class:hidden={terminalVisible}>
  <Header />

  <div class="flex flex-1">
    <Sidebar />

    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>

  <footer class="border-t border-info/10 py-4 px-6 text-center text-xs text-gray-600">
    <span>© 2026 Bytes • Bourbon • BBQ</span>
    <span class="mx-2">•</span>
    <button
      class="text-gray-700 hover:text-info transition-colors"
      on:click={() => terminalVisible = true}
    >
      Press <kbd class="font-mono bg-panel px-1 rounded">`</kbd> for analyst mode
    </button>
  </footer>
</div>
```

**Step 2: Test terminal toggle**

Run: `npm run dev`
Press: ` (backtick)
Expected: Terminal overlay appears with blinking cursor

**Step 3: Commit**

```bash
git add .
git commit -m "feat: wire up terminal toggle with backtick key"
```

---

## Phase 9: Deployment

### Task 9.1: Build Production Bundle

**Step 1: Run production build**

```bash
npm run build
```

Expected: `build/` directory created with server files

**Step 2: Test production locally**

```bash
node build
```

Visit: http://localhost:3000
Expected: Site works as expected

**Step 3: Commit build config**

```bash
git add .
git commit -m "chore: verify production build"
```

---

### Task 9.2: Deploy to GCP VM

**Files:**
- Create: `bytesbourbonbbq-sveltekit/ecosystem.config.cjs` (PM2 config)

**Step 1: Create PM2 config**

Create `ecosystem.config.cjs`:

```javascript
module.exports = {
  apps: [{
    name: 'bbbq-sveltekit',
    script: 'build/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production',
      PORT: 3002,
    },
  }],
};
```

**Step 2: Deploy to GCP VM**

```bash
# Build locally
npm run build

# Copy to GCP VM
gcloud compute scp --recurse build/ wordpress-1-vm:/opt/bbbq-sveltekit/build --zone=us-east4-a
gcloud compute scp package.json wordpress-1-vm:/opt/bbbq-sveltekit/ --zone=us-east4-a
gcloud compute scp ecosystem.config.cjs wordpress-1-vm:/opt/bbbq-sveltekit/ --zone=us-east4-a
gcloud compute scp .env wordpress-1-vm:/opt/bbbq-sveltekit/ --zone=us-east4-a

# SSH and start
gcloud compute ssh wordpress-1-vm --zone=us-east4-a --command="cd /opt/bbbq-sveltekit && npm install --production && pm2 start ecosystem.config.cjs"
```

**Step 3: Configure Apache reverse proxy**

SSH to VM and update Apache config:

```apache
<VirtualHost *:443>
    ServerName bytesbourbonbbq.com

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3002/
    ProxyPassReverse / http://127.0.0.1:3002/

    # SSE support
    ProxyTimeout 86400

    # ... existing SSL config ...
</VirtualHost>
```

Reload Apache:

```bash
sudo systemctl reload apache2
```

**Step 4: Verify deployment**

Visit: https://bytesbourbonbbq.com
Expected: SOC dashboard is live

**Step 5: Commit**

```bash
git add ecosystem.config.cjs
git commit -m "feat: add PM2 deployment config"
```

---

## Summary

This implementation plan covers:

1. **Phase 1**: Project initialization (SvelteKit, Tailwind, TypeScript, env config)
2. **Phase 2**: Content migration (markdown processing, assets)
3. **Phase 3**: API layer (OpenSearch client, SOC endpoints)
4. **Phase 4**: Svelte stores (reactive SOC data)
5. **Phase 5**: Layout components (Header, Sidebar)
6. **Phase 6**: Dashboard components (ThreatLevel, IncidentCard)
7. **Phase 7**: Recipe pages (Alert Queue, Case File)
8. **Phase 8**: Terminal easter egg (xterm.js, commands, humor)
9. **Phase 9**: Deployment (build, PM2, Apache proxy)

**Total tasks:** 20+
**Estimated commits:** 25-30
**Key dependencies:** SvelteKit, Tailwind CSS, xterm.js, @opensearch-project/opensearch

---

*Plan complete. Ready for execution.*
