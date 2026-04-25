import re

with open('/Users/bishalbaroi/Desktop/fin/frontend/src/app/page.tsx', 'r') as f:
    content = f.read()

# Fix Featured Notebooks Title
content = content.replace(
    'text-[#1f1f1f] dark:text-white mb-2 leading-tight">How To Build A Life, from The Atlantic</h3>',
    'text-white mb-2 leading-tight">How To Build A Life, from The Atlantic</h3>'
)
content = content.replace(
    'text-[#1f1f1f] dark:text-white mb-2 leading-tight">Secrets of the Super Agers</h3>',
    'text-white mb-2 leading-tight">Secrets of the Super Agers</h3>'
)
content = content.replace(
    'text-[#1f1f1f] dark:text-white mb-2 leading-tight">Intro to the Universe</h3>',
    'text-white mb-2 leading-tight">Intro to the Universe</h3>'
)

# Fix Notebook Guide Header Gradient and Text
content = content.replace(
    'from-white dark:from-[#2a2b2f] via-black/40',
    'from-[#2a2b2f] via-black/40' # wait, in light mode the card bg is white, so from-white is correct for blending. But the text is on top of it.
)

with open('/Users/bishalbaroi/Desktop/fin/frontend/src/app/page.tsx', 'w') as f:
    f.write(content)

print("Done")
