import React, { useEffect, useState } from "react";
import { Users, BookOpen, PenTool } from "lucide-react";

const LiveStats = () => {
  const [stats, setStats] = useState({
    stories: 2500,
    writers: 1500,
    comments: 8200,
  });

  // Fake live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        stories: prev.stories + Math.floor(Math.random() * 3), // +0–2
        writers: prev.writers + (Math.random() > 0.7 ? 1 : 0), // random join
        comments: prev.comments + Math.floor(Math.random() * 5),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stat Card */}
      <div className="p-6 rounded-2xl bg-card/70 backdrop-blur border border-border shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold">{stats.stories.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Stories Published</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card/70 backdrop-blur border border-border shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-teal-600 text-white">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold">{stats.writers.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Active Writers</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card/70 backdrop-blur border border-border shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <PenTool className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold">{stats.comments.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Comments Shared</p>
        </div>
      </div>
    </div>
  );
};

export default LiveStats;
