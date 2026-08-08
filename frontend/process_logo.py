from PIL import Image

def process_logo(input_path, output_path):
    # Open the image
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    # Get image data
    datas = img.getdata()
    new_data = []
    
    # Tolerance for what is considered "white"
    threshold = 240
    
    for item in datas:
        # Check if pixel is white or near-white
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            # Replace with transparent pixel
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    # Update image data
    img.putdata(new_data)
    
    # Crop to the bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        # Add a tiny bit of padding (e.g., 5 pixels)
        padding = 5
        padded_bbox = (
            max(0, bbox[0] - padding),
            max(0, bbox[1] - padding),
            min(img.width, bbox[2] + padding),
            min(img.height, bbox[3] + padding)
        )
        img = img.crop(padded_bbox)
        
    # Save the result
    img.save(output_path, "PNG")
    print(f"Successfully processed logo and saved to {output_path}")

if __name__ == "__main__":
    input_file = r"C:\Users\saksh\.gemini\antigravity-ide\brain\ac5c21e8-cda1-4040-8158-d1237247c217\codeforge_logo_minimal_1786174824522.png"
    output_file = r"public\logo.png"
    process_logo(input_file, output_file)
