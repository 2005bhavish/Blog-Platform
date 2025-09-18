import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Heart, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blog-surface border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                <PenTool className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Mitt Arv
              </h2>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A modern blogging platform for sharing your thoughts, stories, and insights with the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Home
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                About
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Contact
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Categories</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/category/technology" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Travel
              </Link>
              <Link to="/category/design" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Technology
              </Link>
              <Link to="/category/lifestyle" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Lifestyle
              </Link>
              <Link to="/category/travel" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Food
              </Link>
              <Link to="/category/travel" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Personal
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Stay Updated</h3>
            <p className="text-muted-foreground text-sm">
              Subscribe to our newsletter for the latest posts and updates.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <button className="w-full btn-hero text-sm py-2">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        
      </div>
    </footer>
  );
};

export default Footer;