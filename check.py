import re

with open('c:/Users/dell/Desktop/foush/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract script
match = re.search(r'<script>(.*?)</script>', text, re.DOTALL)
if not match:
    print('No script found')
    exit()

script = match.group(1)

def check_balance(text, open_char, close_char):
    count = 0
    for char in text:
        if char == open_char: count += 1
        elif char == close_char: count -= 1
        if count < 0: return False
    return count == 0

print('Braces {}: ', check_balance(script, '{', '}'))
print('Parens (): ', check_balance(script, '(', ')'))
print('Brackets []: ', check_balance(script, '[', ']'))
