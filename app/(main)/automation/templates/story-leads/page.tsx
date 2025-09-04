"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function StoryLeadsTemplatePage() {
  const [offer, setOffer] = useState("Flash sale! Reply 'DEAL' to get your coupon.");
  const [cta, setCta] = useState("Swipe up or reply DEAL");

  return (
    <div className="grid gap-6 lg:gap-8 lg:grid-cols-12">
      {/* Left: Story mockup */}
      <div className="lg:col-span-7">
        <Card className="overflow-hidden">
          <div className="aspect-[9/16] bg-gradient-to-b from-primary/20 to-muted flex items-center justify-center">
            <div className="text-center space-y-2 p-6">
              <div className="text-xl font-semibold">Your Story</div>
              <div className="text-sm text-foreground/80">{offer}</div>
              <Button size="sm" className="mt-4">{cta}</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Right: Process/Editor */}
      <div className="lg:col-span-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Generate leads with stories</h2>
          <p className="text-sm text-muted-foreground">Use a limited-time offer with a reply keyword to capture leads.</p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Offer text</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea value={offer} onChange={(e) => setOffer(e.target.value)} className="min-h-24" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">CTA button</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={cta} onChange={(e) => setCta(e.target.value)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
