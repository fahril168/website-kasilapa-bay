import os
from PIL import Image

def optimize_image(filepath, max_width=1600, quality=80):
    if not os.path.exists(filepath):
        return
    
    filename, ext = os.path.splitext(filepath)
    ext_lower = ext.lower()
    if ext_lower not in ['.png', '.jpg', '.jpeg', '.webp']:
        return

    orig_size = os.path.getsize(filepath)
    
    with Image.open(filepath) as img:
        # Convert RGBA/P mode if needed for WebP/JPEG
        if img.mode in ('RGBA', 'LA') and ext_lower in ['.jpg', '.jpeg']:
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1])
            img = background
        elif img.mode not in ('RGB', 'RGBA'):
            img = img.convert('RGB')
            
        # Resize if larger than max_width
        w, h = img.size
        if w > max_width:
            new_w = max_width
            new_h = int(h * (max_width / w))
            img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
        # Save as WebP
        webp_path = filename + '.webp'
        img.save(webp_path, 'WEBP', quality=quality, optimize=True)
        new_size = os.path.getsize(webp_path)
        print(f"Optimized {os.path.basename(filepath)} -> {os.path.basename(webp_path)}: {orig_size//1024} KB -> {new_size//1024} KB")

def main():
    base_dir = r"d:\Project\kasilapa\public\img"
    for root, dirs, files in os.walk(base_dir):
        for f in files:
            full_path = os.path.join(root, f)
            if f.endswith('.png') or f.endswith('.jpg') or f.endswith('.jpeg'):
                max_w = 1920 if 'hero' in f else 1200
                optimize_image(full_path, max_width=max_w, quality=82)

if __name__ == '__main__':
    main()
