import React from 'react';
import { Sparkles, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t-4 border-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg border-2 border-black">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black text-white">WorkLess AI</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/privacy" className="text-slate-400 font-medium hover:text-purple-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-400 font-medium hover:text-purple-400 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-slate-400 font-medium hover:text-purple-400 transition-colors">Contact</Link>
            <Link to="/support" className="text-slate-400 font-medium hover:text-purple-400 transition-colors">Support</Link>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 WorkLess AI. All rights reserved.
          </p>
          
          <a href="mailto:iamsouravmaurya@gmail.com" className="flex items-center gap-2 text-slate-500 hover:text-purple-400 transition-colors text-sm">
            <Mail className="w-4 h-4" />
            iamsouravmaurya@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;