import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PenTool, Users, Sparkles, ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-blog.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Animated Gradient Background with Blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-500 rounded-full blur-[150px] opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[130px] opacity-20 animate-float"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Create • Share • Inspire
                </span>
              </div>

              {/* Main Title */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  Write Your
                  <span className="bg-gradient-primary bg-clip-text text-transparent block">
                    Legacy
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                  Transform your thoughts into timeless stories. Join a
                  community where every voice matters and creativity knows no
                  bounds.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-hero group" size="lg" asChild>
                  <Link to="/register">
                    <PenTool className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Start Your Journey
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="group" asChild>
                  <Link to="/about">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Demo
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-8">
                <div className="flex -space-x-2">
                  {[
                    "https://i.pravatar.cc/100?img=1",
                    "https://i.pravatar.cc/100?img=2",
                    "https://i.pravatar.cc/100?img=3",
                    "https://i.pravatar.cc/100?img=4",
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`User ${i + 1}`}
                      className="w-10 h-10 rounded-full border-2 border-background object-cover"
                    />
                  ))}
                </div>

                <div>
                  <p className="text-sm font-medium">Join 2,500+ writers</p>
                  <p className="text-xs text-muted-foreground">
                    Already sharing their stories
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content - Image Showcase */}
            <div className="relative animate-slide-in-right">
              <img
                src={heroImage}
                alt="Hero Writing"
                className="rounded-3xl shadow-2xl border border-border/50"
              />

              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-background border border-border rounded-2xl p-4 shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">2.5K+ Stories</p>
                    <p className="text-xs text-muted-foreground">
                      Published this month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
