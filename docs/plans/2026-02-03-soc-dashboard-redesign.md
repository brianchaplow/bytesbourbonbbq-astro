# Bytes Bourbon BBQ: SOC Dashboard Redesign

**Date:** 2026-02-03
**Author:** Brian Chaplow + Claude
**Status:** Design Complete, Pending Implementation

---

## Executive Summary

Transform bytesbourbonbbq.com from a conventional dark-themed recipe site into a **living SOC (Security Operations Center) dashboard** that displays real threat data from the HomeLab SOC while presenting BBQ recipes as "incident case files."

**Key differentiators:**
- Real-time threat data from OpenSearch, Cloudflare, Suricata, and Zeek
- Recipes presented as security incident reports
- Optional terminal easter egg with personality
- Unique portfolio piece that demonstrates actual SOC capabilities

---

## Design Principles

1. **GUI-first** — The SOC dashboard is the primary experience; terminal is a discoverable easter egg
2. **Living data** — Real metrics from the actual HomeLab SOC, not fake numbers
3. **Personality over polish** — Humor and character matter more than pixel-perfect design
4. **YAGNI** — Build the core experience first, add features incrementally

---

## Visual Design

### Color Palette

```
BACKGROUNDS
├── Base:           #0a0a0f (near-black with slight blue)
├── Panel:          #12121a (elevated surfaces)
├── Panel Hover:    #1a1a24 (subtle lift)
└── Grid overlay:   rgba(50, 50, 70, 0.03) (subtle scanlines)

SEVERITY COLORS (Accent)
├── Critical:       #ff4444 (red)
├── High:           #ff8c42 (fire orange)
├── Medium:         #ffd166 (amber/yellow)
├── Low:            #4ade80 (green)
├── Info:           #38bdf8 (cyan)
└── Resolved:       #6b7280 (muted gray)

GLOWS & EFFECTS
├── Panel border:   1px solid rgba(56, 189, 248, 0.15) (subtle cyan)
├── Active glow:    0 0 20px rgba(56, 189, 248, 0.2)
├── Alert pulse:    Keyframe animation on critical items
└── Data highlight: #38bdf8 (cyan) for live numbers

TEXT
├── Primary:        #e5e5e5 (warm white)
├── Secondary:      #9ca3af (muted gray)
├── Data/Mono:      #38bdf8 (cyan) — numbers, IDs, timestamps
└── Links:          #ff8c42 (fire orange)

FONTS
├── Headings:       Inter or system sans
├── Body:           Inter or system sans
├── Data/Code:      JetBrains Mono
└── Terminal:       JetBrains Mono
```

### Ambient Details

- Subtle dot-grid background pattern (like graph paper in a dark room)
- Panels have hairline cyan borders that brighten on hover
- Status indicators pulse slowly (not frantically)
- Numbers that update have a brief highlight flash
- Occasional scanline effect (very subtle, CSS only)

---

## Page Designs

### Global Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER: Logo + Nav + Live Status Bar (threat level, uptime)        │
├────────────┬─────────────────────────────────────────────────────────┤
│            │                                                         │
│  SIDEBAR   │              MAIN CONTENT                               │
│  - Nav     │              (changes per page)                         │
│  - Live    │                                                         │
│    stats   │                                                         │
│  - Quick   │                                                         │
│    filters │                                                         │
│            │                                                         │
├────────────┴─────────────────────────────────────────────────────────┤
│  FOOTER: System status, last refresh, terminal hint                  │
└──────────────────────────────────────────────────────────────────────┘
```

**Persistent Elements:**
- Status bar in header: "THREAT LEVEL: ELEVATED" (color-coded), SOC uptime, last scan
- Sidebar with live counters: IPs blocked, alerts processed, active incidents
- Subtle terminal hint in footer: "Press ` for analyst mode"

---

### Homepage: Mission Control

