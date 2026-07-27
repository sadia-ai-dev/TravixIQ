import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Make the stat cards have hover effect
stat_card_class = r'bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex items-center gap-3'
stat_card_new = r'bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex items-center gap-3 hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-md'
content = content.replace(stat_card_class, stat_card_new)

# Quick navigation action buttons hover effect
quick_nav_class = r'p-3 bg-white dark:bg-zinc-900/80 hover:bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-700 rounded-xl text-center space-y-2 group transition-all cursor-pointer animate-slide-up delay-\$\{\(index \+ 1\) \* 100\}'
quick_nav_new = r'p-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md hover:bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-700 rounded-xl text-center space-y-2 group cursor-pointer animate-slide-up delay-${(index + 1) * 100} hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-md'
content = content.replace(quick_nav_class, quick_nav_new)

# Other large cards
large_card_class = r'bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4'
large_card_new = r'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4 shadow-sm'
content = content.replace(large_card_class, large_card_new)

# Planner Cockpit button hover effect
content = content.replace(
    'px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-900 dark:text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-600/10 transition-all flex items-center gap-1.5 cursor-pointer',
    'px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-900 dark:text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-600/10 hover:shadow-cyan-600/20 hover:scale-[1.02] transition-all duration-300 flex items-center gap-1.5 cursor-pointer'
)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
