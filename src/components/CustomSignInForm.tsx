"use client";

import * as React from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { MagicCard } from "@/components/ui/magicCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function CustomSignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        console.error(JSON.stringify(result, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <MagicCard
        className="w-full max-w-md p-8 shadow-lg rounded-2xl"
        gradientColor="rgba(47, 2, 79, 0.5)"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              onChange={(e) => setEmailAddress(e.target.value)}
              value={emailAddress}
              placeholder="Email Address"
              type="email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              type="password"
            />
          </div>
          <div id="clerk-captcha"></div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <a href="/sign-up" className="text-purple-500 hover:underline">
              Sign Up
            </a>
          </p>
        </form>
      </MagicCard>
    </div>
  );
}
