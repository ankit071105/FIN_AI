# FinAI: Autonomous Financial Intelligence Terminal

## 🚀 What is FinAI?

FinAI is a next-generation **Autonomous Hedge Fund Simulator** and **Financial Intelligence Platform**. Unlike traditional dashboards that simply display data, FinAI uses a multi-agent AI system to **read, analyze, protect, and trade** on your behalf.

It runs entirely **locally** (offline), ensuring complete data privacy and zero API costs, powered by lightweight open-source models.

---

## 🧠 Key Capabilities

### 1. 📰 Live Intelligence Feed (The "Eyes")
*   **Real-Time Ingestion**: Continuously polls for financial news headlines.
*   **Instant Analysis**: An AI agent reads every headline in milliseconds, assigning a **Sentiment Score** (Bullish/Bearish) and an **Impact Rating** (High/Medium/Low).
*   **Smart Filtering**: Automatically deduplicates noise and highlights critical market-moving events.

### 2. 👻 Ghost Trader (The "Hands")
*   **Autonomous Execution**: A specialized "Trader Agent" watches the feed. When high-confidence opportunities arise, it simulates trades automatically.
*   **Portfolio Management**: Manages a simulated $100k portfolio, tracking cash balance, holdings, and P&L in real-time.
*   **Rational Decision Making**: Every trade comes with a generated reason (e.g., *"Bought AAPL because earnings beat estimates and sentiment is positive"*).

### 3. 🛡️ Macro Sentinel (The "Shield")
*   **Global Risk Monitoring**: A background agent constantly scans global economic indicators (VIX, Bond Yields, Oil).
*   **Regime Detection**: Determines if the market is in **"Risk-On"** (Safe to trade) or **"Risk-Off"** (Danger) mode.
*   **Circuit Breaker**: If the Macro Sentinel detects a storm, it **blocks** the Ghost Trader from opening new risky positions, protecting your capital.

### 4. 🕵️ Forensic Accountant (The "Auditor")
*   **Fraud Detection**: A dedicated agent scans news specifically for corporate red flags (e.g., "Auditor Resignation", "SEC Probe", "Accounting Irregularities").
*   **Risk Scoring**: Assigns a "Forensic Risk Score" to every ticker. High scores trigger immediate warnings and block trading activity for that stock.

### 5. 💬 Local RAG Chat (The "Analyst")
*   **Private AI Assistant**: Chat with your financial data. Ask questions like *"Why is Apple down today?"* or *"Summarize the latest news on Tesla."*
*   **Retrieval Augmented Generation (RAG)**: The AI searches your local database of news, retrieves relevant facts, and generates an answer with **citations**—all without sending data to the cloud.

### 6. 👥 Community & Sentiment Engine (The "Pulse")
*   **Social Sentiment**: A built-in platform for traders to discuss news, vote "Bullish" or "Bearish", and share insights.
*   **Contrarian Signals**: The system detects **Divergence**. If the AI predicts "Growth" but the Community votes "Bearish", it flags a "High Volatility Warning," alerting you to potential market irrationality.

### 7. 🕸️ Deep Explainability (The "Why")
*   **Visual Thought Bubbles**: Watch the AI think in real-time. See it scan for macro risks, run forensic checks, and make trading decisions step-by-step.
*   **Supply Chain Graph**: An interactive network graph showing how news affects related companies (e.g., *Bad news for TSMC -> Risk for Apple*).
*   **Insight Boxes**: Auto-generated explanations below every chart to help you understand the "Why" behind the data.

---

## 🛠️ Technology Stack

*   **Frontend**: React, TypeScript, Tailwind CSS, Recharts, Framer Motion, React Force Graph.
*   **Backend**: Python, FastAPI, SQLite, ChromaDB (Vector Store).
*   **AI Core**: LangGraph (Agent Orchestration), Sentence-Transformers (Embeddings), Flan-T5 (Local LLM).
*   **Infrastructure**: 100% Local Monolith (No Docker/Cloud required).

---

## 🎯 The Goal
FinAI demonstrates the future of finance: **Agentic Workflows**. It moves beyond passive data consumption to active, autonomous financial defense and offense.
