import re
import glob

for file in glob.glob("src/components/*.tsx"):
    with open(file, 'r') as f:
        content = f.read()

    # If it sees {isLight,  isLight, or {isLight, \n isLight, it replaces with {isLight, 
    content = re.sub(r'isLight,\s*isLight,', 'isLight,', content)
    
    with open(file, 'w') as f:
        f.write(content)

