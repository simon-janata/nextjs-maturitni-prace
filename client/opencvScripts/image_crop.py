# Import packages
import os

import cv2
import numpy as np

# Read the image file
cwd = os.getcwd()
img = cv2.imread(f"{cwd}\\opencvScripts\\te.jpg")

# Check if the image file was read successfully
if img is None:
  print("Failed to read image file")
  print(f"{cwd}\\opencvScripts\\test2.jpg")
else:
  print("Image file was read successfully")
  print(img.shape) # Print image shape

  # Cropping an image
  cropped_image = img[100:280, 150:330]

  # Save the cropped image
  cv2.imwrite(f"{cwd}\\opencvScripts\\Cropped_Image.jpg", cropped_image)
