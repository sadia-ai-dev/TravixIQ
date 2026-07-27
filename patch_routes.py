import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add isLight={isLight} to all components
components = ['Dashboard', 'TravelPlanner', 'TravelPulse', 'BudgetOptimizer', 'ScamShield', 'MuslimAssistant', 'Profile', 'SettingsComponent']

for comp in components:
    # Replace `<Component ` with `<Component isLight={isLight} `
    content = re.sub(rf'<{comp} \n', f'<{comp} \n                  isLight={{isLight}}\n', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

