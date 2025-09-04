"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AutoDMTemplatePage() {
  const [trigger, setTrigger] = useState("When someone sends any DM");
  const [response, setResponse] = useState(
    "Hey! Thanks for reaching out 👋 Here is the info you asked for: https://example.com"
  );

  return (
    <div className="grid gap-6 lg:gap-8 lg:grid-cols-12">
      {/* Left: DM mockup */}
      <div className="lg:col-span-7">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-base">Direct Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Incoming message */}
              <div className="flex items-start gap-2">
                <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">U</AvatarFallback></Avatar>
                <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm">
                  Hi! Can you send me the link?
                </div>
              </div>
              {/* Auto-reply */}
              <div className="flex items-start gap-2 justify-end">
                <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-3 py-2 text-sm whitespace-pre-wrap">
                  {response}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Process/Editor */}
      <div className="lg:col-span-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Respond to all your DMs</h2>
          <p className="text-sm text-muted-foreground">Automatically reply to inbound messages with a customizable response.</p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Trigger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={trigger} onChange={(e) => setTrigger(e.target.value)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Auto-reply message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea value={response} onChange={(e) => setResponse(e.target.value)} className="min-h-28" />
            <div className="flex gap-2">
              <Button>Save</Button>
              <Button variant="outline">Preview</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
