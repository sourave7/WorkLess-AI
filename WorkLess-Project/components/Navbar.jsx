import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Support', path: '/support' },
    { name: 'Contact', path: '/contact' },
  ];

  if (user) {
    navLinks.push({ name: 'Dashboard', path: '/dashboard' });
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg border-2 border-black">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-white group-hover:text-purple-400 transition-colors">
              WorkLess AI
            </span>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`font-bold transition-colors ${
                  location.pathname === link.path
                    ? 'text-purple-400'
                    : 'text-white hover:text-purple-400'
                }`}
              >
                {link.name}
              </button>
            ))}

            {user ? (
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="bg-white hover:bg-slate-100 text-black font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pb-4 space-y-3"
          >
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg font-bold transition-colors ${
                  location.pathname === link.path
                    ? 'bg-purple-500 text-white'
                    : 'text-white hover:bg-slate-800'
                }`}
              >
                {link.name}
              </button>
            ))}
            
            <button
                onClick={() => {
                   navigate('/privacy');
                   setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg font-bold transition-colors ${
                  location.pathname === '/privacy' ? 'bg-purple-500 text-white' : 'text-white hover:bg-slate-800'
                }`}
              >
                Privacy Policy
            </button>
            <button
                onClick={() => {
                   navigate('/terms');
                   setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg font-bold transition-colors ${
                  location.pathname === '/terms' ? 'bg-purple-500 text-white' : 'text-white hover:bg-slate-800'
                }`}
              >
                Terms of Service
            </button>

            {user ? (
              <Button
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                variant="outline"
                className="w-full bg-white hover:bg-slate-100 text-black font-bold border-4 border-black"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button
                onClick={() => {
                  navigate('/auth');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold border-4 border-black"
              >
                Sign In
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;