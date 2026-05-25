with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Let's parse all braces in the file from the start of <style> to line 1400
# and record the brace level at the start of each line
lines = content.split('\n')
style_start = 0
for idx, line in enumerate(lines):
    if '<style>' in line:
        style_start = idx
        break

brace_level = 0
for idx in range(style_start, min(1400, len(lines))):
    line = lines[idx]
    # Check for media query on this line
    is_media = '@media' in line
    old_level = brace_level
    for char in line:
        if char == '{':
            brace_level += 1
        elif char == '}':
            brace_level -= 1
    if is_media or 'kitchen-layout-grid' in line:
        print(f"Line {idx+1} (level {old_level} -> {brace_level}): {line.strip()[:80]}")
