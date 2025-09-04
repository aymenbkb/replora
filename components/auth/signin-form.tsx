"use client";

import { Button } from "@/components/ui/button";
import { useSignIn } from "@clerk/nextjs";
import { Apple, Facebook, LoaderIcon, Chrome } from "lucide-react";
import React, { useState } from "react";

const SignInForm = () => {
    const { signIn, isLoaded } = useSignIn();
    const [loading, setLoading] = useState<string | null>(null);

    const startOAuth = async (strategy: "oauth_google" | "oauth_facebook" | "oauth_apple") => {
        if (!isLoaded || !signIn) return;
        try {
            setLoading(strategy);
            await signIn.authenticateWithRedirect({
                strategy,
                redirectUrl: "/auth/auth-callback",
                redirectUrlComplete: "/dashboard",
            });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex flex-col items-start gap-y-4 py-8 w-full px-0.5">
            <h2 className="text-2xl font-semibold">Sign in to Linkify</h2>

            <div className="w-full space-y-3">
                <Button
                    type="button"
                    disabled={!isLoaded || !!loading}
                    onClick={() => startOAuth("oauth_google")}
                    className="w-full flex items-center justify-center gap-2"
                >
                    {loading === "oauth_google" ? (
                        <LoaderIcon className="w-5 h-5 animate-spin" />
                    ) : (
                        <Chrome className="w-5 h-5" />
                    )}
                    Continue with Google
                </Button>
                <Button
                    type="button"
                    disabled={!isLoaded || !!loading}
                    onClick={() => startOAuth("oauth_facebook")}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                >
                    {loading === "oauth_facebook" ? (
                        <LoaderIcon className="w-5 h-5 animate-spin" />
                    ) : (
                        <Facebook className="w-5 h-5" />
                    )}
                    Continue with Facebook
                </Button>
                <Button
                    type="button"
                    disabled={!isLoaded || !!loading}
                    onClick={() => startOAuth("oauth_apple")}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                >
                    {loading === "oauth_apple" ? (
                        <LoaderIcon className="w-5 h-5 animate-spin" />
                    ) : (
                        <Apple className="w-5 h-5" />
                    )}
                    Continue with Apple
                </Button>
            </div>
        </div>
    );
};

export default SignInForm
