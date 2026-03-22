# 🤖 Customer Support Agent

**AI-powered customer support that scales with your business**

Built for the [AI Agents Week-long Hack with Kiro](https://luma.com/itb8v2wa) hackathon.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kevintucker/Customer-Support-Agent)

---

## 🎯 The Problem

Customer support is expensive and doesn't scale:
- **$15-25 per ticket** average cost with human agents
- **Hours of wait time** frustrating customers
- **Repetitive questions** burning out support teams
- **No learning** - same questions answered thousands of times

## 💡 The Solution

An AI agent that:
- ✅ **Resolves 70%+ of tickets automatically** using Claude AI
- ✅ **Intelligently escalates** complex issues to humans (sentiment analysis + confidence scoring)
- ✅ **Learns continuously** from resolved conversations
- ✅ **Tracks ROI** with built-in analytics

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Chat Widget │  │  Dashboard  │  │    Analytics Panel      │  │
│  │  (React)    │  │  (Tickets)  │  │    (ROI Metrics)        │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
└─────────┼────────────────┼─────────────────────┼────────────────┘
          │                │                     │
          ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER (Next.js)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ /api/chat   │  │/api/tickets │  │    /api/analytics       │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
└─────────┼────────────────┼─────────────────────┼────────────────┘
          │                │                     │
          ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      INTELLIGENCE LAYER                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Claude AI     │  │   Escalation    │  │  Knowledge Base │  │
│  │ (Anthropic API) │  │    Engine       │  │   (RAG-style)   │  │
│  │                 │  │ • Sentiment     │  │                 │  │
│  │ • Conversations │  │ • Confidence    │  │ • FAQ Articles  │  │
│  │ • Context       │  │ • Intent        │  │ • Search/Match  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
          │                │                     │
          ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   PostgreSQL (Neon)                         ││
│  │  • Tickets    • Messages    • Analytics    • Fine-tuning    ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Features

### For Customers
- **Instant responses** - No more waiting in queue
- **24/7 availability** - Support never sleeps
- **Seamless escalation** - Complex issues reach humans automatically

### For Businesses
- **70%+ cost reduction** - AI handles routine questions
- **Real-time analytics** - Track resolution rates, sentiment, ROI
- **Continuous improvement** - Export data for model fine-tuning
- **Easy integration** - Embeddable widget for any website

### Smart Escalation Engine
The agent automatically escalates to humans when:
- 😠 **Negative sentiment detected** (frustration, anger)
- 🎯 **Low confidence** on how to respond
- 🗣️ **Customer requests human** ("speak to manager")
- ⚠️ **High-stakes issues** (refunds, legal mentions)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React, Tailwind CSS |
| **AI/ML** | Claude (Anthropic), Vercel AI SDK |
| **Database** | PostgreSQL (Neon), Prisma ORM |
| **Deployment** | Vercel (serverless) |
| **Dev Environment** | Kiro (spec-driven development) |

---

## 📊 Business Model

### Revenue Streams
| Tier | Price | Features |
|------|-------|----------|
| **Starter** | $0.10/ticket | Up to 1K tickets/mo, basic analytics |
| **Growth** | $0.07/ticket | Up to 10K tickets/mo, advanced analytics, custom KB |
| **Enterprise** | Custom | Unlimited, fine-tuning, SLA, dedicated support |

### Unit Economics
- **Cost to serve**: ~$0.02/ticket (API costs)
- **Value delivered**: $15/ticket saved (vs human agent)
- **Gross margin**: 80%+ at scale

---

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- Anthropic API key
- PostgreSQL database (or use Neon free tier)

### Installation

```bash
# Clone the repository
git clone https://github.com/kevintucker/Customer-Support-Agent.git
cd Customer-Support-Agent

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://..."      # Neon pooled connection
DIRECT_URL="postgresql://..."        # Neon direct connection
ANTHROPIC_API_KEY="sk-ant-..."       # Your Anthropic API key
```

---

## 📁 Project Structure

```
support-agent/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts        # AI chat endpoint
│   │   │   ├── tickets/route.ts     # Ticket CRUD
│   │   │   ├── analytics/route.ts   # ROI metrics
│   │   │   └── fine-tuning/         # Training data export
│   │   ├── page.tsx                 # Landing page
│   │   ├── demo/page.tsx            # Interactive demo
│   │   └── dashboard/page.tsx       # Admin panel
│   ├── components/
│   │   ├── ChatWidget.tsx           # Embeddable chat
│   │   ├── TicketList.tsx           # Ticket management
│   │   ├── TicketDetail.tsx         # Conversation view
│   │   └── AnalyticsDashboard.tsx   # ROI tracking
│   └── lib/
│       ├── escalation.ts            # Sentiment & intent analysis
│       ├── knowledge-base.ts        # FAQ retrieval
│       └── db.ts                    # Prisma client
├── prisma/
│   └── schema.prisma                # Database schema
└── package.json
```

---

## 🎥 Demo

**Live Demo**: [customer-support-agent.vercel.app](https://customer-support-agent-kevin-tuckers-projects.vercel.app)

### Test Scenarios

1. **Basic Question**: "How do I reset my password?"
2. **Billing Inquiry**: "I want a refund for my last order"
3. **Escalation Test**: "This is ridiculous! I want to speak to a manager!"

---

## 🔮 Roadmap

- [ ] Multi-channel support (Slack, Email, SMS)
- [ ] Custom model fine-tuning pipeline
- [ ] Multi-tenant SaaS architecture
- [ ] Integrations (Zendesk, Intercom, Salesforce)
- [ ] Voice support with real-time transcription

---

## 🏆 Built With Kiro

This project was built using [Kiro](https://kiro.dev/), an agentic AI development environment that enabled:

- **Spec-driven development** - Requirements → Design → Implementation
- **Rapid prototyping** - From idea to working product in days
- **Production-ready code** - Best practices baked in

---

## 📄 License

MIT License - feel free to use this for your own projects!

---

## 🙏 Acknowledgments

- Built for the [AI Agents Hackathon](https://luma.com/itb8v2wa) with Kiro
- Powered by [Claude](https://anthropic.com) from Anthropic
- Deployed on [Vercel](https://vercel.com)
- Database by [Neon](https://neon.tech)
