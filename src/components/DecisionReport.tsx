"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useAction } from "convex/react"; // Changed useMutation to useAction
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface DecisionReportProps {
  decisionId: Id<"decisions">;
}

const DecisionReport: React.FC<DecisionReportProps> = ({ decisionId }) => {
  const decisionContext = useQuery(api.decision_context.getDecisionContext, {
    decisionId,
  });

  const recalculateDecision = useAction(api.ai.recalculateDecision); // Use the new action

  const [localCriteria, setLocalCriteria] = useState(decisionContext?.criteria || []);

  useEffect(() => {
    if (decisionContext?.criteria) {
      setLocalCriteria(decisionContext.criteria);
    }
  }, [decisionContext?.criteria]);

  if (!decisionContext) {
    return (
      <div className="flex items-center justify-center mt-8">
        <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { finalChoice, confidenceScore, reasoning, options } = decisionContext;

  const handleWeightChange = (index: number, newWeight: number[]) => {
    setLocalCriteria((prevCriteria) =>
      prevCriteria.map((criterion, i) =>
        i === index ? { ...criterion, weight: newWeight[0] } : criterion
      )
    );
  };

  const handleRecalculate = async () => {
    await recalculateDecision({
      decisionId,
      criteria: localCriteria,
    });
  };

  return (
    <Card className="mt-8 w-full max-w-3xl mx-auto bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-purple-400">
          Decision Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader>
            <CardTitle className="text-xl text-green-400">
              Final Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg">
            <p className="text-2xl font-bold">{finalChoice}</p>
            <p className="mt-2">
              <span className="font-semibold">Confidence Score:</span>{" "}
              {(confidenceScore * 100).toFixed(0)}%
            </p>
            <Separator className="my-4 bg-gray-600" />
            <p>
              <span className="font-semibold">Reasoning:</span> {reasoning}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-gray-600">
          <CardHeader>
            <CardTitle className="text-xl">Your Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {localCriteria.map((criterion, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="w-32">{criterion.name}</span>
                  <Slider
                    defaultValue={[criterion.weight]}
                    max={10}
                    step={0.1}
                    onValueChange={(newWeight) => handleWeightChange(index, newWeight)}
                    className="flex-1"
                  />
                  <span className="w-10 text-right">{criterion.weight.toFixed(1)}</span>
                </div>
              ))}
            </div>
            <Button onClick={handleRecalculate} className="mt-6 w-full">
              Recalculate Decision
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-gray-600">
          <CardHeader>
            <CardTitle className="text-xl">Options Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-600">
                  <TableHead className="text-white">Option</TableHead>
                  <TableHead className="text-white">Score</TableHead>
                  <TableHead className="text-white">Pros</TableHead>
                  <TableHead className="text-white">Cons</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {options.map((option, index) => (
                  <TableRow key={index} className="border-gray-600">
                    <TableCell className="font-bold">{option.name}</TableCell>
                    <TableCell>{option.score.toFixed(2)}</TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside text-green-300">
                        {option.pros.map((pro, i) => (
                          <li key={i}>{pro}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside text-red-300">
                        {option.cons.map((con, i) => (
                          <li key={i}>{con}</li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default DecisionReport;