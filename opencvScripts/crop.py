# Import packages
import os
import sys
import numpy as np
import cv2

image_bytes = sys.stdin.buffer.read()

min_face_height = int(os.environ["MIN_FACE_HEIGHT"]) if os.environ["MIN_FACE_HEIGHT"] else None
max_face_height = int(os.environ["MAX_FACE_HEIGHT"]) if os.environ["MAX_FACE_HEIGHT"] else None
min_face_width = int(os.environ["MIN_FACE_WIDTH"]) if os.environ["MIN_FACE_WIDTH"] else None
max_face_width = int(os.environ["MAX_FACE_WIDTH"]) if os.environ["MAX_FACE_WIDTH"] else None
min_eye_height = int(os.environ["MIN_EYE_HEIGHT"]) if os.environ["MIN_EYE_HEIGHT"] else None
max_eye_height = int(os.environ["MAX_EYE_HEIGHT"]) if os.environ["MAX_EYE_HEIGHT"] else None
min_eye_width = int(os.environ["MIN_EYE_WIDTH"]) if os.environ["MIN_EYE_WIDTH"] else None
max_eye_width = int(os.environ["MAX_EYE_WIDTH"]) if os.environ["MAX_EYE_WIDTH"] else None

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

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=7, minSize=(int(img.shape[1] / 100 * min_face_width), int(img.shape[0] / 100 * min_face_height)), maxSize=(int(img.shape[1] / 100 * max_face_width), int(img.shape[0] / 100 * max_face_height)))

    distances_to_eyes_top = []

    for (x, y, w, h) in faces:
        distance_to_face_bottom = y + h
        roi_gray = gray[y:y + h, x:x + w]
        roi_color = img[y:y + h, x:x + w]
        face_center_x = x + w // 2
        eyes = eye_cascade.detectMultiScale(roi_gray, minNeighbors=7, minSize=(int(img.shape[1] / 100 * min_eye_width), int(img.shape[0] / 100 * min_eye_height)), maxSize=(int(img.shape[1] / 100 * max_eye_width), int(img.shape[0] / 100 * max_eye_height)))
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

    # # Display the labeled image
    # cv2.imshow("Face Detection and Labeling", img)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    if start_x < 0:
        start_x = 0

    if start_x + crop_width > img.shape[1]:
        start_x = img.shape[1] - crop_width

    if len(faces) > 0:
        # (x, y, w, h) = faces[0]
        if len(eyes) > 0:
            cropped_image = img[top_y:top_y + crop_height, start_x:start_x + crop_width]
            resized_image = cv2.resize(cropped_image, (1050, 1400))
        else:
            # cropped_image = img
            resized_image = img
    else:
        print("No faces detected")
        sys.exit(1)

    # resized_image = cv2.resize(cropped_image, (1050, 1400))

    retval, buffer = cv2.imencode(".JPG", resized_image)
    cropped_image_bytes = buffer.tobytes()

    sys.stdout.buffer.write(cropped_image_bytes)

    print("Cropped image data sent successfully")
    