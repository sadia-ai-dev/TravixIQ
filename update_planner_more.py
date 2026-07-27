import re

with open('src/components/TravelPlanner.tsx', 'r') as f:
    content = f.read()

# Replace any remaining bg-white dark:bg-zinc-900/60
content = content.replace('bg-white dark:bg-zinc-900/60', 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md')
content = content.replace('bg-white dark:bg-zinc-900', 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md')

with open('src/components/TravelPlanner.tsx', 'w') as f:
    f.write(content)
