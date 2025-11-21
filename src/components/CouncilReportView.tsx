"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, Users, Clock, MessageSquare } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface CouncilReportViewProps {
  decisionId: Id<"decisions">;
  onClose: () => void;
  onSwitchToReport: () => void;
}

const CouncilReportView: React.FC<CouncilReportViewProps> = ({
  decisionId,
  onClose,
  onSwitchToReport,
}) => {
  const decisionContext = useQuery(api.decision_context.getDecisionContext, {
    decisionId,
  });
  const councilVotes = useQuery(api.council.getVotes, { decisionId });

  if (!decisionContext || !councilVotes) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-950 text-white">
        <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { options } = decisionContext;

  // Prepare data for bar chart (vote distribution)
  const voteDistribution = options.map((option) => {
    const voteCount = councilVotes.filter(
      (v) => v.optionName === option.name
    ).length;
    const percentage =
      councilVotes.length > 0 ? (voteCount / councilVotes.length) * 100 : 0;
    return {
      option: option.name,
      votes: voteCount,
      percentage: percentage.toFixed(0),
    };
  });

  // Prepare data for radar chart (option scores vs council votes)
  const radarData = options.map((option) => {
    const voteCount = councilVotes.filter(
      (v) => v.optionName === option.name
    ).length;
    const voteScore =
      councilVotes.length > 0 ? (voteCount / councilVotes.length) * 100 : 0;
    return {
      option:
        option.name.length > 15
          ? option.name.substring(0, 15) + "..."
          : option.name,
      aiScore: option.score * 10, // Scale to 0-100
      councilScore: voteScore,
    };
  });

  const barChartConfig = {
    votes: {
      label: "Votes",
      color: "hsl(270, 100%, 65%)", // Purple
    },
  } satisfies ChartConfig;

  const radarChartConfig = {
    aiScore: {
      label: "AI Score",
      color: "hsl(270, 100%, 65%)", // Purple
    },
    councilScore: {
      label: "Council Score",
      color: "hsl(280, 100%, 75%)", // Lighter purple
    },
  } satisfies ChartConfig;

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-slate-950 text-white w-full h-full overflow-y-auto hide-scrollbar p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-400" />
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            The Council Has Spoken
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSwitchToReport}
            title="Back to Report"
            className="hover:bg-purple-500/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            title="Close Panel"
            className="hover:bg-purple-500/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {councilVotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Users className="w-16 h-16 text-purple-400/50" />
          <p className="text-purple-300 text-lg font-medium">
            No votes yet. Share the link to gather wisdom!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader className="pb-2">
                <CardDescription className="text-purple-300">
                  Total Votes
                </CardDescription>
                <CardTitle className="text-4xl text-white">
                  {councilVotes.length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader className="pb-2">
                <CardDescription className="text-purple-300">
                  With Comments
                </CardDescription>
                <CardTitle className="text-4xl text-white">
                  {councilVotes.filter((v) => v.comment).length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader className="pb-2">
                <CardDescription className="text-purple-300">
                  Top Choice
                </CardDescription>
                <CardTitle className="text-2xl text-white truncate">
                  {voteDistribution.sort((a, b) => b.votes - a.votes)[0]
                    ?.option || "N/A"}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart - Vote Distribution */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Vote Distribution</CardTitle>
                <CardDescription className="text-purple-300">
                  How your council voted
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={barChartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={voteDistribution}
                    layout="vertical"
                    margin={{
                      right: 16,
                    }}
                  >
                    <CartesianGrid
                      horizontal={false}
                      stroke="hsl(270, 50%, 20%)"
                    />
                    <YAxis
                      dataKey="option"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) =>
                        value.length > 20
                          ? value.substring(0, 20) + "..."
                          : value
                      }
                      hide
                    />
                    <XAxis dataKey="votes" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Bar
                      dataKey="votes"
                      layout="vertical"
                      fill="hsl(270, 100%, 65%)"
                      radius={4}
                    >
                      <LabelList
                        dataKey="option"
                        position="insideLeft"
                        offset={8}
                        className="fill-white"
                        fontSize={12}
                      />
                      <LabelList
                        dataKey="votes"
                        position="right"
                        offset={8}
                        className="fill-purple-200"
                        fontSize={12}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Radar Chart - AI vs Council */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader className="items-center">
                <CardTitle className="text-white">AI vs Council</CardTitle>
                <CardDescription className="text-purple-300">
                  Comparing perspectives
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-0">
                <ChartContainer
                  config={radarChartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <RadarChart data={radarData}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <PolarAngleAxis
                      dataKey="option"
                      tick={{ fill: "hsl(270, 80%, 80%)", fontSize: 11 }}
                    />
                    <PolarGrid stroke="hsl(270, 50%, 30%)" />
                    <Radar
                      dataKey="aiScore"
                      fill="hsl(270, 100%, 65%)"
                      fillOpacity={0.3}
                      stroke="hsl(270, 100%, 65%)"
                      strokeWidth={2}
                      dot={{
                        r: 4,
                        fillOpacity: 1,
                      }}
                    />
                    <Radar
                      dataKey="councilScore"
                      fill="hsl(280, 100%, 75%)"
                      fillOpacity={0.3}
                      stroke="hsl(280, 100%, 75%)"
                      strokeWidth={2}
                      dot={{
                        r: 4,
                        fillOpacity: 1,
                      }}
                    />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Voter List & Comments */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-white">Council Members</CardTitle>
              </div>
              <CardDescription className="text-purple-300">
                All votes and comments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {councilVotes.map((vote, i) => (
                  <div
                    key={i}
                    className="bg-slate-900/50 border border-purple-500/20 p-4 rounded-lg hover:border-purple-500/40 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                          {vote.voterName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-purple-300">
                            {vote.voterName}
                          </p>
                          <p className="text-xs text-purple-400/60">
                            voted for{" "}
                            <span className="text-white font-medium">
                              {vote.optionName}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-purple-400/60">
                        <Clock className="h-3 w-3" />
                        {formatTime(vote.timestamp)}
                      </div>
                    </div>
                    {vote.comment && (
                      <div className="mt-3 pl-10">
                        <p className="text-sm text-purple-100 italic border-l-2 border-purple-500/50 pl-3">
                          "{vote.comment}"
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CouncilReportView;
