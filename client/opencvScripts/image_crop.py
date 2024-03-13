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

    # Get the path to the current folder
    path_to_current_folder = os.path.dirname(os.path.realpath(__file__))

    # Load the pre-trained Haar cascade classifier for face and eye detection
    face_cascade = cv2.CascadeClassifier(os.path.join(path_to_current_folder, 'haarcascade_frontalface_default.xml'))
    eye_cascade = cv2.CascadeClassifier(os.path.join(path_to_current_folder, 'haarcascade_eye.xml'))
    # nose_cascade = cv2.CascadeClassifier(os.path.join(path_to_current_folder, 'haarcascade_mcs_nose.xml'))

    # Detect faces in the image
    # faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=7, minSize=(400, 400))

    # Initialize the list to store distances and eye centers
    distances_to_eyes_top = []
    eye_centers = []

    # Loop through each face and detect eyes
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
        roi_gray = gray[y:y + h, x:x + w]
        roi_color = img[y:y + h, x:x + w]
        # Calculate the center of the face
        face_center_x = x + w // 2
        eyes = eye_cascade.detectMultiScale(roi_gray, minSize=(50, 50))
        for (ex, ey, ew, eh) in eyes:
            cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)
            distance_to_eyes_top = y + ey
            distances_to_eyes_top.append(distance_to_eyes_top)
            # Calculate the center of the eye and add it to the list
            eye_center = x + ex + ew // 2
            eye_centers.append(eye_center)
            print("Distance from the top of the photo to the detected eyes:", distance_to_eyes_top)

    # Calculate the average distance
    average_distance = sum(distances_to_eyes_top) / len(distances_to_eyes_top) if distances_to_eyes_top else 0
    print("Average distance from the top of the photo to the detected eyes:", average_distance)

    # Draw a horizontal line at the average distance from the top
    cv2.line(img, (0, int(average_distance)), (img.shape[1], int(average_distance)), (0, 255, 0), 2)

    # Calculate the average x-coordinate of the eyes
    average_eye_x = sum(eye_centers) // len(eye_centers) if eye_centers else 0

    # Draw a vertical line at the average x-coordinate of the eyes
    cv2.line(img, (face_center_x, 0), (face_center_x, img.shape[0]), (0, 255, 0), 2)

    # Calculate the height and width for the cropped image
    crop_height = int(3 * average_distance)
    crop_width = int(crop_height * (3 / 4))

    # Calculate the starting x coordinate for the crop to center the image
    # # start_x = int((img.shape[1] - crop_width) / 2)
    # start_x = int(average_eye_x - (crop_width / 2))
    # Calculate the starting x coordinate for the crop to center the image
    start_x = int(face_center_x - (crop_width / 2))

    if start_x < 0:
        start_x = 0

    # start_y = mid_eye_point - crop_height // 2

    # Crop the image based on the first detected face (if any)
    if len(faces) > 0:
        (x, y, w, h) = faces[0] # Consider only the first detected face

        # Calculate new width and height for 4:3 aspect ratio with 1400x1050 dimensions
        # new_height = 1400
        # new_width = int(new_height * 3 / 4)

        # Ensure the cropping area fits within the detected face region
        # start_x = max(0, x + (w - new_width) // 2)
        # start_y = max(0, y + (h - new_height) // 2)

        # cropped_image = img[y:y + h, x:x + w]
        cropped_image = img[70:crop_height + 70, start_x:start_x + crop_width]
        # cropped_image = img[start_y:start_y + new_height, start_x:start_x + new_width]
    else:
        print("No faces detected")
        sys.exit(1)

    # Cropping an image
    # cropped_image = img[100:280, 150:330]
        
    # desired_height = 1400  # New height in pixels
    # desired_width = 1050   # New width in pixels

    # # Calculate the scaling factors for resizing
    # scaling_factor_height = desired_height / cropped_image.shape[0]
    # scaling_factor_width = desired_width / cropped_image.shape[1]

    # # Choose the smallest scaling factor to maintain aspect ratio
    # scaling_factor = min(scaling_factor_height, scaling_factor_width)

    resized_image = cv2.resize(cropped_image, (1050, 1400))

    # Encode the cropped image to bytes
    retval, buffer = cv2.imencode(".JPG", resized_image)
    cropped_image_bytes = buffer.tobytes()

    # Write the cropped image data to standard output
    sys.stdout.buffer.write(cropped_image_bytes)

    # # Display the labeled image
    # cv2.imshow("Face Detection and Labeling", resized_image)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    print("Cropped image data sent successfully")
    