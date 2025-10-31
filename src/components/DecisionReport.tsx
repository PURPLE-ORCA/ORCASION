"use client";

import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface DecisionReportProps {
  decisionId: Id<"decisions">;
}

const DecisionReport: React.FC<DecisionReportProps> = ({ decisionId }) => {
  const decisionContext = useQuery(api.decision_context.getDecisionContext, {
    decisionId,
  });

  if (!decisionContext) {
    return null; // Or a loading spinner
  }

  const { finalChoice, confidenceScore, reasoning, criteria, options } = decisionContext;

  return (
    <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg text-white w-full max-w-2xl">
      <h2 className="text-3xl font-bold mb-4 text-purple-400">Decision Report</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Final Recommendation:</h3>
        <p className="text-2xl font-bold text-green-400">{finalChoice}</p>
        <p className="text-lg mt-2">Confidence Score: {(confidenceScore * 100).toFixed(0)}%</p>
        <p className="mt-4">Reasoning: {reasoning}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Criteria:</h3>
        <ul className="list-disc list-inside">
          {criteria.map((criterion, index) => (
            <li key={index}>{criterion.name} (Weight: {criterion.weight.toFixed(1)})</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Options:</h3>
        {options.map((option, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-700 rounded-md">
            <p className="text-xl font-bold mb-1">{option.name} (Score: {option.score.toFixed(2)})</p>
            <div className="ml-4">
              <p className="font-semibold">Pros:</p>
              <ul className="list-disc list-inside text-green-300">
                {option.pros.map((pro, i) => (
                  <li key={i}>{pro}</li>
                ))}
              </ul>
              <p className="font-semibold mt-2">Cons:</p>
              <ul className="list-disc list-inside text-red-300">
                {option.cons.map((con, i) => (
                  <li key={i}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DecisionReport;
