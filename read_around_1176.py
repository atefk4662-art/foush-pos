with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()
for i in range(880, 926):
    print(f"{i+1}: {lines[i].encode('ascii', 'ignore').decode('ascii').strip()}")
