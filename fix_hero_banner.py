import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Replace the static dark gradient with light default + dark: prefix
old_hero_class = r'bg-gradient-to-r from-zinc-900 to-cyan-950/40'
new_hero_class = r'bg-gradient-to-r from-cyan-50 to-cyan-100/50 dark:from-zinc-900 dark:to-cyan-950/40'

content = content.replace(old_hero_class, new_hero_class)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
