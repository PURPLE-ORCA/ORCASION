# 🧠 AI Integration Documentation

This document details the **Multi-Agent Architecture** at the core of Orcasion. Unlike standard chatbots, Orcasion employs a pipeline of specialized agents to gather context, research reality, and challenge decisions.

## 1. Core Philosophy: "Agentic Decision Making"

Orcasion is designed to be an **active consultant**. It does not just answer; it investigates.

- **Reasoning Checkpoints:** The model is forced to pause and validate data before proceeding.
- **Multi-Perspective:** It views every decision from multiple angles (Optimist, Skeptic, Strategist).
- **Grounded Reality:** It refuses to hallucinate prices or specs, opting to fetch them via the "Scout" agent.

## 2. The Multi-Agent Pipeline

The system uses a modular architecture where specialized agents handle distinct cognitive tasks.

### 🕵️‍♂️ The Scout (Research Agent)

- **Role:** Fetches real-time data from the web.
- **Mechanism:** Uses Google Search + Cheerio to scrape and summarize external URLs.
- **Trigger:** Activated when the user provides a URL or asks a question requiring current data (e.g., "Price of iPhone 16").

### 🥊 The Skeptic (Adversarial Agent)

- **Role:** Mitigates confirmation bias.
- **Mechanism:** A separate model instance prompted to aggressively challenge the user's preferred option.
- **Output:** A "Devil's Advocate" report highlighting risks and blind spots.

### ♟️ The Strategist (Risk & Opportunity)

- **Role:** Strategic foresight.
- **Mechanism:** Analyzes the decision matrix to identify second-order consequences.
- **Output:** "Primary Risk" and "Hidden Opportunity" insights.

### 🔮 The Pre-Mortem Simulator

- **Role:** Affective forecasting.
- **Mechanism:** Generates a narrative of the future (6 months later) based on the decision.
- **Goal:** To make abstract consequences feel emotional and real.

### 🛎️ The Concierge (Action Planner)

- **Role:** Execution.
- **Mechanism:** Generates a structured checklist of next steps.
- **Output:** A JSON object containing actionable tasks.

## 3. The "Reasoning Checkpoint" System

Unlike a continuous chat stream, Orcasion enforces strict checkpoints:

1.  **Input Analysis:** User input is parsed for intent and constraints.
2.  **Constraint Extraction:** Key variables (e.g., "Budget < $1000") are extracted into structured JSON.
3.  **Evaluation Matrix:** Options are scored against these constraints.
4.  **Synthesis:** The final recommendation is synthesized only after the matrix is complete.

## 4. Implementation Details

- **Model:** Google Gemini 2.0 Flash (for speed) and Gemini 2.5 Flash (for reasoning).
- **SDK:** `google-generative-ai`
- **Tool Use:** We utilize Gemini's native function calling for the "Scout" (web search) capability.
- **State Management:** The conversation state (Information Gathering vs. Decision Mode) is managed in the Convex backend, ensuring the AI follows the correct protocol at each stage.
