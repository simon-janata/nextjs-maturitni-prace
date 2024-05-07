import os
import cv2
import sys
import numpy as np
import json
import base64
import math

def round_auto(num):
    decimal_part = num - int(num)
    if decimal_part >= 0.5:
        return math.ceil(num)
    else:
        return int(num)

image_bytes = sys.stdin.buffer.read()

image_array = np.frombuffer(image_bytes, dtype=np.uint8)

original_image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

if original_image is None:
    print("Failed to read image data")
    sys.exit(1)
else:
    if original_image.shape[0] < 1500:
        resize_ratio = 1
    else:
      resize_ratio = round_auto(original_image.shape[0] / 1500)
    
    resized_image = cv2.resize(original_image, None, fx=(1 / resize_ratio), fy=(1 / resize_ratio), interpolation=cv2.INTER_AREA)

    retval, buffer = cv2.imencode(".JPG", resized_image)
    resized_image_bytes = buffer.tobytes()

    resized_image_base64 = base64.b64encode(resized_image_bytes).decode()

    output = json.dumps({
        "image": resized_image_base64,
    })

    sys.stdout.buffer.write(output.encode("utf-8"))
