"use client";

import Link from "next/link";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { FlipWords } from "./ui/flip-words";
import SiriOrb from "./ui/SiriOrb";
import {
  Brain,
  Users,
  ListChecks,
  FastForward,
  FileText,
  MessageSquare,
  Shield,
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  const words = ["Decisions", "Choices", "Commitments", "Futures"];

  const features = [
    {
      title: "AI-Powered Decision Reports",
      description:
        "Get comprehensive analysis with pros, cons, and personalized recommendations for every decision.",
      icon: <FileText className="h-6 w-6 text-purple-400" />,
      image: "/img/Final Decision Rapport.png",
      className: "md:col-span-2 md:row-span-2",
    },
    {
      title: "Council of Perspectives",
      description:
        "Hear from diverse AI personas - The Optimist, The Skeptic, and more - to challenge your thinking.",
      icon: <Users className="h-6 w-6 text-purple-400" />,
      image: "/img/Councile Voting UI.png",
      className: "md:col-span-1 md:row-span-2",
    },
    {
      title: "Action Plans",
      description:
        "Transform decisions into actionable steps with AI-generated roadmaps.",
      icon: <ListChecks className="h-6 w-6 text-purple-400" />,
      image: "/img/Action plan.png",
      className: "md:col-span-1 md:row-span-2",
    },
    {
      title: "The Council Has Spoken",
      description:
        "See how your AI council votes on your options with detailed reasoning.",
      icon: <Brain className="h-6 w-6 text-purple-400" />,
      image: "/img/The Council Has Spoken.png",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      title: "The Skeptic's View",
      description:
        "Get critical analysis to identify potential pitfalls before you commit.",
      icon: <Shield className="h-6 w-6 text-purple-400" />,
      image: "/img/The Skeptic.png",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Reddit Scout",
      description:
        "Discover real experiences and opinions from Reddit communities.",
      icon: <MessageSquare className="h-6 w-6 text-purple-400" />,
      image: "/img/Reddit Scoute.png",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Fast Forward Simulation",
      description:
        "Visualize potential outcomes 6 months into the future with AI predictions.",
      icon: <FastForward className="h-6 w-6 text-purple-400" />,
      image: "/img/Fast Forward.png",
      className: "md:col-span-1 md:row-span-1",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none" />

        {/* SiriOrb */}
        <div className="relative z-10 mb-8">
          <SiriOrb />
        </div>

        {/* Headline with FlipWords */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Make Better
            <br />
            <FlipWords words={words} className="text-purple-500" />
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop overthinking. Start deciding. Orcasion is your personal AI
            assistant that cuts through the noise, analyzes your options, and
            helps you make better, faster decisions with confidence.
          </p>

          {/* CTA Button */}
          <Link href="/sign-in">
            <button className="group relative px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105">
              Get Started Free
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-purple-500/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-purple-500 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to make confident decisions, backed by AI
            </p>
          </div>

          <BentoGrid className="max-w-7xl mx-auto">
            {features.map((feature, i) => (
              <BentoGridItem
                key={i}
                title={feature.title}
                description={feature.description}
                header={
                  <div className="relative w-full flex-1 min-h-[8rem] rounded-xl overflow-hidden group">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  </div>
                }
                icon={feature.icon}
                className={`${feature.className} bg-black/50 backdrop-blur-sm border-purple-500/20 hover:border-purple-500/40 transition-all duration-300`}
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">
            Made with 💜 Passion 💜 By{" "}
            <a href="https://github.com/PURPLE-ORCA">PURPLE ORCA</a>
          </p>
          <p className="text-gray-500">
            Orcasion v1.5 © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
