import shutil
import os
import subprocess
import time

# Step 1: Copy lib/webgl to docs/lib/webgl
src_dir = "lib/webgl"
dst_dir = "docs/lib/webgl"

print(f"📁 Copying '{src_dir}' to '{dst_dir}'...")
if os.path.exists(dst_dir):
    shutil.rmtree(dst_dir)
shutil.copytree(src_dir, dst_dir)
print("✅ Copy complete.")

# Step 2: Serve with MkDocs
print("🚀 Running 'mkdocs serve'...")
try:
    subprocess.run(["mkdocs", "serve"])
finally:
    # Step 3: Cleanup after mkdocs serve exits
    print(f"🧹 Deleting temporary folder '{dst_dir}'...")
    if os.path.exists(dst_dir):
        shutil.rmtree(dst_dir)
    print("✅ Cleanup done.")
