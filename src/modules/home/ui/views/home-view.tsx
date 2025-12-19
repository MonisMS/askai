"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Video, MessageSquare, Plus, ArrowRight, Sparkles, Users, Calendar } from "lucide-react";
import Link from "next/link";

export const HomeView = () => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            AI-Powered Meetings
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Welcome to <span className="text-primary">AskAI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create custom AI agents and have real-time video conversations with them. 
            Perfect for practice interviews, learning, brainstorming, or just having a chat.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <Link href="/agents">
            <Card className="hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">My Agents</CardTitle>
                    <CardDescription>View and manage your AI agents</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="gap-2 p-0 h-auto text-primary">
                  Go to Agents <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/meetings">
            <Card className="hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Video className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">My Meetings</CardTitle>
                    <CardDescription>View your scheduled and past meetings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="gap-2 p-0 h-auto text-primary">
                  Go to Meetings <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto p-4 rounded-full bg-primary/10 text-primary w-fit mb-2">
                  <Plus className="h-8 w-8" />
                </div>
                <CardTitle className="text-lg">1. Create an Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Go to <span className="font-semibold">Agents</span> and create a new AI agent. 
                  Give it a name and custom instructions to define its personality and expertise.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto p-4 rounded-full bg-primary/10 text-primary w-fit mb-2">
                  <Calendar className="h-8 w-8" />
                </div>
                <CardTitle className="text-lg">2. Schedule a Meeting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Go to <span className="font-semibold">Meetings</span> and create a new meeting. 
                  Select which agent you want to talk with and give the meeting a name.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto p-4 rounded-full bg-primary/10 text-primary w-fit mb-2">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <CardTitle className="text-lg">3. Start Your Call</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join the meeting and have a real-time video conversation with your AI agent. 
                  Get transcripts and summaries after the call.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card border">
              <Bot className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Custom AI Agents</h3>
                <p className="text-sm text-muted-foreground">Create agents with unique personalities</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card border">
              <Video className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Video Meetings</h3>
                <p className="text-sm text-muted-foreground">Real-time video calls with AI</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card border">
              <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Transcripts</h3>
                <p className="text-sm text-muted-foreground">Get transcripts of your conversations</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card border">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">AI Summaries</h3>
                <p className="text-sm text-muted-foreground">Automatic meeting summaries</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-6">
            <div>
              <h3 className="text-xl font-bold mb-1">Ready to get started?</h3>
              <p className="text-primary-foreground/80">Create your first AI agent and schedule a meeting today.</p>
            </div>
            <Link href="/agents">
              <Button variant="secondary" size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Agent
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
 
