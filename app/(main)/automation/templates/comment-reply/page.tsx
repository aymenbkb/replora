"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Lead {
  id: string;
  name: string;
  comment: string;
}

export default function CommentReplyTemplatePage() {
  const [postCaption, setPostCaption] = useState<string>(
    "New launch! Comment 'LINK' to get the access URL 🔗"
  );
  const [leads, setLeads] = useState<Lead[]>([
    { id: "1", name: "Ava", comment: "LINK" },
    { id: "2", name: "Leo", comment: "I want it! LINK" },
  ]);

  const [leadName, setLeadName] = useState("");
  const [leadComment, setLeadComment] = useState("LINK");

  const canAdd = useMemo(
    () => leadName.trim().length > 0 && leadComment.trim().length > 0,
    [leadName, leadComment]
  );

  const addLead = () => {
    if (!canAdd) return;
    setLeads((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: leadName.trim(), comment: leadComment.trim() },
    ]);
    setLeadName("");
    setLeadComment("LINK");
  };

  return (
    <div className="grid gap-6 lg:gap-8 lg:grid-cols-12">
      {/* Left: Instagram mockup */}
       <div className="lg:col-span-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">When someone comments on your post</h2>
          <p className="text-sm text-muted-foreground">Set up an auto-reply that sends your link via DM.</p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Post content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={postCaption}
              onChange={(e) => setPostCaption(e.target.value)}
              className="min-h-24"
            />
            <p className="text-xs text-muted-foreground">Caption shown in the mockup above.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Add a lead (simulated)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="Name (e.g. Alex)"
              />
              <Input
                value={leadComment}
                onChange={(e) => setLeadComment(e.target.value)}
                placeholder="Comment keyword (e.g. LINK)"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={addLead} disabled={!canAdd}>Add lead</Button>
              <Button variant="outline" onClick={() => setLeads([])}>Clear</Button>
            </div>
            <p className="text-xs text-muted-foreground">Added leads appear as comments in the mockup on the left.</p>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2">
          <Badge variant="outline">Trigger: Comment contains keyword</Badge>
          <Badge variant="outline">Action: Send DM with link</Badge>
        </div>
      </div>
      {/* Right: Process/Editor */}
      <div className="lg:col-span-7">
        <Card className="overflow-hidden">
          <CardHeader className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage alt="brand" src="/icons/logo.png" />
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">brand_official</span>
                <span className="text-xs text-muted-foreground">Sponsored</span>
              </div>
            </div>
          </CardHeader>
          <div className="relative aspect-[4/3] bg-muted">
            {/* Post media placeholder */}
            <Image
              src="/assets/blog1.jpg"
              alt="Post"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <CardContent className="p-0">
            <div className="px-4 py-3 space-y-3">
              <div className="text-sm"><span className="font-semibold">brand_official</span> {postCaption}</div>
              <div className="space-y-3">
                {leads.map((l) => (
                  <div key={l.id} className="flex items-start gap-3">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[10px]">{l.name[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <span className="font-semibold mr-2">{l.name}</span>
                      <span className="text-foreground/90">{l.comment}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <Input placeholder="Add a comment..." disabled className="h-9" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
     
    </div>
  );
}
