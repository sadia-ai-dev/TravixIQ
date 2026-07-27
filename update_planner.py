import re

with open('src/components/TravelPlanner.tsx', 'r') as f:
    content = f.read()

# Make cards glassmorphism
planner_card_class = r'bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-3'
planner_card_new = r'bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-3 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300'
content = content.replace(planner_card_class, planner_card_new)

# Config panel
config_panel = r'bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-end shadow-sm'
config_panel_new = r'bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-end shadow-md transition-all duration-300 hover:shadow-lg'
content = content.replace(config_panel, config_panel_new)

# Generate button
btn_class = r'w-full md:w-auto px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-zinc-900 dark:text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-600/10 transition-all flex justify-center items-center gap-2 cursor-pointer'
btn_new = r'w-full md:w-auto px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-zinc-900 dark:text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-600/20 hover:shadow-cyan-600/30 transition-all duration-300 hover:scale-[1.02] flex justify-center items-center gap-2 cursor-pointer'
content = content.replace(btn_class, btn_new)

with open('src/components/TravelPlanner.tsx', 'w') as f:
    f.write(content)
