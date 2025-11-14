export const allPrompts = [
  "Which phone should I buy?",
  "Should I take this new job offer?",
  "What should I have for dinner tonight?",
  "Where should I go for my next vacation?",
  "Should I move to a new city?",
  "What's the best way to invest $1000?",
  "Which car should I buy?",
  "Should I learn to code or design?",
  "What kind of dog should I get?",
  "Is it better to rent or buy a house?",
  "Which laptop is best for video editing?",
  "Should I start my own business?",
  "What's a good gift for my anniversary?",
  "How can I decide on a college major?",
  "Should I ask for a raise?",
  "Which gym should I join?",
  "What's the best credit card for travel rewards?",
  "Should I go back to school?",
  "What programming language should I learn first?",
  "How should I decorate my living room?",
];

// Function to get N random items from an array
export function getRandomPrompts(arr: string[], n: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}
