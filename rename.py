import os
import re

replacements = {
    "TravixIQ": "TravixIQ",
    "TravixIQ": "TravixIQ",
    "TravixIQ": "TravixIQ",
    "TravixIQ": "TravixIQ",
    "TravixIQ": "TravixIQ",
    "TravixIQ": "TravixIQ",
    "TravixIQ": "TravixIQ",
    "TravixIQ": "TravixIQ",
    "Plan Smarter.<br />\n          <span className=\"bg-gradient-to-r from-cyan-600 to-teal-500 dark:from-cyan-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent\">\n            Travel Safer. Explore Better.\n          </span>": "Travel Smarter.<br />\n          <span className=\"bg-gradient-to-r from-cyan-600 to-teal-500 dark:from-cyan-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent\">\n            Explore Better.\n          </span>",
    "TravixIQ is an AI-powered travel intelligence platform that helps users plan smarter trips, optimise travel budgets, discover personalised itineraries, detect travel scams, analyse destinations, and access intelligent travel assistance through one unified platform.": "TravixIQ is an AI-powered travel intelligence platform that helps users plan smarter trips, optimise travel budgets, discover personalised itineraries, detect travel scams, analyse destinations, and access intelligent travel assistance through one unified platform."
}

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        return False

    original_content = content
    for old, new in replacements.items():
        # case insensitive for the simple string ones, except the exact taglines
        if 'Plan Smarter' not in old and 'The next-generation' not in old:
            pattern = re.compile(re.escape(old), re.IGNORECASE)
            content = pattern.sub(new, content)
        else:
            content = content.replace(old, new)
            
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

modified_files = []
for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or 'dist' in root or '.git' in root:
        continue
    for file in files:
        filepath = os.path.join(root, file)
        if process_file(filepath):
            modified_files.append(filepath)

print("Modified files:")
for f in modified_files:
    print(f)

