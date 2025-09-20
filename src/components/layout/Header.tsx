import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenTool, Plus, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-slate-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Left Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-slate-300 hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-slate-300 hover:text-cyan-400 transition-colors">
            About
          </Link>
        </nav>

        {/* Logo Center */}
        <Link to="/" className="flex items-center space-x-2 group">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.1 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md"
          >
            <PenTool className="w-6 h-6 text-white" />
          </motion.div>
          <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition">
            Mitt Arv
          </span>
        </Link>

        {/* Right Nav */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button
                onClick={() => navigate('/create')}
                className="hidden sm:flex rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow hover:opacity-90"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Write
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-cyan-500/40"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || ''} alt={user.name || ''} />
                      <AvatarFallback>
                        {(user.name || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-800 text-white" align="end" forceMount>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{user.name || 'User'}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Write a Post
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} disabled={loading}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                disabled={loading}
                className="text-slate-300 hover:text-cyan-400"
              >
                Sign In
              </Button>
              <Button 
                className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow hover:opacity-90" 
                onClick={() => navigate('/register')}
                disabled={loading}
              >
                Get Started
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-300 hover:text-cyan-400"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <motion.nav 
          initial={{ height: 0, opacity: 0 }} 
          animate={{ height: "auto", opacity: 1 }}
          className="md:hidden px-4 pb-4 flex flex-col space-y-4 bg-slate-900/95 backdrop-blur"
        >
          <Link to="/" className="text-slate-300 hover:text-cyan-400">Home</Link>
          <Link to="/about" className="text-slate-300 hover:text-cyan-400">About</Link>
          <Link to="/categories" className="text-slate-300 hover:text-cyan-400">Categories</Link>
        </motion.nav>
      )}
    </header>
  );
};

export default Header;
