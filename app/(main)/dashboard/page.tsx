"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { cn } from "@/utils";

const DashboardPage = () => {

    const router = useRouter();

    const { user, signOut } = useClerk();
    const { isLoaded, isSignedIn } = useUser();

    const [syncing, setSyncing] = useState(true);
    const [checkingPages, setCheckingPages] = useState(false);

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;
        const sync = async () => {
            try {
                await fetch("/api/auth/sync", { method: "POST" });
            } catch (e) {
                console.error("Failed to sync user", e);
            } finally {
                setSyncing(false);
            }
        };
        sync();
    }, [isLoaded, isSignedIn]);

    useEffect(() => {
        if (!isLoaded || !isSignedIn || syncing) return;
        let cancelled = false;
        const checkPages = async () => {
            try {
                setCheckingPages(true);
                const res = await fetch("/api/pages");
                if (!res.ok) return;
                const data = await res.json();
                if (!cancelled && Array.isArray(data.pages) && data.pages.length === 0) {
                    router.replace("/auth/approval");
                }
            } catch (e) {
                console.error("Failed to load pages", e);
            } finally {
                if (!cancelled) setCheckingPages(false);
            }
        };
        checkPages();
        return () => { cancelled = true; };
    }, [isLoaded, isSignedIn, syncing, router]);

    const templates = [
        {
            title: "Auto-DM links from comments",
            desc: "Send a link when people comment on a post or reel",
            href: "/automation/templates/comment-reply",
            popular: true,
        },
        {
            title: "Generate leads with stories",
            desc: "Use limited-time offers in your Stories to convert",
            href: "/automation/templates/story-leads",
            popular: false,
        },
        {
            title: "Respond to all your DMs",
            desc: "Auto-send customized replies when people DM you",
            href: "/automation/templates/auto-dm",
            popular: false,
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold">Start Here</h1>
                <div className="mt-2 text-sm text-muted-foreground">
                    {syncing ? "Finalizing your account..." : checkingPages ? "Checking your connected pages..." : `Welcome${user?.firstName ? `, ${user.firstName}` : ""}!`}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground"></div>
                <Link href="/automation/templates" className="text-sm text-primary hover:underline">Explore all Templates</Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((t) => (
                    <Link key={t.title} href={t.href} className="group">
                        <Card className={cn("h-full transition-colors group-hover:border-primary/30")}> 
                            <CardHeader className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="text-base lg:text-lg">{t.title}</CardTitle>
                                    {t.popular && (
                                        <Badge variant="secondary" className="rounded-sm">POPULAR</Badge>
                                    )}
                                </div>
                                <CardDescription>{t.desc}</CardDescription>
                            </CardHeader>
                            <CardContent />
                            <CardFooter className="text-xs text-muted-foreground">
                                <div className="inline-flex items-center gap-1">
                                    <Zap className="h-3.5 w-3.5" />
                                    <span>Quick Automation</span>
                                </div>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="hidden">
                {/* Keep actions accessible for now (hidden); reintroduce in a later section */}
                <div className="flex items-center justify-center gap-4 mt-4">
                    <Button onClick={() => router.push("/")} variant="outline">
                        Back to home
                    </Button>
                    <Button onClick={() => signOut()}>
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage
