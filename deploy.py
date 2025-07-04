import shutil
import os
import subprocess

# Step 1: Copy lib/webgl to docs/lib/webgl
src_dir = "lib/webgl"
dst_dir = "docs/lib/webgl"

print(f"📁 Copying '{src_dir}' to '{dst_dir}'...")
if os.path.exists(dst_dir):
    shutil.rmtree(dst_dir)
shutil.copytree(src_dir, dst_dir)
print("✅ Copy complete.")

# Step 2: Run mkdocs gh-deploy
print("🚀 Deploying with 'mkdocs gh-deploy'...")
try:
    subprocess.run(["mkdocs", "gh-deploy", "--clean"], check=True)
    print("✅ Deployment successful.")
finally:
    # Step 3: Delete the copied folder
    print(f"🧹 Deleting temporary folder '{dst_dir}'...")
    if os.path.exists(dst_dir):
        shutil.rmtree(dst_dir)
    print("✅ Cleanup done.")
