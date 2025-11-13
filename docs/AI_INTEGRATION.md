# 🧠 AI Integration Documentation

This document details the architecture and prompting strategy for the AI at the core of Orcasion.

## 1. Core Philosophy

The AI is designed to be an **active interviewer**, not a passive answerer. Its primary goal is to gather sufficient context *before* making a recommendation. This is achieved through a state-driven prompt that forces the AI into one of two modes: "Information Gathering" or "Decision Making."

## 2. The State Machine Prompt

The entire AI logic is controlled by a single, powerful system prompt located in `convex/ai.ts`. This prompt dynamically changes the AI's behavior based on the length of the conversation.

### State 1: Information Gathering Mode

-   **Trigger:** The number of user messages in the conversation is **fewer than 3**.
-   **AI's Goal:** To ask a single, targeted clarifying question to understand the user's needs better.
-   **AI's Action:** The AI **must** ask a question and provide 2-4 concise, relevant suggested answers for the user to click.
-   **Output Format:** The AI is constrained to return a specific JSON object:
    ```json
    {
      "question": "Your clarifying question here?",
      "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
    }
    ```

This mode forces a multi-turn conversation, preventing the AI from jumping to a conclusion with insufficient data.

### State 2: Decision Mode

-   **Trigger:** The number of user messages is **3 or more**.
-   **AI's Goal:** To determine if it has enough information to generate a high-quality decision matrix.
-   **AI's Action:**
    1.  **Evaluate:** First, it checks if it has clear options, criteria, and user priorities.
    2.  **Inquire Further:** If critical information is still missing, it will ask another clarifying question (staying in "Information Gathering Mode").
    3.  **Generate Report:** If and only if it has enough data, it will generate the final decision.
-   **Output Format:** The AI is constrained to return a comprehensive JSON object for the final report:
    ```json
    {
      "decision": {
        "finalChoice": "Recommended Option Name",
        "confidenceScore": 0.95,
        "reasoning": "A concise explanation of why this option is recommended."
      },
      "criteria": [{ "name": "Criterion 1", "weight": 0.8 }],
      "options": [
        {
          "name": "Option A",
          "pros": ["Pro 1"],
          "cons": ["Con 1"],
          "score": 0.9
        }
      ]
    }
    ```

## 3. Implementation in Convex

-   **The `ai.ts` file:** This file contains the `getAiResponse` Convex action, which is the single point of contact with the Huawei Cloud AI model.
-   **Contextual Payload:** On every call, the frontend sends the entire message history for the current decision. The `getAiResponse` action enriches this with the system prompt, including the current `userMessageCount`, before sending it to the AI.
-   **Parsing the Response:** The action is responsible for parsing the JSON response from the AI and storing it in the appropriate database tables (`decision_messages` or `decision_context`).

This state-driven, structured-output approach is the key to making the AI reliable, predictable, and genuinely helpful.
