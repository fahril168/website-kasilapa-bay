import os
import zipfile

def create_linux_compatible_zip():
    out_dir = os.path.abspath("out")
    zip_path = os.path.abspath("kasilapa_deploy.zip")

    if os.path.exists(zip_path):
        os.remove(zip_path)

    count = 0
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(out_dir):
            for file in files:
                full_path = os.path.join(root, file)
                # Compute relative path and normalize to POSIX forward slashes
                rel_path = os.path.relpath(full_path, out_dir).replace("\\", "/")
                zipf.write(full_path, rel_path)
                count += 1

    print(f"Successfully created {zip_path} with {count} files using POSIX forward slashes!")

if __name__ == "__main__":
    create_linux_compatible_zip()
