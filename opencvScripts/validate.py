import os
import cv2
import sys
import numpy as np
import json

image_bytes = sys.stdin.buffer.read()

min_face_height = int(os.environ["MIN_FACE_HEIGHT"]) if os.environ["MIN_FACE_HEIGHT"] else None
max_face_height = int(os.environ["MAX_FACE_HEIGHT"]) if os.environ["MAX_FACE_HEIGHT"] else None
min_face_width = int(os.environ["MIN_FACE_WIDTH"]) if os.environ["MIN_FACE_WIDTH"] else None
max_face_width = int(os.environ["MAX_FACE_WIDTH"]) if os.environ["MAX_FACE_WIDTH"] else None

image_array = np.frombuffer(image_bytes, dtype=np.uint8)

path_to_current_folder = os.path.dirname(os.path.realpath(__file__))

face_cascade = cv2.CascadeClassifier(os.path.join(path_to_current_folder, "haarcascade_frontalface_default.xml"))
eye_cascade = cv2.CascadeClassifier(os.path.join(path_to_current_folder, "haarcascade_eye.xml"))

original_image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

if original_image is None:
    print("Failed to read image data")
    sys.exit(1)
else:
    gray_image = cv2.cvtColor(original_image, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=7, minSize=(int(original_image.shape[1] / 100 * min_face_width), int(original_image.shape[0] / 100 * min_face_height)), maxSize=(int(original_image.shape[1] / 100 * max_face_width), int(original_image.shape[0] / 100 * max_face_height)))

    output = json.dumps({
        "amount_of_faces": len(faces),
    })

    sys.stdout.buffer.write(output.encode("utf-8"))
    