# Import packages
import os
import sys
import numpy as np
import cv2

image_bytes = sys.stdin.buffer.read()

image_array = np.frombuffer(image_bytes, dtype=np.uint8)

img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

if img is None:
    print("Failed to read image data")
    sys.exit(1)
else:
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    path_to_current_folder = os.path.dirname(os.path.realpath(__file__))

    face_cascade = cv2.CascadeClassifier(os.path.join(path_to_current_folder, "haarcascade_frontalface_default.xml"))
    eye_cascade = cv2.CascadeClassifier(os.path.join(path_to_current_folder, "haarcascade_eye.xml"))

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=7, minSize=(400, 400))

    distances_to_eyes_top = []

    for (x, y, w, h) in faces:
        distance_to_face_bottom = y + h
        roi_gray = gray[y:y + h, x:x + w]
        roi_color = img[y:y + h, x:x + w]
        face_center_x = x + w // 2
        eyes = eye_cascade.detectMultiScale(roi_gray, minNeighbors=7, minSize=(55, 55))
        for (ex, ey, ew, eh) in eyes:
            distance_to_eyes_top = y + ey + (eh // 2)
            distances_to_eyes_top.append(distance_to_eyes_top)
        break

    average_distance = sum(distances_to_eyes_top) / len(distances_to_eyes_top) if distances_to_eyes_top else 0

    difference = distance_to_face_bottom - average_distance

    top_y = int((distance_to_face_bottom - 2.25 * difference) / 2)
    top_y = max(0, min(img.shape[0], top_y))

    crop_height = int(3 * (average_distance - top_y))
    crop_width = int(crop_height * (3 / 4))

    start_x = int(face_center_x - (crop_width / 2))

    if start_x < 0:
        start_x = 0

    if len(faces) > 0:
        (x, y, w, h) = faces[0]
        cropped_image = img[top_y:top_y + crop_height, start_x:start_x + crop_width]
    else:
        print("No faces detected")
        sys.exit(1)

    resized_image = cv2.resize(cropped_image, (1050, 1400))

    retval, buffer = cv2.imencode(".JPG", resized_image)
    cropped_image_bytes = buffer.tobytes()

    sys.stdout.buffer.write(cropped_image_bytes)

    print("Cropped image data sent successfully")
    