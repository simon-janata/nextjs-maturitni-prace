import cv2
import sys
import numpy as np
import json
import base64

image_bytes = sys.stdin.buffer.read()

image_array = np.frombuffer(image_bytes, dtype=np.uint8)

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

original_image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

if original_image is None:
    print("Failed to read image data")
    sys.exit(1)
else:
    resized_image = cv2.resize(original_image, None, fx=(1 / 4), fy=(1 / 4), interpolation=cv2.INTER_AREA)

    gray_image = cv2.cvtColor(resized_image, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=7, minSize=(400, 400))

    is_single_face = len(faces) == 1

    retval, buffer = cv2.imencode(".JPG", resized_image)
    resized_image_bytes = buffer.tobytes()

    resized_image_base64 = base64.b64encode(resized_image_bytes).decode()

    output = json.dumps({
        "image": resized_image_base64,
        "is_single_face": is_single_face
    })

    sys.stdout.buffer.write(output.encode("utf-8"))
