import os
from PIL import Image

def optimize_image(filepath, max_width=1000, quality=72):
    if not os.path.exists(filepath):
        return
    
    filename, ext = os.path.splitext(filepath)
    ext_lower = ext.lower()
    if ext_lower not in ['.png', '.jpg', '.jpeg', '.webp']:
        return

    orig_size = os.path.getsize(filepath)
    
    with Image.open(filepath) as img:
        if img.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1])
            img = background
        elif img.mode not in ('RGB', 'RGBA'):
            img = img.convert('RGB')
            
        w, h = img.size
        if w > max_width:
            new_w = max_width
            new_h = int(h * (max_width / w))
            img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
        webp_path = filename + '.webp'
        img.save(webp_path, 'WEBP', quality=quality, optimize=True)
        new_size = os.path.getsize(webp_path)
        print(f"Optimized {os.path.basename(filepath)} -> {os.path.basename(webp_path)}: {orig_size//1024} KB -> {new_size//1024} KB")

def main():
    base_dir = r"d:\Project\kasilapa\public\img"
    for root, dirs, files in os.walk(base_dir):
        for f in files:
            full_path = os.path.join(root, f)
            if f.endswith('.webp'):
                max_w = 1200 if 'hero' in f else 750
                optimize_image(full_path, max_width=max_w, quality=72)

if __name__ == '__main__':
    main()
