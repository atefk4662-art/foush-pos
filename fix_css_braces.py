with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the broken CSS segment
target_content = """.page-container {
            overflow-y: visible !important;
            height: auto !important;
            min-height: 100% !important;
            flex: none !important;
        }
        margin-bottom: 10px !important;
    }"""

replacement_content = """.page-container {
            overflow-y: visible !important;
            height: auto !important;
            min-height: 100% !important;
            flex: none !important;
            margin-bottom: 10px !important;
        }"""

if target_content in content:
    content = content.replace(target_content, replacement_content)
    print("Exact match replaced successfully!")
else:
    # Try with flexible spacing
    import re
    pattern = r'\.page-container\s*{[^}]*}\s*margin-bottom:[^;]*;\s*}'
    content, count = re.subn(pattern, replacement_content, content)
    print(f"Replaced {count} instances using regex!")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
