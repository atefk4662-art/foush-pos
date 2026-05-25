with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

brace_count = 0
for i in range(664, 1000):
    line = lines[i]
    old_count = brace_count
    for char in line:
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
    if brace_count <= 0 and old_count > 0:
        print(f"Line {i+1} drops brace count to {brace_count}: {line.strip()}")
