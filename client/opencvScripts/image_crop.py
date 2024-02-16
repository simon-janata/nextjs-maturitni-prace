# Import packages
import os
import sys
import numpy as np
import cv2

# Read the image data from standard input
image_bytes = sys.stdin.buffer.read()

# Convert the image data to a NumPy array
image_array = np.frombuffer(image_bytes, dtype=np.uint8)

# Decode the image array
img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

# Check if the image file was read successfully
if img is None:
    print("Failed to read image data")
    sys.exit(1)
else:
    print("Image data was read successfully")
    # print(img.shape) # Print image shape

    # Convert the image to grayscale for better processing
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Load the pre-trained Haar cascade classifier for face and eye detection
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_eye.xml")

    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    # Loop through each face and detect eyes
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
        roi_gray = gray[y:y + h, x:x + w]
        roi_color = img[y:y + h, x:x + w]
        eyes = eye_cascade.detectMultiScale(roi_gray)
        for (ex, ey, ew, eh) in eyes:
            cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)

    # Crop the image based on the first detected face (if any)
    if len(faces) > 0:
        (x, y, w, h) = faces[0]  # Consider only the first detected face

        # Calculate new width and height for 4:3 aspect ratio with 1400x1050 dimensions
        # new_height = 1400
        # new_width = int(new_height * 3 / 4)

        # Ensure the cropping area fits within the detected face region
        # start_x = max(0, x + (w - new_width) // 2)
        # start_y = max(0, y + (h - new_height) // 2)

        cropped_image = img[y:y + h, x:x + w]
        # cropped_image = img[start_y:start_y + new_height, start_x:start_x + new_width]
    else:
        print("No faces detected")
        sys.exit(1)

    # Cropping an image
    # cropped_image = img[100:280, 150:330]

    # Encode the cropped image to bytes
    retval, buffer = cv2.imencode(".JPG", cropped_image)
    cropped_image_bytes = buffer.tobytes()

    # Write the cropped image data to standard output
    sys.stdout.buffer.write(cropped_image_bytes)

    print("Cropped image data sent successfully")
    