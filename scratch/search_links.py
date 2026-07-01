import os
import re

ROOT = r"d:\GROWPHIL PROJECT\MEDINGEN WRAP\next-ssr"

relative_patterns = [
    re.compile(r'href=["\'](?!https?:|mailto:|tel:|/|#)([^"\']+)["\']'),
    re.compile(r'to=["\'](?!https?:|mailto:|tel:|/|#)([^"\']+)["\']'),
    re.compile(r'src=["\'](?!https?:|mailto:|tel:|/|#)([^"\']+)["\']'),
]

for root, dirs, files in os.walk(ROOT):
    if "node_modules" in dirs:
        dirs.remove("node_modules")
    if ".next" in dirs:
        dirs.remove(".next")
        
    for file in files:
        if file.endswith((".js", ".jsx", ".ts", ".tsx")):
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                for line_no, line in enumerate(content.splitlines(), 1):
                    for pattern in relative_patterns:
                        for match in pattern.finditer(line):
                            print(f"{path}:{line_no} -> Found: {match.group(0)}")
            except Exception as e:
                pass
