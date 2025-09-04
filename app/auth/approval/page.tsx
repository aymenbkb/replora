"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ApprovalPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [working, setWorking] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      window.location.href = "/auth/sign-in";
    }
  }, [isLoaded, isSignedIn]);

  const startMeta = (platform: "facebook" | "instagram") => {
    setWorking(platform);
    window.location.href = `/api/oauth/meta/start?platform=${platform}`;
  };

  const startTelegram = () => {
    setWorking("telegram");
    window.location.href = "/api/oauth/telegram/start";
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Connect your social accounts</h1>
        <p className="text-sm text-muted-foreground mt-1">Approve access so we can automate replies and track leads.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Meta (Facebook & Instagram)</CardTitle>
          <CardDescription>Connect your Facebook Page and Instagram Account via Meta OAuth.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => startMeta("facebook")} disabled={working === "facebook"}>
            {working === "facebook" ? "Redirecting…" : "Connect Facebook"}
          </Button>
          <Button variant="outline" onClick={() => startMeta("instagram")} disabled={working === "instagram"}>
            {working === "instagram" ? "Redirecting…" : "Connect Instagram"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Telegram</CardTitle>
          <CardDescription>Connect your Telegram bot to enable auto-replies.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={startTelegram} disabled={working === "telegram"}>
            {working === "telegram" ? "Redirecting…" : "Connect with Telegram"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <div className="text-sm text-muted-foreground">
        Already connected? <Link className="text-primary hover:underline" href="/dashboard">Go to dashboard</Link>
      </div>
    </div>
  );
}
