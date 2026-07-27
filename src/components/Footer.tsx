import React from 'react';
import { Github, Twitter, Linkedin, Heart, Compass, Shield, Terminal, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-zinc-800 pt-16 pb-8 transition-colors duration-500 relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center">
                <Compass className="w-4 h-4 text-white dark:text-zinc-950" />
              </div>
              <h2 className="font-display text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                TravixIQ
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
              The next-generation intelligence cockpit for global travelers. Plan smarter, travel safer, and explore better with AI.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-cyan-600 dark:text-zinc-500 dark:hover:text-cyan-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-600 dark:text-zinc-500 dark:hover:text-cyan-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-600 dark:text-zinc-500 dark:hover:text-cyan-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Links Col 1 */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Platform</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-zinc-400">
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Smart Planner</a></li>
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Scam Shield</a></li>
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Travel Pulse</a></li>
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Budget Optimizer</a></li>
            </ul>
          </div>
          
          {/* Links Col 2 */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-zinc-400">
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Blog</a></li>
            </ul>
          </div>
          
          {/* Badge Col */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Status</h3>
            <div className="bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-zinc-400">System</span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-zinc-400">AI Engine</span>
                <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">Gemini 3.1</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 dark:text-zinc-500">
            © {new Date().getFullYear()} TravixIQ. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-zinc-500">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500" />
            <span>for the modern nomad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
