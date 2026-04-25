import re

with open('/Users/bishalbaroi/Desktop/fin/frontend/src/app/page.tsx', 'r') as f:
    content = f.read()

# 1. Notebook guide header image gradient (must blend with card bg)
content = content.replace(
    'from-[#2a2b2f] via-black/40',
    'from-white dark:from-[#2a2b2f] via-black/40'
)

# 2. Notebook guide header image text (must be white on black overlay)
content = content.replace(
    'text-[#1f1f1f] dark:text-white">\n                            <Sparkles',
    'text-white">\n                            <Sparkles'
)
content = content.replace(
    '<h1 className="text-4xl font-normal text-[#1f1f1f] dark:text-white',
    '<h1 className="text-4xl font-normal text-white'
)

# 3. Notebook guide description text (d1d1d1 is invisible on white bg)
content = content.replace(
    'text-[#d1d1d1] text-[15px]',
    'text-[#444746] dark:text-[#d1d1d1] text-[15px]'
)

# 4. Action buttons hover state (bg-white/10 is invisible on light bg)
content = content.replace(
    'hover:bg-white/10 border',
    'hover:bg-black/5 dark:hover:bg-white/10 border'
)
content = content.replace(
    'hover:bg-white/10 text-',
    'hover:bg-black/5 dark:hover:bg-white/10 text-'
)
content = content.replace(
    'hover:bg-white/10 transition-colors',
    'hover:bg-black/5 dark:hover:bg-white/10 transition-colors'
)

# 5. Fix "Create notebook" button in top right
content = content.replace(
    'className="rounded-full bg-white text-black hover:bg-gray-100 h-9 px-4 text-sm font-medium border-none"',
    'className="rounded-full bg-[#1a73e8] text-white hover:bg-[#1557b0] dark:bg-white dark:text-black dark:hover:bg-gray-100 h-9 px-4 text-sm font-medium border-none"'
)

# 6. Fix user message bg color. bg-white dark:bg-[#2a2b2f] is okay, but NotebookLM uses a slightly blueish bg or just off-white. We'll leave it but ensure text is good.

with open('/Users/bishalbaroi/Desktop/fin/frontend/src/app/page.tsx', 'w') as f:
    f.write(content)

print("Done")
