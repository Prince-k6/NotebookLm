import re

with open('/Users/bishalbaroi/Desktop/fin/frontend/src/app/page.tsx', 'r') as f:
    content = f.read()

# Fix unmapped bg-[#1e1f20] which ruins settings modal contrast
content = content.replace('bg-[#1e1f20]', 'bg-[#f8f9fa] dark:bg-[#1e1f20]')

# Fix syntax error double dark borders
content = content.replace('dark:border-[#e3e3e3] dark:border-[#333]', 'dark:border-[#333]')
content = content.replace('dark:border-[#c4c7c5] dark:border-[#444]', 'dark:border-[#444]')

with open('/Users/bishalbaroi/Desktop/fin/frontend/src/app/page.tsx', 'w') as f:
    f.write(content)

print("Done")
