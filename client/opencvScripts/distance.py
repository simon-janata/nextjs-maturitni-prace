import os
import sys
import numpy as np
import cv2

# Load the image
image_path = r"C:\Users\janat\source\repos\nextjs-maturitni-prace-doc\images\USA_SMITH_WILL.jpg"
img = cv2.imread(image_path)

# # Read the image data from standard input
# image_bytes = sys.stdin.buffer.read()

# # Convert the image data to a NumPy array
# image_array = np.frombuffer(image_bytes, dtype=np.uint8)

# # Decode the image array
# img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

# Check if the image file was read successfully
if img is None:
  print("Failed to read image data")
  sys.exit(1)
else:
  print("Image data was read successfully")

  desired_height = img.shape[0] * (1 / 2)  # New height in pixels
  desired_width = img.shape[1] * (1 / 2)

  img = cv2.resize(img, None, fx=(1 / 2), fy=(1 / 2), interpolation=cv2.INTER_AREA)

  # Convert the image to grayscale for better processing
  gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

  path_to_current_folder = os.path.dirname(os.path.realpath(__file__))

  print(os.path.dirname(os.path.realpath(__file__)))
#   print(os.path.join(path_to_current_folder, 'haarcascade_mcs_nose.xml'))

  # Load the pre-trained Haar cascade classifier for face, eye and upper body detection
  face_cascade = cv2.CascadeClassifier(os.path.join(path_to_current_folder, 'haarcascade_frontalface_default.xml'))
  eye_cascade = cv2.CascadeClassifier(os.path.join(path_to_current_folder, 'haarcascade_eye.xml'))
#   nose_cascade = cv2.CascadeClassifier(os.path.join(path_to_current_folder, 'haarcascade_mcs_nose.xml'))
  # nose_cascade = cv2.CascadeClassifier(os.path.join(os.getcwd(), "../", 'haarcascade_mcs_nose.xml'))

  # Detect faces in the image
  faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(300, 300))

  # Initialize the list to store distances and eye centers
  distances_to_eyes_top = []
  eye_centers = []

  # Loop through each face and detect eyes
  for (x, y, w, h) in faces:
      cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
      roi_gray = gray[y:y + h, x:x + w]
      roi_color = img[y:y + h, x:x + w]
      face_center_x = x + w // 2
      eyes = eye_cascade.detectMultiScale(roi_gray, minNeighbors=5, minSize=(120, 120))
      for (ex, ey, ew, eh) in eyes:
          cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)
          # Calculate the distance from the top of the photo to the topmost point of the eyes
          distance_to_eyes_top = y + ey + (eh // 2)
          distances_to_eyes_top.append(distance_to_eyes_top)
          # Calculate the center of the eye and add it to the list
          eye_center = x + ex + ew // 2
          eye_centers.append(eye_center)
          print("Distance from the top of the photo to the detected eyes:", distance_to_eyes_top)

  # Detect noses
  # noses = nose_cascade.detectMultiScale(gray, 1.1, 4)

  # Draw rectangle around the noses
  # for (x, y, w, h) in noses:
  #     cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)

  # Calculate the average distance
  average_distance = sum(distances_to_eyes_top) / len(distances_to_eyes_top) if distances_to_eyes_top else 0
  print("Average distance from the top of the photo to the detected eyes:", average_distance)

  # Calculate the height and width for the cropped image
  crop_height = int(3 * average_distance)
  crop_width = int(crop_height * (3 / 4))

  # Calculate the average x-coordinate of the eyes
  average_eye_x = sum(eye_centers) // len(eye_centers) if eye_centers else 0
  print("Average x-coordinate of the eyes:", average_eye_x)
  start_x = int(average_eye_x - (crop_width / 2))
  print("Start x-coordinate for the crop:", start_x)

  # Draw a horizontal line at the average distance from the top
  cv2.line(img, (0, int(average_distance)), (img.shape[1], int(average_distance)), (0, 255, 0), 2)

  # Draw a vertical line at the average x-coordinate of the eyes
  # cv2.line(img, (average_eye_x, 0), (average_eye_x, img.shape[0]), (0, 255, 0), 2)
  cv2.line(img, (face_center_x, 0), (face_center_x, img.shape[0]), (0, 255, 0), 2)

  # Calculate the height and width for the cropped image
  crop_height = int(3 * average_distance)
  crop_width = int(crop_height * (3 / 4))

  # Calculate the starting x coordinate for the crop to center the image
  start_x = int((img.shape[1] - crop_width) / 2)

  # Crop the image based on the first detected face (if any)
  if len(faces) > 0:
      (x, y, w, h) = faces[0]  # Consider only the first detected face

      # cropped_image = img[y:y + h, x:x + w]
      # cropped_image = img[130:1130, 180:180 + 750]
  else:
      print("No faces detected")
      sys.exit(1)

  # # Encode the cropped image to bytes
  # retval, buffer = cv2.imencode(".JPG", cropped_image)
  # cropped_image_bytes = buffer.tobytes()

  # # Write the cropped image data to standard output
  # sys.stdout.buffer.write(cropped_image_bytes)

  print("Cropped image data sent successfully")

  # Display the labeled image
  cv2.imshow("Face Detection and Labeling", img)
  cv2.waitKey(0)
  cv2.destroyAllWindows()

  # # Detect upper bodies in the image
  # upper_bodies = upper_body_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

  # # Draw rectangles around the detected upper bodies (shoulders approximation)
  # for (x, y, w, h) in upper_bodies:
  #     cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)

  # # Display the image with detected upper bodies (shoulders)
  # cv2.imshow('Shoulder Detection', img)
  # cv2.waitKey(0)
  # cv2.destroyAllWindows()
