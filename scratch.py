import re

with open('/Users/bishalbaroi/Desktop/fin/frontend/src/app/page.tsx', 'r') as f:
    content = f.read()

# Palette mappings (Dark -> Light)
replacements = [
    (r'bg-\[\#1b1b1d\]', r'bg-[#f8f9fa] dark:bg-[#1b1b1d]'),
    (r'bg-\[\#222327\]', r'bg-[#f0f4f9] dark:bg-[#222327]'),
    (r'bg-\[\#2a2b2f\]', r'bg-white dark:bg-[#2a2b2f]'),
    (r'bg-\[\#38393d\]', r'bg-[#e1e5ea] dark:bg-[#38393d]'),
    (r'bg-\[\#131314\]', r'bg-white dark:bg-[#131314]'),
    (r'border-\[\#333\]', r'border-[#e3e3e3] dark:border-[#333]'),
    (r'border-\[\#444\]', r'border-[#c4c7c5] dark:border-[#444]'),
    (r'text-\[\#e3e3e3\]', r'text-[#1f1f1f] dark:text-[#e3e3e3]'),
    (r'text-\[\#a0a0a0\]', r'text-[#444746] dark:text-[#a0a0a0]'),
    (r'text-\[\#888\]', r'text-[#747775] dark:text-[#888]'),
    (r'text-\[\#666\]', r'text-[#8e918f] dark:text-[#666]'),
    # Only replace specific standalone text-white to avoid buttons
    (r'(?<!text-\[)text-white(?!\/)(?!\s*(?:shadow|border))', r'text-[#1f1f1f] dark:text-white'),
]

for pattern, replacement in replacements:
    content = re.sub(pattern, replacement, content)

# Write back
with open('/Users/bishalbaroi/Desktop/fin/frontend/src/app/page.tsx', 'w') as f:
    f.write(content)

print("Done")