The homepage is a SOC analyst's workstation overview.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ░ BYTES•BOURBON•BBQ ░░░  [Recipes] [Intel] [About]   🟢 SOC: ONLINE     │
├─────────────┬────────────────────────────────────────────────────────────┤
│             │  ┌─────────────────────────────────────────────────┐       │
│  LIVE STATS │  │  THREAT LEVEL: ████████░░ ELEVATED              │       │
│  ───────────│  │  "The pit is hot. Stay vigilant."               │       │
│  🔴 1,981   │  └─────────────────────────────────────────────────┘       │
│  IPs Blocked│                                                            │
│             │  ACTIVE INCIDENTS (Featured Recipes)                       │
│  🟡 47,487  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  IDS Rules  │  │ INC-001  │ │ INC-002  │ │ INC-003  │                   │
│             │  │ Cold     │ │ Reverse  │ │ Jalapeño │                   │
│  🟢 6       │  │ Smoke    │ │ Sear     │ │ Boats    │                   │
│  Cases Open │  │ ●ACTIVE  │ │ ●ACTIVE  │ │ ●ACTIVE  │                   │
│             │  │ SEV:MED  │ │ SEV:HIGH │ │ SEV:LOW  │                   │
│  ─────────  │  │ TTR:12d  │ │ TTR:2h   │ │ TTR:45m  │                   │
│  RECENT     │  └──────────┘ └──────────┘ └──────────┘                   │
│  ACTIVITY   │                                                            │
│  ─────────  │  INTEL FEED                                               │
│  10:42 Block│  ┌─────────────────────────────────────────────────┐      │
│  10:38 Alert│  │ 🔸 142.93.x.x blocked (AbuseIPDB score: 100)   │      │
│  10:35 Scan │  │ 🔸 SQL injection attempt on brianchaplow.com   │      │
│             │  │ 🔸 New Suricata signature triggered: ET SCAN   │      │
│  [View All] │  └─────────────────────────────────────────────────┘      │
└─────────────┴────────────────────────────────────────────────────────────┘
```

**Key Elements:**

1. **Threat Level Banner** — Real alert volume from OpenSearch, thresholds:
   - LOW: < 10 alerts/hour
   - MODERATE: 10-30 alerts/hour
   - ELEVATED: 30-60 alerts/hour
   - HIGH: > 60 alerts/hour or critical signature

2. **Live Stats Sidebar** — Real numbers:
   - IPs blocked (Cloudflare API)
   - IDS rules loaded (Suricata)
   - Active cases (recipe count)
   - Recent activity feed

3. **Incident Cards** — Recipes as case files:
   - Case ID (INC-001, INC-002...)
   - Status indicator (blinking dot)
   - Severity badge (difficulty → severity)
   - TTR (total_time → Time To Resolution)

4. **Intel Feed** — Live events from OpenSearch

---

### Recipe Index: Alert Queue

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ALERT QUEUE                                          ▼ FILTER  ⟳ REFRESH│
├──────────────────────────────────────────────────────────────────────────┤
│  ┌─ SEVERITY ─┐  ┌─ STATUS ─┐  ┌─ TTR ─────┐  ┌─ CLASSIFICATION ──────┐ │
│  │ ▣ CRIT (0) │  │ ● ALL    │  │ ● ANY     │  │ ● All Categories      │ │
│  │ ▣ HIGH (2) │  │ ○ OPEN   │  │ ○ < 1 hr  │  │ ○ SOC Operations      │ │
│  │ ▣ MED  (3) │  │ ○ CLOSED │  │ ○ < 4 hr  │  │ ○ Data Encapsulation  │ │
│  │ ▣ LOW  (1) │  │          │  │ ○ < 1 day │  │ ○ Payload Delivery    │ │
│  └────────────┘  └──────────┘  └───────────┘  └───────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌─────┬────────┬─────────────────────────────┬──────────┬──────┬──────┐│
│  │ SEV │ ID     │ INCIDENT                    │ CLASS    │ TTR  │ DATE ││
│  ├─────┼────────┼─────────────────────────────┼──────────┼──────┼──────┤│
│  │ 🔴  │ INC-047│ Reverse Sear Ribeye         │ Endpoint │ 2h   │ 01/15││
│  │ ▓▓▓▓│        │ Precision temp control...   │ Response │      │      ││
│  ├─────┼────────┼─────────────────────────────┼──────────┼──────┼──────┤│
│  │ 🟡  │ INC-046│ Cold Smoke, Hot Alerts      │ SOC Ops  │ 12d  │ 12/05││
│  │ ▓▓░░│        │ Making bacon doesn't pause..│ Cont.Mon │      │      ││
│  └─────┴────────┴─────────────────────────────┴──────────┴──────┴──────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Sortable columns (click headers)
- Filter chips with animated counts
- Row hover reveals quick-action buttons
- Toggle between table and card grid views

---

### Recipe Page: Incident Case File

Each recipe becomes a full incident report.

**Terminology Mapping:**

| Current Term | SOC Term |
|--------------|----------|
| Recipe | Incident / Case |
| Ingredients | IOCs (Indicators of Cookery) |
| Instructions | Response Playbook |
| `difficulty` | Severity (Low/Med/High/Critical) |
| `total_time` | TTR (Time To Resolution) |
| `cyber_concept` | Classification |
| `date` | Case Opened |
| AAR | After Action Report (unchanged) |
| Markdown body | Investigation Notes |

**Layout:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CASE FILE: INC-2024-1205-046                                           │
├─────────────┬───────────────────────────────────────────────────────────┤
│             │                                                           │
│  STATUS     │  [HERO IMAGE]                                             │
│  ● RESOLVED │                                                           │
│             │  INCIDENT: Cold Smoke, Hot Alerts                         │
│  SEVERITY   │  CLASSIFICATION: 24/7 SOC Operations                      │
│  ██░░ MED   │                                                           │
│             │  ┌────────────┬────────────┬────────────┬──────────┐      │
│  TTR        │  │ OPENED     │ TTR        │ YIELD      │ ANALYST  │      │
│  12 days    │  │ 2024-12-05 │ 12 days    │ 5 lbs      │ Chaplow  │      │
│             │  └────────────┴────────────┴────────────┴──────────┘      │
│  TAGS       │                                                           │
│  #smoking   │  ┌─ EXECUTIVE SUMMARY ─────────────────────────────┐      │
│  #pork      │  │ Making bacon doesn't pause for weather...       │      │
│  #soc       │  └─────────────────────────────────────────────────┘      │
│             │                                                           │
│             │  ┌─ IOCs (INDICATORS OF COOKERY) ──────────────────┐      │
│             │  │ • 5 lb pork belly, skin removed                 │      │
│             │  │ • 3 tbsp kosher salt                            │      │
│             │  │ • 1 tsp Prague powder #1                        │      │
│             │  └─────────────────────────────────────────────────┘      │
│             │                                                           │
│             │  ┌─ RESPONSE PLAYBOOK ─────────────────────────────┐      │
│             │  │  PHASE 1: PREPARATION                           │      │
│             │  │  [01] Mix all cure ingredients                  │      │
│             │  │  [02] Coat pork belly thoroughly                │      │
│             │  │  ...                                            │      │
│             │  └─────────────────────────────────────────────────┘      │
│             │                                                           │
│             │  ┌─ AFTER ACTION REPORT ───────────────────────────┐      │
│             │  │  ✓ WHAT WORKED              [GREEN]             │      │
│             │  │  ⚠ ADJUSTMENTS              [YELLOW]            │      │
│             │  │  📘 LESSONS LEARNED          [BLUE]              │      │
│             │  └─────────────────────────────────────────────────┘      │
│             │                                                           │
│             │  ┌─ INVESTIGATION NOTES ───────────────────────────┐      │
│             │  │  (Main markdown content / narrative)            │      │
│             │  └─────────────────────────────────────────────────┘      │
└─────────────┴───────────────────────────────────────────────────────────┘
```

