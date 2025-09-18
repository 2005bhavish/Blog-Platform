import React from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mocked categories from your database
const categories = [
  {
    name: "Travel",
    slug: "travel",
    description: "Travel experiences and guides",
    color: "#f59e0b",
  },
  {
    name: "Technology",
    slug: "technology",
    description: "Posts about technology and programming",
    color: "#3b82f6",
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Personal stories and lifestyle content",
    color: "#10b981",
  },
  {
    name: "Food",
    slug: "food",
    description: "Recipes and food experiences",
    color: "#ef4444",
  },
  {
    name: "Personal",
    slug: "personal",
    description: "Personal thoughts and reflections",
    color: "#8b5cf6",
  },
];

const Categories: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-primary font-medium hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">
        Explore Categories
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div
            key={cat.slug}
            className="relative p-6 rounded-3xl shadow-2xl border border-border/50 hover:scale-105 transform transition-transform duration-300"
            style={{
              background: `linear-gradient(135deg, ${cat.color}20, ${cat.color}10)`,
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${cat.color}30` }}
              >
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold">{cat.name}</h2>
            </div>
            <p className="text-muted-foreground mb-4">{cat.description}</p>
            <span className="text-sm font-medium text-primary">View Posts</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
