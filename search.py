with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    for i, line in enumerate(f):
        if 'show-summary' in line or 'show-preparing' in line or 'show-' in line:
            if '.show-' in line or 'show-' in line:
                print(f"Line {i+1}: {line.encode('ascii', 'ignore').decode('ascii').strip()[:100]}")
