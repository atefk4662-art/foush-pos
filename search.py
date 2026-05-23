import sys
with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    for i, line in enumerate(f):
        if 'renderKitchen' in line or 'renderManagerHome' in line or 'renderExpenses' in line or 'renderDashboard' in line or 'renderShiftOps' in line or 'renderWaiter' in line:
            print(f"Line {i+1}: {line.encode('ascii', 'ignore').decode('ascii').strip()[:60]}")
