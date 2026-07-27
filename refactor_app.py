import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Hide sidebar on mobile: replace `w-full md:w-64` with `hidden md:flex w-64`
content = content.replace('className="w-full md:w-64 flex-shrink-0 md:min-h-screen', 'className="hidden md:flex w-64 flex-shrink-0 md:min-h-screen')

# Also ensure `app-wrapper` has `overflow-x-hidden` (it already does, but let's make sure it doesn't have min-h-screen if we want to account for bottom nav. Wait, `min-h-screen` is fine, but we should add padding to the bottom of the main viewport on mobile.
content = content.replace(
    'className="flex-grow p-6 relative z-10 max-w-7xl w-full mx-auto pb-24 md:pb-8"',
    'className="flex-grow p-6 relative z-10 max-w-7xl w-full mx-auto pb-32 md:pb-8 animate-fade-in"'
)

# Add Bottom Nav
bottom_nav = """
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-t border-gray-200 dark:border-zinc-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
        <div className="flex items-center overflow-x-auto hide-scrollbar px-2 py-2 gap-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate('/' + item.id)}
                className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[72px] min-h-[44px] rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-cyan-600 dark:text-cyan-400' 
                    : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:scale-[1.02]'
                }`}
              >
                <div className={`p-1.5 rounded-lg mb-0.5 ${isActive ? 'bg-cyan-100 dark:bg-cyan-900/40' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[9px] font-semibold tracking-wide truncate max-w-[68px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
"""
content = re.sub(r'    </div>\n  \);\n\}', bottom_nav + '\n}', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
