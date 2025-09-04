"use client";

import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
    children: React.ReactNode;
}

const Providers = ({ children }: Props) => {

    const client = new QueryClient();
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

    return (
        <QueryClientProvider client={client}>
            <ClerkProvider publishableKey={publishableKey}>
                {children}
            </ClerkProvider>
        </QueryClientProvider>
    )
};

export default Providers
