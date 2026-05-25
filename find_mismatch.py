with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

brace_count = 0
for i in range(664, 1400):
    line = lines[i]
    for char in line:
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0:
                print(f"Line {i+1} closed the media query: {line.strip()}")
                break
