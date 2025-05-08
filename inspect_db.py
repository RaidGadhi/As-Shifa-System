import json
from pathlib import Path

# Load and parse local_storage_dump.json
db_path = Path("local_storage_dump.json")

if not db_path.exists():
    print("❌ No local_storage_dump.json found. Please export from browser first.")
    exit()

with open(db_path, "r", encoding="utf-8") as f:
    data = json.load(f)

print("\n📦 LocalStorage Structure:\n")

for key, value in data.items():
    print(f"🗂️  {key}")
    print("-" * (len(key) + 5))
    if isinstance(value, list):
        print(f"Count: {len(value)} items")
        for i, entry in enumerate(value[:3]):  # Preview first 3
            print(f"  {i+1}. {json.dumps(entry, indent=2)}")
        if len(value) > 3:
            print("  ...")
    elif isinstance(value, dict):
        print(json.dumps(value, indent=2))
    else:
        print(value)
    print("\n")
