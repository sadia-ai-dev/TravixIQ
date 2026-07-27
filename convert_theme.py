import os
import re

def convert_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Add isLight to interface
    content = re.sub(r'(interface \w+Props \{)', r'\1\n  isLight: boolean;', content)
    
    # 2. Add isLight to component args
    # find export default function Name({ ...
    content = re.sub(r'(export default function \w+\(\{ )', r'\1isLight, ', content)
    # also handle export default function Name({
    # without space
    content = re.sub(r'(export default function \w+\(\{)', r'\1isLight, ', content)

    # We need to convert className="something bg-zinc-900 text-white" 
    # to className={`something ${isLight ? 'bg-white' : 'bg-zinc-900'} ${isLight ? 'text-zinc-900' : 'text-white'}`}
    
    # It's easier to just do a smart regex on className="..."
    def replacer(match):
        inner = match.group(1)
        # If it's already a template literal, we just replace inside it
        return f"className={{`{inner}`}}"

    # Convert all string classNames to template literals first
    content = re.sub(r'className="([^"]+)"', replacer, content)

    # Now we have className={`...`} everywhere. 
    # We can just replace the specific words inside the file, 
    # but ONLY if they are inside className. 
    # Actually, replacing them globally in the file (except imports) is mostly safe for Tailwind classes.
    
    replacements = {
        r'\bbg-zinc-900\b': r'${isLight ? "bg-white" : "bg-zinc-900"}',
        r'\bbg-zinc-950\b': r'${isLight ? "bg-zinc-50/50" : "bg-zinc-950"}',
        r'\bbg-\[\#0a0a0a\]\b': r'${isLight ? "bg-zinc-50" : "bg-[#0a0a0a]"}',
        r'\btext-white\b': r'${isLight ? "text-zinc-900" : "text-white"}',
        r'\btext-zinc-400\b': r'${isLight ? "text-zinc-500" : "text-zinc-400"}',
        r'\btext-zinc-300\b': r'${isLight ? "text-zinc-600" : "text-zinc-300"}',
        r'\btext-zinc-200\b': r'${isLight ? "text-zinc-700" : "text-zinc-200"}',
        r'\bborder-zinc-800\b': r'${isLight ? "border-zinc-200" : "border-zinc-800"}',
        r'\bborder-zinc-800/50\b': r'${isLight ? "border-zinc-200" : "border-zinc-800/50"}',
        r'\bborder-zinc-800/80\b': r'${isLight ? "border-zinc-200" : "border-zinc-800/80"}',
        r'\bborder-zinc-800/65\b': r'${isLight ? "border-zinc-200" : "border-zinc-800/65"}',
        r'\bbg-zinc-800\b': r'${isLight ? "bg-zinc-100" : "bg-zinc-800"}',
        r'\bbg-zinc-800/50\b': r'${isLight ? "bg-zinc-100/50" : "bg-zinc-800/50"}',
        r'\bbg-zinc-800/80\b': r'${isLight ? "bg-zinc-100/80" : "bg-zinc-800/80"}',
        r'\bbg-zinc-850\b': r'${isLight ? "bg-zinc-200" : "bg-zinc-850"}',
        r'\bborder-zinc-850\b': r'${isLight ? "border-zinc-200" : "border-zinc-850"}',
    }

    for old, new in replacements.items():
        content = re.sub(old, new, content)

    with open(filepath, 'w') as f:
        f.write(content)

components = ['src/components/Dashboard.tsx', 'src/components/TravelPlanner.tsx', 'src/components/TravelPulse.tsx', 'src/components/BudgetOptimizer.tsx', 'src/components/ScamShield.tsx', 'src/components/MuslimAssistant.tsx', 'src/components/Profile.tsx', 'src/components/Settings.tsx']

for c in components:
    convert_file(c)

