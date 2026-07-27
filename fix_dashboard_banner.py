import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Fix banner
old_banner = r'className=\{`flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-cyan-50 to-cyan-100/50 dark:from-zinc-900 dark:to-cyan-950/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shadow-lg relative overflow-hidden`\}'
new_banner = r'className={`flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 text-slate-900 dark:bg-slate-800 dark:text-white p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md relative overflow-hidden`}'
content = re.sub(old_banner, new_banner, content)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