---

## Terminal Easter Egg

### Discovery

Terminal is hidden by default. Users discover it via:
- Pressing backtick (`) anywhere
- Footer hint: "Press ` for analyst mode"
- 404 page mentions it
- After 30s inactivity, brief blinking cursor appears and fades

### Interface

```
┌──────────────────────────────────────────────────────────────────────────┐
│  BBBQ-SOC v2.1.0                                    [GUI] [TERMINAL] ●  │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ bbbq-soc:~$ status                                                 │ │
│  │                                                                    │ │
│  │ ╔══════════════════════════════════════════════════════════════╗  │ │
│  │ ║  HOMELAB SOC STATUS                                          ║  │ │
│  │ ╠══════════════════════════════════════════════════════════════╣  │ │
│  │ ║  Threat Level:    ████████░░ ELEVATED                        ║  │ │
│  │ ║  IPs Blocked:     1,981 (Cloudflare)                         ║  │ │
│  │ ║  IDS Rules:       47,487 (Suricata ET Open + Custom)         ║  │ │
│  │ ║  Zeek Status:     ● CAPTURING (eth4)                         ║  │ │
│  │ ╚══════════════════════════════════════════════════════════════╝  │ │
│  │                                                                    │ │
│  │ bbbq-soc:~$ █                                                     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│  Type 'help' for commands  │  ↑↓ History  │  Tab: Autocomplete          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Available Commands

```
NAVIGATION
  ls [path]           List incidents, intel, or categories
  cd <section>        Navigate to section
  cat <incident>      Read full case file
  open <incident>     Open in GUI mode (smooth transition)

LIVE DATA
  status              Show SOC operational status (real data)
  threats             Recent threat activity feed
  blocks              Latest Cloudflare blocks
  watch               Live tail of incoming events

SEARCH & FILTER
  grep <pattern>      Search across all incidents
  filter --sev=HIGH   Filter incident list
  find <ingredient>   Find recipes containing ingredient

META
  help                Show all commands
  gui                 Switch to GUI mode
  theme <name>        Change color scheme (amber/green/cyan/red)
  clear               Clear terminal
  about               About the site/author
```

### Personality: Malicious Command Responses

The terminal responds to attack attempts with humor.

#### Destructive Commands

```
$ rm -rf /

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
╚══════════════════════════════════════════════════════════════╝
```

```
$ sudo rm -rf /
Permission denied. Also, I'm telling your mother.
```

```
$ sudo
I don't know who told you that you have root here, but they lied.

This is a BBQ website. The only root you're getting is root vegetables
in my next brisket rub recipe.
```

```
$ chmod 777 /
Ah yes, the "make everything terrible" command.

Tell me you learned Linux from Stack Overflow without telling me
you learned Linux from Stack Overflow.
```

```
$ :(){ :|:& };:
A fork bomb? In this economy?

The only fork happening here is the one going into my pulled pork.

Nice try though. Points for creativity.
```

#### Password/Credential Attempts

```
$ cat /etc/passwd
root:x:0:0:Pitmaster:/root:/bin/bash
brisket:x:1000:1000:Low and Slow:/home/brisket:/bin/smoke
ribs:x:1001:1001:Fall Off Bone:/home/ribs:/bin/wrap
chicken:x:1002:1002:Crispy Skin:/home/chicken:/bin/spatchcock

What were you expecting, exactly?
```

```
$ cat /etc/shadow
██████████████████████████████████████████████████

Redacted. Obviously.

But I appreciate the audacity.
```

```
$ cat ~/.ssh/id_rsa
-----BEGIN RSA PRIVATE KEY-----
bm90LWdvbm5hLWhhcHBlbi1idWRkeS4gTmljZSB0cnkgdGhvdWdoLg==
-----END RSA PRIVATE KEY-----

(That's base64 for "not-gonna-happen-buddy. Nice try though.")
```

#### SQL Injection

```
$ ls'; DROP TABLE incidents;--
ERROR 1337: Table 'incidents' is protected by a dry rub barrier.

Also this is a static site. There is no database.

But if there were, I'd be impressed you tried.
```

```
$ ' OR '1'='1
Ah, a classic. Bobby Tables sends his regards.

The only injection happening here is injecting flavor into my next brisket.

Try: help
```

#### XSS

```
$ <script>alert('xss')</script>
I see you've chosen chaos.

This terminal sanitizes input like I sanitize my cutting boards:
thoroughly and with mild disappointment in humanity.

The only scripts running here are my mise en place checklists.
```

#### Hacking Tools

```
$ nmap
Scanning... scanning... scanning...

PORT      STATE    SERVICE
80/tcp    open     delicious-recipes
443/tcp   open     even-more-recipes
8080/tcp  closed   no-recipes-here

Vulnerability detected: You're hungry. Recommend: cat incidents/
```

```
$ sqlmap
[*] Starting injection test...
[!] Target appears to be a static website
[!] No database detected
[!] Only things detected: BBQ recipes and questionable life choices
[*] Recommend trying: help
```

```
$ metasploit
msfconsole loading...

Just kidding. This is a recipe website.

The only exploit here is exploiting your taste buds.
Use: ls incidents/
```

```
$ hydra
Brute forcing... the perfect bark on a brisket? I respect that.

For actual commands, try: help
```

#### Recon Commands

```
$ id
uid=1337(hungry-visitor) gid=1337(bbq-enthusiasts) groups=1337(bbq-enthusiasts),42(meat-sweats)
```

```
$ uname -a
BBQ-OS 5.15.0-brisket #1 SMP PREEMPT Smoky x86_64 GNU/Delicious
```

```
$ pwd
/home/pitmaster/why-are-you-like-this
```

```
$ whoami
A person who found the secret terminal on a BBQ website
and immediately tried to break it.

I respect the hustle.
```

```
$ ps aux
USER       PID  %CPU  %MEM   COMMAND
pitmaster    1   0.0   0.0   /sbin/init-the-fire
pitmaster   42  99.0  50.0   /usr/bin/smoke --low --slow
pitmaster  225   5.0  10.0   /usr/bin/monitor-temp
pitmaster  666   0.0   0.0   [bark-formation]
visitor   1337   0.0   0.0   /bin/bash (you are here)
```

```
$ history
Nice try, FBI.
```

#### Privilege Escalation

```
$ sudo -l
User hungry-visitor may run the following commands:
    (ALL) NOPASSWD: /usr/bin/eat
    (ALL) NOPASSWD: /usr/bin/compliment-the-chef
    (pitmaster) /usr/bin/request-seconds
```

```
$ sudo su
Password: ********

Authentication failed.

The password was "please" and you didn't say it.
```

```
$ pkexec
CVE-2021-4034 has been patched.

Also this is JavaScript.

Also you should be ashamed.
```

#### Network Attacks

```
$ tcpdump
tcpdump: listening on eth0, link-type DELICIOUS (BBQ Smoke)

12:42:01.000001 IP smoker.225 > brisket.internal: SMOKE probe
12:42:01.000002 IP brisket.internal > smoker.225: BARK ACK
12:42:01.000003 IP pitmaster.beer > mouth.local: POUR seq=3

3 packets captured
0 packets dropped by kernel
∞ packets of flavor delivered
```

#### Pop Culture

```
$ hack the planet
HACK THE PLANET!

...okay I respect the Hackers (1995) reference.

Try: help
```

```
$ i'm in
No you're not.

But I appreciate the confidence.
```

```
$ access mainframe
MAINFRAME ACCESS GRANTED

██████████████████████████████
█▄░▄▄░█░▄▄░▄█▄░█░▄▄██▀▄▄▀█░███
██░██░█░██░██░█░░▄▄██░██░█▀░██
█▀░▀▀░█▄▄▄▄▄█▄▄█▄▄▄██▄██▄█▀▄▄█
██████████████████████████████

Just kidding. There is no mainframe.
This is a website about smoked meats.
```

#### Editor Wars

```
$ vim
*opens vim*

You are now trapped forever.

Just kidding. But if this were real vim, you'd never leave.

(Try: help)
```

```
$ emacs
We don't do that here.
```

```
$ nano
Finally, a person of taste.

(Still not a real terminal though. Try: help)
```

#### Wholesome

```
$ please
Since you asked nicely: help
```

```
$ thank you
You're welcome.

Seriously, thanks for visiting. Hope you find a recipe you like.

Try: ls incidents/
```

```
$ sudo make me a sandwich
Okay.

🥪 One brisket sandwich, coming up.

Check out: cat incidents/INC-043
```

#### Meta

```
$ who made you
Brian Chaplow, with help from Claude.

We had a lot of fun writing these responses.

Clearly.
```

```
$ are you sentient
I'm a switch statement with personality.

Whether that counts as sentience is a philosophy question
above my pay grade.

I just want to tell you about BBQ.
```

---

## Live Data Architecture

### Data Sources

| Source | Location | Key Data | Update Frequency |
|--------|----------|----------|------------------|
| OpenSearch | smokehouse:9200 | Alerts, flows, Zeek, Apache, threat intel | Real-time |
| Cloudflare API | api.cloudflare.com | Blocked IPs, rule counts | On-demand |
| Local JSON | blocked_ips.json | Block history with scores | Hourly |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         bytesbourbonbbq.com                             │
│                         (SvelteKit on GCP VM)                           │
├─────────────────────────────────────────────────────────────────────────┤
│   Browser                                                               │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │  Svelte Stores                                                   │  │
│   │  ├── socStatus (threat level, uptime, last refresh)             │  │
│   │  ├── liveStats (blocked IPs, alert counts, rules)               │  │
│   │  └── recentActivity (last 10 events)                            │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│         │ fetch() every 60s (or SSE for live feed)                     │
│         ▼                                                               │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │  SvelteKit API Routes (server-side)                              │  │
│   │  ├── /api/soc/status     → Aggregated SOC health                │  │
│   │  ├── /api/soc/stats      → Counts and metrics                   │  │
│   │  ├── /api/soc/activity   → Recent events feed                   │  │
│   │  └── /api/soc/threats    → Live threat stream (SSE)             │  │
│   └─────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
         │ Tailscale WireGuard tunnel
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         smokehouse (10.10.20.10)                        │
│   OpenSearch :9200                                                      │
│   ├── fluentbit-default (Suricata + Zeek)                              │
│   ├── apache-parsed-v2 (web traffic + threat intel)                    │
│   └── winlog-* (Windows endpoint logs)                                 │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Cloudflare API                                  │
│   └── /accounts/{id}/firewall/access_rules/rules                       │
└─────────────────────────────────────────────────────────────────────────┘
```

### API Endpoints

#### GET /api/soc/status

```json
{
  "status": "operational",
  "threat_level": "elevated",
  "threat_level_value": 3,
  "threat_level_reason": "47 alerts in last hour (baseline: 20)",
  "uptime_days": 365,
  "last_alert": "2026-02-03T12:42:17Z",
  "last_block": "2026-02-03T12:38:45Z",
  "quip": "The pit is hot. Stay vigilant."
}
```

Cache: 60 seconds

#### GET /api/soc/stats

```json
{
  "ips_blocked": {
    "total": 1981,
    "last_24h": 12,
    "last_7d": 47
  },
  "ids_rules": {
    "total": 47487,
    "custom": 10
  },
  "alerts": {
    "total": 51423,
    "last_24h": 847,
    "by_severity": {
      "critical": 2,
      "high": 34,
      "medium": 412,
      "low": 399
    }
  },
  "incidents_open": 6,
  "zeek_status": "capturing",
  "suricata_status": "running"
}
```

Cache: 5 minutes

#### GET /api/soc/activity

```json
{
  "events": [
    {
      "timestamp": "2026-02-03T12:42:17Z",
      "type": "block",
      "icon": "🔴",
      "message": "142.93.211.176 blocked",
      "detail": "AbuseIPDB: 100 | Country: NL"
    }
  ]
}
```

Cache: None (real-time)

#### GET /api/soc/threats (SSE)

```
event: threat
data: {"timestamp":"...","type":"block","ip":"142.93.211.176","score":100}

event: heartbeat
data: {"timestamp":"...","status":"connected"}
```

### Caching Strategy

| Endpoint | Cache TTL | Reason |
|----------|-----------|--------|
| /api/soc/status | 60s | Threat level doesn't change second-by-second |
| /api/soc/stats | 5 min | Aggregate counts, expensive queries |
| /api/soc/activity | None | Real-time feed |
| /api/soc/threats | N/A | SSE stream |

### Security

**Server-side only (never exposed to browser):**
- OPENSEARCH_HOST, OPENSEARCH_USER, OPENSEARCH_PASS
- CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID

**Safe to show publicly:**
- Aggregate counts (blocked IPs, alert counts)
- Threat level indicator
- Geographic distribution (country-level)
- Actual attacker IPs (optional — it's a flex)

---

## Technical Implementation

### Framework: SvelteKit

**Why SvelteKit:**
- Built-in motion/transitions (no library needed)
- Reactive stores perfect for live SOC data
- Smallest bundle size
- Can still use markdown content
- Smooth mode transitions (GUI ↔ Terminal)

### Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── Terminal.svelte        # xterm.js wrapper + custom commands
│   │   ├── Dashboard.svelte       # GUI mode container
│   │   ├── ModeToggle.svelte      # The [GUI][TERMINAL] switch
│   │   ├── ThreatLevel.svelte     # Animated threat banner
│   │   ├── LiveStats.svelte       # Sidebar metrics
│   │   └── incidents/
│   │       ├── IncidentCard.svelte
│   │       ├── CaseFile.svelte
│   │       └── AlertQueue.svelte
│   ├── stores/
│   │   ├── mode.ts                # GUI vs Terminal state
│   │   ├── soc.ts                 # Live SOC data
│   │   └── incidents.ts           # Recipe/incident content
│   └── terminal/
│       ├── commands.ts            # Command registry
│       ├── parser.ts              # Input parsing
│       ├── responses.ts           # Humorous responses
│       └── renderer.ts            # ASCII output formatting
├── routes/
│   ├── +layout.svelte             # Mode-aware layout
│   ├── +page.svelte               # Homepage (dashboard)
│   ├── recipes/
│   │   ├── +page.svelte           # Alert queue
│   │   └── [slug]/+page.svelte    # Case file
│   └── api/
│       ├── soc/
│       │   ├── status/+server.ts
│       │   ├── stats/+server.ts
│       │   ├── activity/+server.ts
│       │   └── threats/+server.ts  # SSE endpoint
│       └── cloudflare/+server.ts
└── content/
    └── recipes/                   # Markdown files (migrated from Astro)
```

### Dependencies

```json
{
  "dependencies": {
    "@sveltejs/kit": "^2.x",
    "xterm": "^5.x",
    "xterm-addon-fit": "^0.8.x",
    "@opensearch-project/opensearch": "^2.x"
  }
}
```

---

## Deployment

### Target: GCP VM (wordpress-1-vm)

**Current Resources (after MySQL removal):**
- RAM: 1.9 GB total, ~900 MB available
- Disk: 20 GB total, 7.3 GB available
- CPU: 2 vCPU (AMD EPYC), low load

**SvelteKit Requirements:**
- Node.js process: ~100-200 MB RAM
- Build artifacts: ~100-500 MB disk

**Deployment Method:**
1. Build SvelteKit locally or in CI
2. Deploy to GCP VM via rsync or git pull
3. Run with PM2 or systemd
4. Reverse proxy via Apache (already running)

### Apache Configuration

```apache
<VirtualHost *:443>
    ServerName bytesbourbonbbq.com

    # Proxy to SvelteKit
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3002/
    ProxyPassReverse / http://127.0.0.1:3002/

    # SSE support
    ProxyTimeout 86400

    # ... SSL config ...
</VirtualHost>
```

---

## Migration Plan

### Phase 1: Foundation
- [ ] Initialize SvelteKit project
- [ ] Set up basic routing structure
- [ ] Migrate markdown content from Astro
- [ ] Implement basic dark theme

### Phase 2: Dashboard UI
- [ ] Build global layout (header, sidebar, footer)
- [ ] Create ThreatLevel component
- [ ] Create LiveStats sidebar
- [ ] Create IncidentCard component
- [ ] Build homepage dashboard

### Phase 3: Live Data
- [ ] Set up OpenSearch client (server-side)
- [ ] Implement /api/soc/* endpoints
- [ ] Create Svelte stores for live data
- [ ] Add polling/SSE for real-time updates

### Phase 4: Terminal
- [ ] Integrate xterm.js
- [ ] Build command parser
- [ ] Implement all commands
- [ ] Add humorous responses
- [ ] Create smooth GUI↔Terminal transitions

### Phase 5: Polish
- [ ] Add animations and transitions
- [ ] Implement theme variants
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] SEO (JSON-LD, meta tags)

### Phase 6: Deploy
- [ ] Deploy to GCP VM
- [ ] Configure Apache reverse proxy
- [ ] Set up PM2/systemd
- [ ] DNS cutover
- [ ] Monitor and iterate

---

## Open Questions

1. **Show attacker IPs publicly?** — Recommended yes, it's authentic
2. **Terminal sound effects?** — Subtle keystroke sounds? Alerts?
3. **Theme variants?** — Amber/green/cyan/red terminal themes?
4. **Mobile terminal?** — Worth supporting or GUI-only on mobile?

---

## Appendix: OpenSearch Queries

### Alert Count (Last 24h)

```json
{
  "query": {"range": {"@timestamp": {"gte": "now-24h"}}},
  "aggs": {
    "by_severity": {"terms": {"field": "alert.severity"}}
  }
}
```

### Blocked IPs Count

```json
{
  "query": {"term": {"threat_intel.blocked": true}},
  "aggs": {
    "total": {"cardinality": {"field": "client_ip.keyword"}}
  }
}
```

### Recent Events

```json
{
  "size": 10,
  "sort": [{"@timestamp": "desc"}],
  "query": {
    "bool": {
      "should": [
        {"term": {"event_type": "alert"}},
        {"term": {"threat_intel.blocked": true}}
      ]
    }
  }
}
```

---

*Design complete. Ready for implementation.*
