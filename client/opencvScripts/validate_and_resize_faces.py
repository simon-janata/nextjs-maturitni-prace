# import cv2

# # Load the pre-trained face detection model
# face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# # Load the image
# image_path = r"C:\Users\janat\source\repos\nextjs-maturitni-prace\client\opencvScripts\8people.jpg"
# image = cv2.imread(image_path)

# # Convert the image to grayscale
# gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# # Detect faces in the image
# # faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=6, minSize=(70, 70))
# faces = face_cascade.detectMultiScale(gray_image, 1.1, 4, minSize=(400, 400))

# # Draw rectangles around the faces and count them
# face_count = 0
# for (x, y, w, h) in faces:
#     cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)
#     faces = image[y:y + h, x:x + w] 
#     cv2.imshow("face",faces) 
#     # cv2.imwrite('face.jpg', faces) 
#     # face_count += 1

# # Display the number of faces
# print("Number of faces detected:", face_count)

# # Display the image with rectangles drawn around faces
# cv2.imshow('Face Counter', image)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

import cv2
import sys
import numpy as np
import json
import base64

# Read the image data from standard input
image_bytes = sys.stdin.buffer.read()

# Convert the image data to a NumPy array
image_array = np.frombuffer(image_bytes, dtype=np.uint8)

# Load the pre-trained face detection model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Load the image
# original_image_path = r"C:\Users\janat\source\repos\nextjs-maturitni-prace\client\opencvScripts\test13.jpg"
# original_image = cv2.imread(original_image_path)
original_image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

# Check if the image file was read successfully
if original_image is None:
    print("Failed to read image data")
    sys.exit(1)
else:
    # print("Image data was read successfully")
    # Specify the desired dimensions
    # desired_height = 1000  # New height in pixels
    # desired_width = 750   # New width in pixels
    # desired_height = 3080  # New height in pixels
    # desired_width = 2320   # New width in pixels
    desired_height = 1540  # New height in pixels
    desired_width = 1160   # New width in pixels

    # Calculate the scaling factors for resizing
    scaling_factor_height = desired_height / original_image.shape[0]
    scaling_factor_width = desired_width / original_image.shape[1]

    # Choose the smallest scaling factor to maintain aspect ratio
    scaling_factor = min(scaling_factor_height, scaling_factor_width)

    # Resize the image using the chosen scaling factor
    resized_image = cv2.resize(original_image, None, fx=scaling_factor, fy=scaling_factor, interpolation=cv2.INTER_AREA)



    # # Calculate the scaling factors for resizing to halfway size
    # scaling_factor_height = (desired_height / 2) / original_image.shape[0]
    # scaling_factor_width = (desired_width / 2) / original_image.shape[1]

    # # Choose the smallest scaling factor to maintain aspect ratio
    # scaling_factor = min(scaling_factor_height, scaling_factor_width)

    # # Resize the image to halfway size
    # halfway_resized_image = cv2.resize(original_image, None, fx=scaling_factor, fy=scaling_factor, interpolation=cv2.INTER_LINEAR)

    # # Calculate the scaling factors for resizing to desired size
    # scaling_factor_height = desired_height / halfway_resized_image.shape[0]
    # scaling_factor_width = desired_width / halfway_resized_image.shape[1]

    # # Choose the smallest scaling factor to maintain aspect ratio
    # scaling_factor = min(scaling_factor_height, scaling_factor_width)

    # # Resize the image to the desired size
    # resized_image = cv2.resize(halfway_resized_image, None, fx=scaling_factor, fy=scaling_factor, interpolation=cv2.INTER_LINEAR)




    # resized_image = cv2.resize(original_image, (desired_width, desired_height))

    # Save the resized image
    # cv2.imwrite(r"C:\Users\janat\source\repos\nextjs-maturitni-prace\client\opencvScripts\resized_image.jpg", resized_image)

    # Convert the image to grayscale
    gray_image = cv2.cvtColor(resized_image, cv2.COLOR_BGR2GRAY)

    # cv2.imshow("Face Detection and Labeling", gray_image)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=7, minSize=(400, 400))

    # Check if exactly one face was detected
    is_single_face = len(faces) == 1

    # Print the number of detected faces and whether exactly one face was detected
    print("Number of faces detected:", len(faces))
    print("Is single face:", is_single_face)

    # Process each detected face
    for (x, y, w, h) in faces:
        # Extract the region of interest (ROI) from the top of the hair to the shoulders
        # top_hair_y = max(0, y - int(0.35 * h))
        # shoulders_y = y + h
        # roi = resized_image[top_hair_y:shoulders_y, x:x+w]
        top_hair_y = y
        shoulders_y = y + h
        roi = resized_image[top_hair_y:shoulders_y, x:x+w]

        # Draw a rectangle around the detected face
        # cv2.rectangle(resized_image, (x, top_hair_y), (x+w, shoulders_y), (255, 0, 0), 2)
        cv2.rectangle(resized_image, (x, y), (x+w, y+h), (255, 0, 0), 2)

        # Add a label indicating the face
        cv2.putText(resized_image, "Face", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)

    # Encode the cropped image to bytes
    retval, buffer = cv2.imencode(".JPG", resized_image)
    resized_image_bytes = buffer.tobytes()

    # Convert the image to base64
    resized_image_base64 = base64.b64encode(resized_image_bytes).decode()

    # # Write the cropped image data and the boolean value to standard output
    # sys.stdout.buffer.write(resized_image_bytes)
    # sys.stdout.buffer.write(str(is_single_face).encode())

    # Create a JSON object containing the image and the boolean value
    output = json.dumps({
        "image": resized_image_base64,
        "is_single_face": is_single_face
    })

    sys.stdout.buffer.write(output.encode("utf-8"))
    # sys.stdout.buffer.write(json.dumps(output).encode())

    # print(output)

    # # Display the labeled image
    # cv2.imshow("Face Detection and Labeling", resized_image)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
